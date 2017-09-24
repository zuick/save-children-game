var config = require('../config');
module.exports = function(game, Phaser){
  var map = require('../modules/map')(game, Phaser);

  return {
    create: function(){
      map.create('level');

      sortGroup = game.add.group();
      map.getTilesInLayer(config.map.main.name, config.map.main.ground).forEach(function(tile){
        var worldPosition = map.getTileWorldXY(tile);
        sortGroup.create(worldPosition.x, worldPosition.y -16, Math.random() > 0.5 ? 'ground01' : 'ground02');
      });
    }
  }
}
