var config = require('../config');
module.exports = function(game, Phaser){
  var map = require('../modules/map')(game, Phaser);
  var Stray = require('../modules/stray')(game, Phaser);
  var children = [];

  return {
    preload: function() {
      map.preload();
      game.load.image('guy', 'assets/guy.png');
    },
    create: function() {
      map.create();
      map.getTilesInLayer(config.map.children.name, config.map.children.children).forEach(function(tile){
        var worldPosition = map.getTileWorldXY(tile);
        var child = new Stray();
        child.create(worldPosition.x, worldPosition.y, map);
        children.push(child);
      });
    },
    update: function(){
      children.forEach(function(child){
        child.update();
      })
    }
  }
}
