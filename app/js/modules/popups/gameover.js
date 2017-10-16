var config = require('../../configs/config');
var UI = require('../../configs/ui');
var l10n = require('../l10n');
var utils = require('../utils');

module.exports = function(game, Phaser){
  var basic = require('../popups/basic')(game, Phaser);
  return {
    create: function(x, y, time, children, childrenTotal, onToMenu, onToLevels, onReplay, context){
      var options = UI.popups.gameover;
      var base = basic.create(x, y, options.opacity);
      var win = basic.tint(x, y, options.width, options.height, 0.9, 0xc24729);

      var text = game.add.text(x, y + options.header.offsetY, l10n.get('FAIL'), options.header.style);
      text.anchor.set(0.5);

      var time = game.add.text(x, y + options.time.offsetY, l10n.get('TIME', [utils.formatTime(time)]), options.time.style);
      time.anchor.set(0.5);

      var stat = game.add.text(x, y + options.stat.offsetY, l10n.get('STAT', [children, childrenTotal]), options.stat.style);
      stat.anchor.set(0.5);

      var toMenu = basic.textButton(x + options.buttons.toMenuOffsetX, y + options.buttons.offsetY, 200, 75, '', 'В меню', onToMenu, context);
      var replay = basic.textButton(x + options.buttons.replayOffsetX, y + options.buttons.offsetY, 200, 75, '#5d2', 'Переиграть', onReplay, context);
      var toLevels = basic.textButton(x + options.buttons.toLevelsOffsetX, y + options.buttons.offsetY, 200, 75, '', 'Уровни', onToLevels, context);

      base.add(win);
      base.add(text);
      base.add(time);
      base.add(stat);

      base.add(toMenu);
      base.add(toLevels);
      base.add(replay);
      return base;
    }
  }
}
