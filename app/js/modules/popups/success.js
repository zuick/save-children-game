var config = require('../../configs/config');
var l10n = require('../l10n');
var utils = require('../utils');

module.exports = function(game, Phaser){
  var basic = require('../popups/basic')(game, Phaser);
  return {
    create: function(x, y, time, children, childrenTotal, onToMenu, onToLevels, onReplay, onNext, context){
      var options = config.UI.popups.success;
      var base = basic.create(x, y, options.opacity);
      var win = basic.tint(x, y, options.width, options.height, 0.9, 'pixel_brown');

      var text = game.add.text(x, y + options.header.offsetY, l10n.get('CONGRATULATIONS'), options.header.style);
      text.anchor.set(0.5);

      var time = game.add.text(x, y + options.time.offsetY, l10n.get('TIME', [utils.formatTime(time)]), options.time.style);
      time.anchor.set(0.5);

      var stat = game.add.text(x, y + options.stat.offsetY, l10n.get('STAT', [children, childrenTotal]), options.stat.style);
      stat.anchor.set(0.5);

      var toMenu = basic.textButton(x + options.buttons.toMenuOffsetX, y + options.buttons.offsetY, 200, 75, '', 'Menu', onToMenu, context);
      var toLevels = basic.textButton(x + options.buttons.toLevelsOffsetX, y + options.buttons.offsetY, 200, 75, '', 'Levels', onToLevels, context);
      var replay = basic.textButton(x + options.buttons.replayOffsetX, y + options.buttons.offsetY, 200, 75, '', 'Replay', onReplay, context);
      var next = basic.textButton(x + options.buttons.nextOffsetX, y + options.buttons.offsetY, 200, 75, '#0C0', 'Next', onNext, context);

      base.add(win);
      base.add(text);
      base.add(time);
      base.add(stat);

      base.add(toMenu);
      base.add(toLevels);
      base.add(replay);
      base.add(next);
      return base;
    }
  }
}
