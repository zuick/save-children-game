var config = require('../configs/config');
var levelsConfig = require('../configs/levels');
var tileSprites = require('../tileSprites');
var l10n = require('../modules/l10n');
var utils = require('../modules/utils');

var states = {
  normal: 0,
  paused: 1,
  success: 2,
  gameover: 3
}

module.exports = function(game, Phaser){
  var map = require('../modules/map')(game, Phaser);
  var Stray = require('../modules/stray')(game, Phaser);
  var Trap = require('../modules/trap')(game, Phaser);
  var Escape = require('../modules/escape')(game, Phaser);
  var Hero = require('../modules/hero')(game, Phaser);
  var pausePopupCreator = require('../modules/popups/pause')(game, Phaser);
  var successPopupCreator = require('../modules/popups/success')(game, Phaser);
  var children, traps, escapes, savedChildren, hero,
    currentLevelIndex, currentBlockIndex, initialChildrenCount,
    middleLayer, backLayer, UILayer,
    timerText, state, pauseButton, statusText, levelNumberText,
    pausePopup, successPopup, gameoverPopup;

  var screenParams = {
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    canvas: void 0
  }
  var time = 0;
  return {
    init: function(blockIndex, levelIndex){
      children = [];
      traps = [];
      escapes = [];
      savedChildren = 0;
      initialChildrenCount = 0;
      currentBlockIndex = blockIndex;
      currentLevelIndex = levelIndex;
      time = 0;
      state = states.normal;
      timerText = void 0;
      statusText = void 0;
      levelNumberText = void 0;
      pauseButton = void 0;

      if(pausePopup) pausePopup.destroy();
      pausePopup = void 0;

      if(successPopup) successPopup.destroy();
      successPopup = void 0;

      if(gameoverPopup) gameoverPopup.destroy();
      gameoverPopup = void 0;
      this.loadMap();
    },
    loadMap: function(){
      map.create('level' + currentBlockIndex + '-' + currentLevelIndex, void 0, this.isHeroOnTile.bind(this));
      backLayer = game.add.group();
      middleLayer = game.add.group();
      UILayer = game.add.group();
      var childSpeed = levelsConfig[currentBlockIndex][currentLevelIndex].childrenSpeed || config.children.defaultSpeed;
      // underground
      map.getTilesInLayer(config.map.main.name).forEach(function(tile, index){
        var worldPosition = map.getTileWorldXY(tile);
        var spriteOptions = tileSprites[tile.index];

        if(spriteOptions && config.map.main.underground.indexOf(tile.index) !== -1){
          backLayer.create(worldPosition.x + spriteOptions.offsetX, worldPosition.y + spriteOptions.offsetY, spriteOptions.shadow.key);
        }
      });

      // fill gorunds, empty space with last ground option
      var lastSpriteOptions = { key: 'ground01', offsetX: 0, offsetY: 0 };
      map.getTilesInLayer(config.map.main.name).forEach(function(tile, index){
        var worldPosition = map.getTileWorldXY(tile);
        var spriteOptions = tileSprites[tile.index];

        if(spriteOptions && config.map.main.ground.indexOf(tile.index) !== -1){
          backLayer.create(worldPosition.x + spriteOptions.offsetX, worldPosition.y + spriteOptions.offsetY, spriteOptions.key);
          lastSpriteOptions = spriteOptions;
        }

        if(spriteOptions && config.map.main.groundDanger.indexOf(tile.index) !== -1){
          var instance = new Trap();
          instance.create(worldPosition.x, worldPosition.y, spriteOptions);
          backLayer.add(instance.getCollider());
          traps.push(instance);
        }

        if(lastSpriteOptions && config.map.main.walls.indexOf(tile.index) !== -1){
          backLayer.create(worldPosition.x + lastSpriteOptions.offsetX, worldPosition.y + lastSpriteOptions.offsetY, lastSpriteOptions.key);
        }
      });

      // fill shadows
      map.getTilesInLayer(config.map.main.name, config.map.main.walls).forEach(function(tile, index){
        var worldPosition = map.getTileWorldXY(tile);
        var spriteOptions = tileSprites[tile.index];

        if(spriteOptions && spriteOptions.shadow){
          backLayer.create(worldPosition.x + spriteOptions.shadow.offsetX, worldPosition.y + spriteOptions.shadow.offsetY, spriteOptions.shadow.key);
        }
      });

      // fill houses
      map.getTilesInLayer(config.map.main.name, config.map.main.walls).forEach(function(tile, index){
        var worldPosition = map.getTileWorldXY(tile);
        var spriteOptions = tileSprites[tile.index];

        if(spriteOptions){
          middleLayer.create(worldPosition.x + spriteOptions.offsetX, worldPosition.y + spriteOptions.offsetY, spriteOptions.key);
        }
      });

      // objects
      if(map.get().objects.objects){
        map.get().objects.objects.forEach(function(obj){
          var spriteOptions = tileSprites[obj.gid];
          var worldPosition = map.ceilPosition(obj.x + map.get().tileWidth / 2, obj.y - map.get().tileHeight / 2);
          if(spriteOptions){
            // children
            if(config.map.objects.children.indexOf(obj.gid) !== -1){
              var instance = new Stray();
              var ceiled = map.ceilPosition(worldPosition.x, worldPosition.y);

              instance.create(ceiled.x, ceiled.y, map, childSpeed, spriteOptions, config.children.bodyScale, obj.properties);
              children.push(instance);
              middleLayer.add(instance.getCollider());

            }else if(config.map.objects.escapes.indexOf(obj.gid) !== -1){
              var instance = new Escape();
              instance.create(worldPosition.x, worldPosition.y, spriteOptions);
              backLayer.add(instance.getCollider());
              escapes.push(instance);

            }else if(config.map.objects.hero.indexOf(obj.gid) !== -1){
              hero = new Hero();
              hero.create(worldPosition.x, worldPosition.y, map, spriteOptions, config.hero.bodyScale);
              middleLayer.add(hero.getCollider());

            }
          }
        });
      }

      initialChildrenCount = children.length;

      screenParams.offsetX = (config.width - map.getSize().x) / 2;
      screenParams.offsetY = (config.height - map.getSize().y) / 2;

      game.world.setBounds(-screenParams.offsetX, -screenParams.offsetY, config.width - screenParams.offsetX, config.height - screenParams.offsetY);
    },
    createText: function(options, text, anchor){
      var t = game.add.text(
        config.width / 2 - screenParams.offsetX + options.offsetX,
        options.marginTop - screenParams.offsetY,
        text,
        options.style
      );
      t.anchor.set(anchor);
      return t;
    },
    create: function() {
      game.stage.backgroundColor = '#000';
      game.physics.startSystem(Phaser.Physics.ARCADE);
      game.input.onDown.add(this.onPointerDown, this);

      game.input.keyboard.addKey(Phaser.Keyboard.N).onUp.add(this.nextLevel, this);
      game.time.events.loop(Phaser.Timer.SECOND, this.updateTime, this);

      timerText = this.createText(config.UI.game.timerText, utils.formatTime(time), 0.5);
      levelNumberText = this.createText(config.UI.game.levelNumberText, currentLevelIndex + 1, 0.5);
      statusText = this.createText(config.UI.game.statusText, "", 0.5);

      UILayer.add(timerText);
      UILayer.add(levelNumberText);
      UILayer.add(statusText);

      pauseButton = game.add.button(
        config.width / 2 - screenParams.offsetX + config.UI.game.pauseButton.offsetX,
        config.UI.game.pauseButton.marginTop - screenParams.offsetY,
        'pauseButton',
        this.onPauseClicked,
        this,
        0
      );

      pauseButton.anchor.set(0.5);
      UILayer.add(pauseButton);

      this.updateStatusText();savedChildren + " / " + children.length
    },
    onPauseClicked: function(){
      if(state === states.normal){
        state = states.paused;
        if(pauseButton){
          pauseButton.input.enabled = false;
          pauseButton.setFrames(1, 1, 1);
        }
        pausePopup = pausePopupCreator.create(config.width / 2 - screenParams.offsetX, config.height / 2 - screenParams.offsetY);
      }
    },
    onContinueClicked: function(){
      if(state === states.paused){
        state = states.normal;
        if(pauseButton){
          pauseButton.input.enabled = true;
          pauseButton.setFrames(0, 0, 0);
        }
        if(pausePopup) pausePopup.destroy();
      }
    },
    updateTime: function(){
      if(state === states.normal){
        time++;
        timerText.text = utils.formatTime(time);
      }
    },
    update: function(){
      if(state === states.normal){
        var _this = this;
        children.forEach(function(child){
          traps.forEach(function(trap){
            game.physics.arcade.collide(child.getCollider(), trap.getCollider(), _this.trapCollision, null, _this);
          });

          escapes.forEach(function(esc){
            game.physics.arcade.collide(child.getCollider(), esc.getCollider(), _this.escapeCollision, null, _this);
          });

          if(hero){
            game.physics.arcade.collide(child.getCollider(), hero.getCollider(), _this.heroCollision, null, _this);
          }
          child.update();
        });

        if(initialChildrenCount !== 0 && initialChildrenCount === savedChildren){
          successPopup = successPopupCreator.create(
            config.width / 2 - screenParams.offsetX,
            config.height / 2 - screenParams.offsetY,
            time, savedChildren, initialChildrenCount,
            this.nextLevel, this
          );
          state = states.success;
        }

        middleLayer.sort('y', Phaser.Group.SORT_ASCENDING);

        if (game.input.keyboard.isDown(Phaser.Keyboard.ESC)){
          this.destroyHero();
          game.state.start('levels', true, false, void 0);
        }
      }
    },
    nextLevel: function(){
      this.destroyHero();
      var nextBlockIndex = currentLevelIndex + 1 >= levelsConfig[currentBlockIndex].length ? currentBlockIndex + 1 : currentBlockIndex;
      nextBlockIndex = nextBlockIndex >= levelsConfig.length ? 0 : nextBlockIndex;
      var nextLevelIndex = currentLevelIndex + 1 >= levelsConfig[nextBlockIndex].length || nextBlockIndex !== currentBlockIndex ? 0 : currentLevelIndex + 1;

      game.state.restart(true, false, nextBlockIndex, nextLevelIndex);
    },
    escapeCollision: function(child, esc){
      this.removeChild(child, function(){ savedChildren++; this.updateStatusText() }.bind(this));
    },
    updateStatusText: function(){
      if(statusText){
        statusText.text = savedChildren + " / " + initialChildrenCount;
      }
    },
    trapCollision: function(child, trap){
      var index = children.map(function(c){ return c.getCollider() }).indexOf(child);
      var _this = this;
      if(index !== -1){
        children[index].onTrap();
      }
      state = states.gameover;
      setTimeout(function(){
        _this.destroyHero();
        game.state.restart(true, false, currentBlockIndex, currentLevelIndex);
      }, 1000);
    },
    heroCollision: function(child, hero){
      var index = children.map(function(c){ return c.getCollider() }).indexOf(child);
      if(index !== -1){
        children[index].onHero();
      }
    },
    removeChild: function(child, onRemove){
      var index = children.map(function(c){ return c.getCollider() }).indexOf(child);
      if(index !== -1){
        this.destroyFromLayer(middleLayer, child);
        children[index].destroy();
        children.splice(index, 1);
        if(typeof onRemove === 'function'){
          onRemove(child);
        }
      }
    },
    destroyFromLayer: function(layer, object){
      layer.remove(layer.getChildIndex(object));
    },
    destroyHero: function(){
      if(typeof hero !== 'undefined'){
        this.destroyFromLayer(middleLayer, hero.getCollider());
        hero.destroy();
        hero = void 0;
      }
    },
    isHeroOnTile: function(tile){
      if(hero){
        var heroTile = map.getTileAt(hero.getCollider().x, hero.getCollider().y);
        return tile === heroTile;
      }
      return false;
    },
    onPointerDown: function(pointer){
      if(state === states.paused){
        this.onContinueClicked();
      }else if(state === states.normal){
        this.destroyHero();

        if(!screenParams.canvas){
          screenParams.canvas = document.getElementsByTagName('canvas')[0];
        }

        var ceiled = map.ceilPosition(pointer.x - screenParams.offsetX, pointer.y - screenParams.offsetY)
        var tileBehind = map.getTileAt(ceiled.x, ceiled.y);
        if(tileBehind &&
          config.map.main.walls.indexOf(tileBehind.index) === -1 &&
          traps.map(function(t){ return map.ceilPosition(t.getCollider().x, t.getCollider().y) }).filter(function(p){ return ceiled.x === p.x && ceiled.y === p.y }).length === 0 // no traps on this tile
        ){
          hero = new Hero();
          hero.create(ceiled.x, ceiled.y, map, tileSprites[config.map.objects.hero[0]], config.hero.bodyScale);
          var childOverlap = children.some(function(child){ return child.isBodyOverlap(hero.getCollider())});
          middleLayer.add(hero.getCollider());
          if(childOverlap){
            this.destroyHero();
          }
        }
      }
    },
    render: function(){
      if(config.debug){
        children.forEach(function(child){
          child.render();
        });
        if(hero){
          hero.render();
        }
      }
    }
  }
}
