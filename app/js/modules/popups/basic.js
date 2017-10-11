var config = require('../../configs/config');

module.exports = function(game, Phaser){
  return {
    create: function(x, y, opacity){
      var tint = game.add.sprite(x || config.width / 2, y || config.height / 2, 'pixel');
      tint.width = config.width;
      tint.height = config.height;
      tint.anchor.set(0.5);
      tint.tint = 0x000000;
      tint.alpha = opacity || 0.3;
      return tint;
    }
  }
}
