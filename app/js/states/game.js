module.exports = function(game, Phaser){
  var map = require('../modules/map')(game, Phaser);
  var hero = require('../modules/hero')(game, Phaser);
  return {
    preload: function() {
      map.preload();
      hero.preload();
    },
    create: function() {
      game.physics.startSystem(Phaser.Physics.ARCADE);
      map.create();
      hero.create();
    },
    update: function(){  
      hero.update();
      game.physics.arcade.collide(hero.getCollider(), map.getColliderLayer());
    },
    render: function(){
      hero.render();
    }
  }
}
