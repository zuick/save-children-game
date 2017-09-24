var config = require('../config');
module.exports = function(game, Phaser){
  var map = require('../modules/map')(game, Phaser);
  var cursors;

  return {
    create: function(){
      map.create('level');

      sortGroup = game.add.group();
      map.getTilesInLayer(config.map.main.name, config.map.main.ground).forEach(function(tile, index){
        var worldPosition = map.getTileWorldXY(tile);
        sortGroup.create(worldPosition.x, worldPosition.y, Math.random() > 0.5 ? 'ground01' : 'ground02');
      });
      cursors = game.input.keyboard.createCursorKeys();
      var offsetX = (config.width - map.getSize().x) / 2;
      var offsetY = (config.height - map.getSize().y) / 2;

      game.world.setBounds(-offsetX, -offsetY, config.width - offsetX, config.height - offsetY);
    }
  }
}
