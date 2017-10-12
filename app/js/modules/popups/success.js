var config = require('../../configs/config');
var l10n = require('../l10n');
var utils = require('../utils');

module.exports = function(game, Phaser){
  var basic = require('../popups/basic')(game, Phaser);
  return {
    create: function(x, y, time, children, childrenTotal, onNextButton, context){
      var options = config.UI.popups.success;
      var base = basic.create(x, y, options.opacity);
      var text = game.add.text(x, y + options.header.offsetY, l10n.get('CONGRATULATIONS'), options.header.style);
      text.anchor.set(0.5);

      var time = game.add.text(x, y + options.time.offsetY, l10n.get('TIME', [utils.formatTime(time)]), options.time.style);
      time.anchor.set(0.5);

      var stat = game.add.text(x, y + options.stat.offsetY, l10n.get('STAT', [children, childrenTotal]), options.stat.style);
      stat.anchor.set(0.5);

      var next = game.add.button(x + options.nextButton.offsetX, y + options.nextButton.offsetY, 'pauseButton', onNextButton, context, 1 );
      next.setFrames(1, 1, 1);
      next.anchor.set(0.5);
      next.scale.set(2);

      base.add(text);
      base.add(next);
      base.add(time);
      base.add(stat);
      return base;
    }
  }
}
