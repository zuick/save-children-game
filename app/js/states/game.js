var config = require('../config');
module.exports = function(game, Phaser){
  var map = require('../modules/map')(game, Phaser);
  var Stray = require('../modules/stray')(game, Phaser);
  var Trap = require('../modules/trap')(game, Phaser);
  var children = [];
  var traps = [];

  return {
    preload: function() {
      map.preload();
      game.load.image('guy', 'assets/guy.png');
      game.load.image('trap', 'assets/trap.png');
    },
    create: function() {
      game.physics.startSystem(Phaser.Physics.ARCADE);
      map.create();
      map.getTilesInLayer(config.map.children.name, config.map.children.children).forEach(function(tile){
        var worldPosition = map.getTileWorldXY(tile);
        var child = new Stray();
        child.create(worldPosition.x, worldPosition.y, map);
        children.push(child);
      });
      map.getTilesInLayer(config.map.colliders.name, config.map.colliders.traps).forEach(function(tile){
        var worldPosition = map.getTileWorldXY(tile);
        var trap = new Trap();
        trap.create(worldPosition.x, worldPosition.y);
        traps.push(trap);
      });
    },
    update: function(){
      var _this = this;
      children.forEach(function(child){
        child.update();
        traps.forEach(function(trap){
          game.physics.arcade.collide(child.getCollider(), trap.getCollider(), _this.trapCollision, null, _this);
        })
      })
    },
    trapCollision: function(obj1, obj2){
      var child = obj1 instanceof Stray ? obj1 : obj2;
      console.log("collision", child);
    }
  }
}
