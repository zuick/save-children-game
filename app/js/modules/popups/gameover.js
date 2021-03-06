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
      var win = basic.tint(x, y, options.width, options.height, 1, 0xc24729, 'popup');

      var title = game.add.sprite(x, y + options.header.offsetY, 'popupTitle');
      title.frame = 1;
      title.anchor.set(0.5);

      var text = game.add.text(x, y + options.header.titleOffsetY, l10n.get('FAIL'), options.header.style);
      text.anchor.set(0.5);
      text.stroke = options.header.stroke;
      text.strokeThickness = options.header.strokeThickness;

      var icon = game.add.sprite(x, y + options.icon.offsetY, 'iconFail');
      icon.anchor.set(0.5);

      var time = game.add.text(x, y + options.time.offsetY, l10n.get('TIME', [utils.formatTime(time)]), options.time.style);
      time.anchor.set(0.5);

      var stat = game.add.text(x, y + options.stat.offsetY, l10n.get('STAT', [children, childrenTotal]), options.stat.style);
      stat.anchor.set(0.5);

      var toMenu = basic.button(x + options.buttons.toMenuOffsetX, y + options.buttons.offsetY, 'buttons', 4, onToMenu, context);
      var replay = basic.button(x + options.buttons.replayOffsetX, y + options.buttons.offsetY, 'buttonsLarge', 1, onReplay, context);
      var toLevels = basic.button(x + options.buttons.toLevelsOffsetX, y + options.buttons.offsetY, 'buttons', 3, onToLevels, context);

      base.add(win);
      base.add(title);
      base.add(icon);
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
