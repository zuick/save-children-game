var config = require('../configs/config');
var levelsConfig = require('../configs/levels');
var tileSprites = require('../tileSprites');
var l10n = require('../modules/l10n');
var utils = require('../modules/utils');

module.exports = function(game, Phaser){
  var map = require('../modules/map')(game, Phaser);
  var Stray = require('../modules/stray')(game, Phaser);
  var Trap = require('../modules/trap')(game, Phaser);
  var Escape = require('../modules/escape')(game, Phaser);
  var Hero = require('../modules/hero')(game, Phaser);
  var children, traps, escapes, lostChildren, savedChildren, hero, currentLevelIndex, currentBlockIndex, initialChildrenCount, gameover, middleLayer, backLayer;
  var screenParams = {
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    canvas: void 0
  }
  var time = 0;
  var timer;

  return {
    init: function(blockIndex, levelIndex){
      children = [];
      traps = [];
      escapes = [];
      lostChildren = 0;
      savedChildren = 0;
      currentBlockIndex = blockIndex;
      currentLevelIndex = levelIndex;
      gameover = false;
      time = 0;
      this.loadMap();
    },
    loadMap: function(){
      map.create('level' + currentBlockIndex + '-' + currentLevelIndex);
      backLayer = game.add.group();
      middleLayer = game.add.group();
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
      var lastSpriteOptions;
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
    create: function() {
      game.stage.backgroundColor = '#000';
      game.physics.startSystem(Phaser.Physics.ARCADE);
      game.input.onDown.add(this.moveHero, this);

      game.input.keyboard.addKey(Phaser.Keyboard.N).onUp.add(this.nextLevel, this);
      game.time.events.loop(Phaser.Timer.SECOND, this.updateTime, this);

      timer = game.add.text(config.width / 2 - screenParams.offsetX, config.UI.game.timerMarginTop - screenParams.offsetY, utils.formatTime(time), config.UI.game.timerTextStyle);
      timer.anchor.x = 0.5;
      timer.anchor.y = 0.5;
    },
    updateTime: function(){
      time++;
      timer.text = utils.formatTime(time);
    },
    update: function(){
      if(!gameover){
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
          this.nextLevel();
        }

        middleLayer.sort('y', Phaser.Group.SORT_ASCENDING);

        if (game.input.keyboard.isDown(Phaser.Keyboard.ESC)){
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
      this.removeChild(child, function(){ savedChildren++; });
    },
    trapCollision: function(child, trap){
      var index = children.map(function(c){ return c.getCollider() }).indexOf(child);
      var _this = this;
      if(index !== -1){
        children[index].onTrap();
      }
      gameover = true;
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
    destroyFromLayer(layer, object){
      layer.remove(layer.getChildIndex(object));
    },
    destroyHero(){
      if(typeof hero !== 'undefined'){
        this.destroyFromLayer(middleLayer, hero.getCollider());
        hero.destroy();
        hero = void 0;
      }
    },
    moveHero: function(pointer){
      this.destroyHero();

      if(!screenParams.canvas){
        screenParams.canvas = document.getElementsByTagName('canvas')[0];
      }
      screenParams.scale = game.width / screenParams.canvas.clientWidth;
      var ceiled = map.ceilPosition(pointer.x * screenParams.scale - screenParams.offsetX, pointer.y * screenParams.scale - screenParams.offsetY)
      var tileBehind = map.getTileAt(ceiled.x, ceiled.y);
      if(tileBehind && config.map.main.walls.indexOf(tileBehind.index) === -1 ){
        hero = new Hero();
        hero.create(ceiled.x, ceiled.y, map, tileSprites[config.map.objects.hero[0]], config.hero.bodyScale);
        var childOverlap = children.some(function(child){ return child.isBodyOverlap(hero.getCollider())});
        middleLayer.add(hero.getCollider());
        if(childOverlap){
          this.destroyHero();
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
