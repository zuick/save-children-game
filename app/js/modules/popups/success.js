var config = require('../../configs/config');
var UI = require('../../configs/ui');
var l10n = require('../l10n');
var utils = require('../utils');

module.exports = function(game, Phaser){
  var basic = require('../popups/basic')(game, Phaser);
  return {
    create: function(x, y, titleText, time, children, childrenTotal, isLastLevel, onToMenu, onToLevels, onReplay, onNext, context){
      var options = UI.popups.success;
      var base = basic.create(x, y, options.opacity);
      var win = basic.tint(x, y, options.width, options.height, 1, 0xc24729, 'popup');
      var scale = utils.getUIScale();

      
      var title = game.add.sprite(x, y + options.header.offsetY * scale, 'popupTitle');
      title.frame = 0;
      title.anchor.set(0.5);
      
      var text = game.add.text(x, y + options.header.titleOffsetY * scale, titleText, options.header.style);
      text.anchor.set(0.5);
      text.stroke = options.header.stroke;
      text.strokeThickness = options.header.strokeThickness;
      
      var icon;
      if(isLastLevel){
        icon = game.add.text(x, y + options.icon.offsetY * scale, l10n.get('LAST_LEVEL_DESCRIPTION'), options.time.style);
      }else{
        icon = game.add.sprite(x, y + options.icon.offsetY * scale, 'iconSuccess');
      }
      
      icon.anchor.set(0.5);
      
      var time = game.add.text(x, y + options.time.offsetY * scale, l10n.get('TIME', [utils.formatTime(time)]), options.time.style);
      time.anchor.set(0.5);
      
      var stat = game.add.text(x, y + options.stat.offsetY * scale, l10n.get('STAT', [children, childrenTotal]), options.stat.style);
      stat.anchor.set(0.5);
      
      var toMenu = basic.button(x + options.buttons.toMenuOffsetX * scale, y + options.buttons.offsetY * scale, 'buttons', 4, onToMenu, context);
      var replay = basic.button(x + options.buttons.replayOffsetX * scale, y + options.buttons.offsetY * scale, 'buttons', 5, onReplay, context);
      var toLevels = basic.button(x + options.buttons.toLevelsOffsetX * scale, y + options.buttons.offsetY * scale, 'buttons', 3, onToLevels, context);
      var next = basic.button(x + options.buttons.nextOffsetX * scale, y + options.buttons.offsetY * scale, 'buttonsLarge', 0, onNext, context);
      var nextText = game.add.text(x + options.buttons.nextOffsetX * scale, y + options.buttons.offsetY * scale, l10n.get('NEXT'), options.buttons.nextTextStyle );
      nextText.anchor.set(0.5);
      
      base.add(win);
      base.add(title);
      base.add(icon);
      base.add(text);
      base.add(time);
      base.add(stat);
      
      base.add(toMenu);
      base.add(toLevels);
      base.add(replay);
      base.add(next);
      base.add(nextText);
      
      basic.scale(base, scale);
      win.scale.set(options.header.scale + (scale - 1));
      return base;
    }
  }
}
