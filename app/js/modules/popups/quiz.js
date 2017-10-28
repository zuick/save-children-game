var config = require('../../configs/config');
var UI = require('../../configs/ui');
var l10n = require('../l10n');
var utils = require('../utils');

module.exports = function(game, Phaser){
  var basic = require('../popups/basic')(game, Phaser);
  return {
    create: function(x, y, onAccept, onCancel, context){
      var options = UI.popups.quiz;
      var base = basic.create(x, y, options.opacity);
      var win = basic.tint(x, y, options.width, options.height, 1, 0xc24729, 'popup');
      win.scale.set(options.scale);

      var acceptButton = basic.button(x, y + 100, 'buttonsLarge', 0, onAccept, context);
      var acceptButtonText = game.add.text(x, y + 100, "Помедленней!", options.style );
      acceptButtonText.anchor.set(0.5);
      
      base.add(win);
      base.add(acceptButton);
      base.add(acceptButtonText);
      return base;
    }
  }
}
