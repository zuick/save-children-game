var config = require('../config');
module.exports = function(game, Phaser){
  var map = require('../modules/map')(game, Phaser);
  var Stray = require('../modules/stray')(game, Phaser);
  var Trap = require('../modules/trap')(game, Phaser);
  var Escape = require('../modules/escape')(game, Phaser);
  var Hero = require('../modules/hero')(game, Phaser);
  var children, traps, escapes, lostChildren, savedChildren, hero, currentLevelIndex, initialChildrenCount;

  return {
    init: function(levelIndex){
      children = [];
      traps = [];
      escapes = [];
      lostChildren = 0;
      savedChildren = 0;
      currentLevelIndex = levelIndex;
      this.loadMap();
    },
    shutDown : function(){
      console.log("shutDown");
    },
    loadMap: function(){
      map.create('level' + currentLevelIndex);

      map.getTilesInLayer(config.map.children.name, config.map.children.children).forEach(function(tile){
        var worldPosition = map.getTileWorldXY(tile);
        var instance = new Stray();
        instance.create(worldPosition.x, worldPosition.y, map, config.levels[currentLevelIndex].childrenSpeed);
        children.push(instance);
      });
      initialChildrenCount = children.length;
      traps = this.createGroupFromLayer(config.map.colliders.name, config.map.colliders.traps, Trap, false);
      escapes = this.createGroupFromLayer(config.map.colliders.name, config.map.colliders.escapes, Escape, false);
    },
    create: function() {
      game.stage.backgroundColor = '#000';
      game.physics.startSystem(Phaser.Physics.ARCADE);
      game.input.onDown.add(this.moveHero, this);
    },
    update: function(){
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
      if(initialChildrenCount === lostChildren + savedChildren){
        var nextLevelIndex = currentLevelIndex + 1;
        if(nextLevelIndex >= config.levels.length){
          game.state.start('start', true, false);
        }else{
          game.state.restart(true, false, nextLevelIndex);
        }
      }
    },
    escapeCollision: function(child, esc){
      this.removeChild(child, function(){ savedChildren++; });
    },
    trapCollision: function(child, trap){
      this.removeChild(child, function(){ lostChildren++; });
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
          onRemove();
        }
      }
    },
    createGroupFromLayer: function(layerName, itemIndexes, Proto){
      var group = [];
      map.getTilesInLayer(layerName, itemIndexes).forEach(function(tile){
        var worldPosition = map.getTileWorldXY(tile);
        var instance = new Proto();
        instance.create(worldPosition.x, worldPosition.y);
        group.push(instance);
      });
      return group;
    },
    moveHero: function(pointer){
      if(typeof hero !== 'undefined'){
        hero.destroy();
      }

      var x = Math.floor(Math.round(pointer.x) / map.get().tileWidth) * map.get().tileWidth;
      var y = Math.floor(Math.round(pointer.y) / map.get().tileHeight) * map.get().tileHeight;
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
      game.debug.text("In trap: " + lostChildren, 10, game.height - 15);
      game.debug.text("Saved: " + savedChildren, game.width - 100, game.height - 15);
    }
  }
}
