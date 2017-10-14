var config = require('../../configs/config');
var l10n = require('../l10n');
var UI = require('../../configs/ui');

module.exports = function(game, Phaser){
  var basic = require('../popups/basic')(game, Phaser);
  return {
    create: function(x, y){
      var base = basic.create(x, y, UI.popups.pause.opacity);
      var text = game.add.text(x, y, l10n.get('PAUSE'), UI.popups.pause.textStyle);
      text.anchor.set(0.5);
      text.alpha = 0.1;
      var tween = game.add.tween(text).to( { alpha: 1 }, 500, "Linear", true, 0, -1, true);

      base.add(text);
      return base;
    }
  }
}
