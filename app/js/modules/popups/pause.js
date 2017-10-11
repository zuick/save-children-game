var config = require('../../configs/config');
var l10n = require('../l10n');

module.exports = function(game, Phaser){
  var basic = require('../popups/basic')(game, Phaser);
  return {
    create: function(x, y){
      var base = basic.create(x, y, config.UI.popups.pause.opacity);
      var text = game.add.text(x, y, l10n.get('PAUSE'), config.UI.popups.pause.textStyle);
      text.anchor.set(0.5);
      text.alpha = 0.1;
      var tween = game.add.tween(text).to( { alpha: 1 }, 500, "Linear", true, 0, -1, true);

      base.add(text);
      return base;
    }
  }
}
