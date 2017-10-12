var config = require('../../configs/config');

module.exports = function(game, Phaser){
  return {
    create: function(x, y, opacity){
      var popup = game.add.group();
      var tint = this.tint(x, y, config.width, config.height, opacity);
      popup.add(tint);
      return popup;
    },
    tint: function(x, y, w, h, opacity, color, key){
      var tint = game.add.sprite(x || config.width / 2, y || config.height / 2, key || 'pixel');
      tint.width = w;
      tint.height = h;
      tint.anchor.set(0.5);
      tint.tint = color || 0x000000;
      tint.alpha = opacity || 0.5;
      return tint;
    },
    textButton: function(x, y, w, h, color, text, callback, context){
      var group = game.add.group();

      var tint = game.add.button(x, y, 'pixel', callback, context);
      tint.width = w;
      tint.height = h;
      tint.anchor.set(0.5);
      tint.tint = 0x000000;
      tint.alpha = 0.5;

      var text = game.add.text(x, y, text, config.UI.popups.textButtonStyle);
      text.fill = color || '#fff';
      text.anchor.set(0.5);

      group.add(tint);
      group.add(text);
      return tint;
    }
  }
}