module.exports = function(game, Phaser){
  var map = require('../modules/map')(game, Phaser);
  var hero = require('../modules/hero')(game, Phaser);
  return {
    preload: function() {
      map.preload();
      hero.preload();
    },
    create: function() {
      map.create();
      hero.create(map);
    },
    update: function(){
      hero.update();
    },
    render: function(){
      hero.render();
    }
  }
}
