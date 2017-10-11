var config = require('../../configs/config');
var l10n = require('../l10n');

module.exports = function(game, Phaser){
  var basic = require('../popups/basic')(game, Phaser);
  return {
    create: function(x, y){
      var popup = game.add.group();
      var base = basic.create(x, y, config.UI.popups.pause.opacity);
      var text = game.add.text(x, y, l10n.get('PAUSE'), config.UI.popups.pause.textStyle);
      text.anchor.set(0.5);

      popup.add(base);
      popup.add(text);
      return popup;
    }
  }
}
