var config = require('../config');
var tileSprites = require('../tileSprites');

module.exports = function(game, Phaser){
  var map = require('../modules/map')(game, Phaser);
  var cursors;

  return {
    create: function(){
      map.create('level0');

      // fill gorunds, empty space with last ground option
      var lastSpriteOptions;
      map.getTilesInLayer(config.map.main.name).forEach(function(tile, index){
        var worldPosition = map.getTileWorldXY(tile);
        var spriteOptions = tileSprites[tile.index];

        if(spriteOptions && config.map.main.ground.indexOf(tile.index) !== -1){
          game.add.sprite(worldPosition.x + spriteOptions.offsetX, worldPosition.y + spriteOptions.offsetY, spriteOptions.key);
          lastSpriteOptions = spriteOptions;
        }

        if(lastSpriteOptions && config.map.main.walls.indexOf(tile.index) !== -1){
          game.add.sprite(worldPosition.x + lastSpriteOptions.offsetX, worldPosition.y + lastSpriteOptions.offsetY, lastSpriteOptions.key);
        }
      });
      // fill shadows
      map.getTilesInLayer(config.map.main.name, config.map.main.walls).forEach(function(tile, index){
        var worldPosition = map.getTileWorldXY(tile);
        var spriteOptions = tileSprites[tile.index];

        if(spriteOptions && spriteOptions.shadow){
          game.add.sprite(worldPosition.x + spriteOptions.shadow.offsetX, worldPosition.y + spriteOptions.shadow.offsetY, spriteOptions.shadow.key);
        }
      });
      // fill houses
      map.getTilesInLayer(config.map.main.name, config.map.main.walls).forEach(function(tile, index){
        var worldPosition = map.getTileWorldXY(tile);
        var spriteOptions = tileSprites[tile.index];

        if(spriteOptions){
          game.add.sprite(worldPosition.x + spriteOptions.offsetX, worldPosition.y + spriteOptions.offsetY, spriteOptions.key);
        }
      });

      var offsetX = (config.width - map.getSize().x) / 2;
      var offsetY = (config.height - map.getSize().y) / 2;

      game.world.setBounds(-offsetX, -offsetY, config.width - offsetX, config.height - offsetY);
    }
  }
}
