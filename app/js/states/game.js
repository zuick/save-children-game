var config = require('../config');
module.exports = function(game, Phaser){
  var map = require('../modules/map')(game, Phaser);
  var Stray = require('../modules/stray')(game, Phaser);
  var Trap = require('../modules/trap')(game, Phaser);
  var Escape = require('../modules/escape')(game, Phaser);
  var children = [];
  var traps = [];
  var escapes = [];
  var lostChildren = 0;
  var savedChildren = 0;

  return {
    preload: function() {
      map.preload();
      game.load.image('guy', 'assets/guy.png');
      game.load.image('trap', 'assets/trap.png');
      game.load.image('escape', 'assets/escape.png');
    },
    create: function() {
      game.physics.startSystem(Phaser.Physics.ARCADE);
      map.create();
      children = this.createGroupFromLayer(config.map.children.name, config.map.children.children, Stray, true);
      traps = this.createGroupFromLayer(config.map.colliders.name, config.map.colliders.traps, Trap, false);
      escapes = this.createGroupFromLayer(config.map.colliders.name, config.map.colliders.escapes, Escape, false);
    },
    update: function(){
      var _this = this;
      children.forEach(function(child){
        child.update();
        traps.forEach(function(trap){
          game.physics.arcade.collide(child.getCollider(), trap.getCollider(), _this.trapCollision, null, _this);
        })
        escapes.forEach(function(esc){
          game.physics.arcade.collide(child.getCollider(), esc.getCollider(), _this.escapeCollision, null, _this);
        })
      })
    },
    escapeCollision: function(child, esc){
      this.removeChild(child, function(){ savedChildren++; });
    },
    trapCollision: function(child, trap){
      this.removeChild(child, function(){ lostChildren++; });
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
    render: function(){
      game.debug.text("In trap: " + lostChildren, 10, game.height - 15);
      game.debug.text("Saved: " + savedChildren, game.width - 100, game.height - 15);
    }
  }
}
