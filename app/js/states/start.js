var config = require('../configs/config');
var UI = require('../configs/ui');
var storage = require('../modules/storage');
var l10n = require('../modules/l10n');

module.exports = function(game, Phaser){
  var soundButtonSprite;
  var languageButtonSprite;
  var languageButtonText;

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
      soundButtonSprite = game.add.sprite(
        config.width / 2 + UI.menu.soundButtonSprite.offsetX,
        config.height / 2 + UI.menu.soundButtonSprite.offsetY,
        'buttonsMenu'
      );
      soundButtonSprite.anchor.set(0.5);
      this.updateSoundButtonSprite();

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

      var language = game.add.button(
        config.width / 2 + UI.menu.languageButton.offsetX,
        config.height / 2 + UI.menu.languageButton.offsetY,
        'languageButton',
        this.onLanguage,
        this
      );
      language.anchor.set(0.5);
      language.setFrames(0,0,0);

      languageButtonSprite =  game.add.sprite(
        config.width / 2 + UI.menu.languageButton.offsetX + UI.menu.languageButton.flag.x,
        config.height / 2 + UI.menu.languageButton.offsetY + UI.menu.languageButton.flag.y,
        'buttons'
      );
      languageButtonSprite.anchor.set(0.5);

      languageButtonText = game.add.text(
        config.width / 2 + UI.menu.languageButton.offsetX + UI.menu.languageButton.text.x,
        config.height / 2 + UI.menu.languageButton.offsetY + UI.menu.languageButton.text.y,
        'language',
        UI.menu.languageButton.text.style
      );
      languageButtonText.anchor.set(0.5);

      this.updateLanguageButton();
    },
    updateSoundButtonSprite: function(){
      var settings = storage.getSettings();
      if(settings.audio){
        soundButtonSprite.frame = 3;
      }else{
        soundButtonSprite.frame = 2;
      }
    },
    updateLanguageButton: function(){
      var settings = storage.getSettings();
      if(settings.language === 'ru'){
        languageButtonSprite.frame = 6;
        languageButtonText.text = l10n.get('LANGUAGE_NAME', void 0, 'ba');
      }else{
        languageButtonSprite.frame = 7;
        languageButtonText.text = l10n.get('LANGUAGE_NAME', void 0, 'ru');
      }
    },
    onPlay: function(){
      // load from progress
      game.state.start('game', true, false, config.defaultBlockIndex || 0, 0);
    },
    onSound: function(){
      var settings = storage.getSettings();
      storage.setSettings('audio', !settings.audio);
      this.updateSoundButtonSprite();
    },
    onLevels: function(){
      game.state.start('levels', true, false, config.defaultBlockIndex || 0);
    },
    onLanguage: function(){
      var settings = storage.getSettings();
      storage.setSettings('language', settings.language === 'ru' ? 'ba' : 'ru');
      this.updateLanguageButton();
    }
  }
}
