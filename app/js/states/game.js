var config = require('../config');
module.exports = function(game, Phaser){
  var map = require('../modules/map')(game, Phaser);
  var Stray = require('../modules/stray')(game, Phaser);
  var Trap = require('../modules/trap')(game, Phaser);
  var Escape = require('../modules/escape')(game, Phaser);
  var Hero = require('../modules/hero')(game, Phaser);
  var children = [];
  var traps = [];
  var escapes = [];
  var lostChildren = 0;
  var savedChildren = 0;
  var hero;

  return {
    preload: function() {
      map.preload();
      game.load.image('guy', 'assets/guy.png');
      game.load.image('trap', 'assets/trap.png');
      game.load.image('escape', 'assets/escape.png');
      game.load.image('hero', 'assets/hero.png');
    },
    create: function() {
      game.physics.startSystem(Phaser.Physics.ARCADE);
      map.create();
      children = this.createGroupFromLayer(config.map.children.name, config.map.children.children, Stray, true);
      traps = this.createGroupFromLayer(config.map.colliders.name, config.map.colliders.traps, Trap, false);
      escapes = this.createGroupFromLayer(config.map.colliders.name, config.map.colliders.escapes, Escape, false);
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
      })
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
    createGroupFromLayer: function(layerName, itemIndexes, Proto, passMap){
      var group = [];
      map.getTilesInLayer(layerName, itemIndexes).forEach(function(tile){
        var worldPosition = map.getTileWorldXY(tile);
        var instance = new Proto();
        instance.create(worldPosition.x, worldPosition.y, passMap ? map : void 0);
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
