var config = require('../config');
var tileSprites = require('../tileSprites');

module.exports = function(game, Phaser){
  var map = require('../modules/map')(game, Phaser);
  var Stray = require('../modules/stray')(game, Phaser);
  var Trap = require('../modules/trap')(game, Phaser);
  var Escape = require('../modules/escape')(game, Phaser);
  var Hero = require('../modules/hero')(game, Phaser);
  var children, traps, escapes, lostChildren, savedChildren, hero, currentLevelIndex, initialChildrenCount, gameover, middleLayer, backLayer;
  var screenParams = {
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    canvas: void 0
  }

  return {
    init: function(levelIndex){
      children = [];
      traps = [];
      escapes = [];
      lostChildren = 0;
      savedChildren = 0;
      currentLevelIndex = levelIndex;
      gameover = false;
      this.loadMap();
    },
    loadMap: function(){
      map.create('level' + currentLevelIndex);
      backLayer = game.add.group();
      middleLayer = game.add.group();
      // fill gorunds, empty space with last ground option

      var lastSpriteOptions;
      map.getTilesInLayer(config.map.main.name).forEach(function(tile, index){
        var worldPosition = map.getTileWorldXY(tile);
        var spriteOptions = tileSprites[tile.index];

        if(spriteOptions && config.map.main.ground.indexOf(tile.index) !== -1){
          backLayer.create(worldPosition.x + spriteOptions.offsetX, worldPosition.y + spriteOptions.offsetY, spriteOptions.key);
          lastSpriteOptions = spriteOptions;
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

      // children
      map.getTilesInLayer(config.map.objects.name, config.map.objects.children).forEach(function(tile){
        var worldPosition = map.getTileWorldXY(tile);
        var spriteOptions = tileSprites[tile.index];
        if(spriteOptions){
          var instance = new Stray();
          instance.create(
            worldPosition.x,
            worldPosition.y,
            map,
            config.levels[currentLevelIndex].childrenSpeed,
            false,
            spriteOptions,
            config.children.bodyScale
          );
          children.push(instance);
          middleLayer.add(instance.getCollider());
        }
      });

      initialChildrenCount = children.length;
      //traps = this.createGroupFromLayer(config.map.colliders.name, config.map.colliders.traps, Trap, false);
      escapes = this.createGroupFromLayer(config.map.objects.name, config.map.objects.escapes, Escape, false);

      screenParams.offsetX = (config.width - map.getSize().x) / 2;
      screenParams.offsetY = (config.height - map.getSize().y) / 2;

      game.world.setBounds(-screenParams.offsetX, -screenParams.offsetY, config.width - screenParams.offsetX, config.height - screenParams.offsetY);
    },
    create: function() {
      game.stage.backgroundColor = '#000';
      game.physics.startSystem(Phaser.Physics.ARCADE);
      game.input.onDown.add(this.moveHero, this);

      game.input.keyboard.addKey(Phaser.Keyboard.N).onUp.add(this.nextLevel, this);
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
        if(initialChildrenCount === savedChildren){
          this.nextLevel();
        }

        middleLayer.sort('y', Phaser.Group.SORT_ASCENDING);
      }
    },
    nextLevel: function(){
      var nextLevelIndex = currentLevelIndex + 1;
      if(nextLevelIndex >= config.levels.length){
        game.state.restart(true, false, 0);
      }else{
        game.state.restart(true, false, nextLevelIndex);
      }
    },
    escapeCollision: function(child, esc){
      this.removeChild(child, function(){ savedChildren++; });
    },
    trapCollision: function(child, trap){
      var index = children.map(function(c){ return c.getCollider() }).indexOf(child);
      if(index !== -1){
        children[index].onTrap();
      }
      gameover = true;
      setTimeout(function(){
        game.state.restart(true, false, currentLevelIndex);
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
        children.splice(index, 1);
        child.destroy();
        if(typeof onRemove === 'function'){
          onRemove(child);
        }
      }
    },
    createGroupFromLayer: function(layerName, itemIndexes, Proto){
      var group = [];
      map.getTilesInLayer(layerName, itemIndexes).forEach(function(tile){
        var worldPosition = map.getTileWorldXY(tile);
        var spriteOptions = tileSprites[tile.index];
        if(spriteOptions){
          var instance = new Proto();
          instance.create(worldPosition.x + spriteOptions.offsetX, worldPosition.y + spriteOptions.offsetY, spriteOptions);
        }
        backLayer.add(instance.getCollider());
        group.push(instance);
      });
      return group;
    },
    moveHero: function(pointer){
      if(typeof hero !== 'undefined'){
        hero.destroy();
      }
      if(!screenParams.canvas){
        screenParams.canvas = document.getElementsByTagName('canvas')[0];
      }
      screenParams.scale = game.width / screenParams.canvas.clientWidth;
      var x = Math.floor(Math.round(pointer.x * screenParams.scale - screenParams.offsetX) / map.get().tileWidth) * map.get().tileWidth;
      var y = Math.floor(Math.round(pointer.y * screenParams.scale - screenParams.offsetY) / map.get().tileHeight) * map.get().tileHeight;
      var tileBehind = map.getTileAt(x, y);
      if(config.map.main.walls.indexOf(tileBehind.index) === -1){
        var childOverlap = children.some(function(child){ return child.isOverlap(tileBehind)});
        if(!childOverlap){
          hero = new Hero();
          hero.create(x, y);
        }
      }
    },
    render: function(){
      game.debug.text("Level " + (currentLevelIndex + 1), game.width / 2 - 40, 20);
      if(config.debug){
        children.forEach(function(child){
          child.render();
        });
      }
    }
  }
}
