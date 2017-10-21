var config = require('../configs/config');
var UI = require('../configs/ui');
module.exports = function(game, Phaser){
  return {
    preload: function(){
      var splash = game.add.sprite(0, 0, 'splash');
      var play = game.add.button(
        config.width / 2 + UI.menu.playButton.offsetX,
        config.height / 2 + UI.menu.playButton.offsetY,
        'play',
        this.onPlay,
        this
      );
      play.anchor.set(0.5);

      var sound = game.add.button(
        config.width / 2 + UI.menu.soundButton.offsetX,
        config.height / 2 + UI.menu.soundButton.offsetY,
        'buttonsMenu',
        this.onSound,
        this,
        1
      );
      sound.anchor.set(0.5);
      sound.setFrames(0,0,0);
      var soundSprite = game.add.sprite(
        config.width / 2 + UI.menu.soundButtonSprite.offsetX,
        config.height / 2 + UI.menu.soundButtonSprite.offsetY,
        'buttonsMenu'
      );
      soundSprite.frame = 2;
      soundSprite.anchor.set(0.5);

      var levels = game.add.button(
        config.width / 2 + UI.menu.levelsButton.offsetX,
        config.height / 2 + UI.menu.levelsButton.offsetY,
        'buttonsMenu',
        this.onLevels,
        this,
        1
      );
      levels.anchor.set(0.5);
      levels.setFrames(0,0,0);
      var levelsSprite = game.add.sprite(
        config.width / 2 + UI.menu.levelsButtonSprite.offsetX,
        config.height / 2 + UI.menu.levelsButtonSprite.offsetY,
        'buttonsMenu'
      );
      levelsSprite.frame = 1;
      levelsSprite.anchor.set(0.5);

    },
    onPlay: function(){
      // load from progress
      game.state.start('game', true, false, config.defaultBlockIndex || 0, 0);
    },
    onSound: function(){

    },
    onLevels: function(){
      game.state.start('levels', true, false, config.defaultBlockIndex || 0);
    }
  }
}
