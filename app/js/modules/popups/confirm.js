var config = require('../../configs/config');
var UI = require('../../configs/ui');
var l10n = require('../l10n');
var utils = require('../utils');

module.exports = function(game, Phaser){
  var basic = require('../popups/basic')(game, Phaser);
  return {
    create: function(x, y, description, onAccept, onCancel, context){
      var options = UI.popups.confirm;
      var base = basic.create(x, y, options.opacity);
      var win = basic.tint(x, y, options.width, options.height, 1, 0xc24729, 'popupSmall');
      var scale = utils.getUIScale();
      
      var descriptionText = game.add.text(x, y + options.description.offsetY * scale, description, options.description.style);
      descriptionText.anchor.set(0.5);

      var acceptButton = basic.button(x + options.buttons.acceptOffsetX * scale, y + options.buttons.offsetY * scale, 'buttonsLarge', 0, onAccept, context);
      var acceptButtonText = game.add.text(x + options.buttons.acceptOffsetX * scale, y + options.buttons.offsetY * scale, l10n.get('ACCEPT'), options.buttons.style );
      acceptButtonText.anchor.set(0.5);
      var cancelButton = basic.button(x + options.buttons.cancelOffsetX * scale, y + options.buttons.offsetY * scale, 'buttonsLarge', 2, onCancel, context);
      var cancelButtonText = game.add.text(x + options.buttons.cancelOffsetX * scale, y + options.buttons.offsetY * scale, l10n.get('CANCEL'), options.buttons.style );
      cancelButtonText.anchor.set(0.5);

      base.add(win);
      base.add(descriptionText);

      base.add(acceptButton);
      base.add(acceptButtonText);
      base.add(cancelButton);
      base.add(cancelButtonText);

      basic.scale(base, scale);
      return base;
    }
  }
}
