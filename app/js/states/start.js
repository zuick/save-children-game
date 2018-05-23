var config = require('../configs/config');
var utils = require('../modules/utils');
var UI = require('../configs/ui');
var storage = require('../modules/storage');
var l10n = require('../modules/l10n');

module.exports = function(game, Phaser){
  var soundButtonSprite;
  var languageButtonRU;
  var languageButtonBA;
  var audioManager = require('../modules/audio').manager();

  return {
    preload: function(){
      utils.backgroundFullSize(game.add.sprite(0, 0, 'splash'));
      game.stage.backgroundColor = UI.menu.backgroundColor;

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

      languageButtonRU = this.drawLanguageButton(UI.menu.languageButtonRU, 'ru', 7);
      languageButtonBA = this.drawLanguageButton(UI.menu.languageButtonBA, 'ba', 6);

      this.updateLanguageButtons();
    },
    drawLanguageButton: function(options, code, flagFrame){
      var language = game.add.button(
        options.left,
        config.height / 2 + options.offsetY,
        'languageButton',
        this.onLanguage.bind(this, code),
        this,
        0
      );
      language.anchor.set(0.5);
      language.setFrames(0,0,0);

      var languageButtonSprite =  game.add.sprite(
        options.left + options.flag.x,
        config.height / 2 + options.offsetY + options.flag.y,
        'buttons'
      );
      languageButtonSprite.anchor.set(0.5);

      var languageButtonText = game.add.text(
        options.left + options.text.x,
        config.height / 2 + options.offsetY + options.text.y,
        'language',
        options.text.style
      );
      languageButtonText.anchor.set(0.5);
      languageButtonSprite.frame = flagFrame;
      languageButtonText.text = l10n.get('LANGUAGE_NAME', void 0, code)

      return language;
    },

    updateSoundButtonSprite: function(){
      var settings = storage.getSettings();
      if(settings.audio){
        soundButtonSprite.frame = 3;
      }else{
        soundButtonSprite.frame = 2;
      }
    },
    updateLanguageButtons: function(){
      var settings = storage.getSettings();
      if(settings.language === 'ru'){
        languageButtonRU.setFrames(1,1,1);
        languageButtonBA.setFrames(0,0,0);
      }else{
        languageButtonRU.setFrames(0,0,0);
        languageButtonBA.setFrames(1,1,1);
      }
    },
    onPlay: function(){
      // load from progress
      game.state.start('game', true, false, config.defaultBlockIndex || 0, 0);

      audioManager.playSound();
    },
    onSound: function(){
      var settings = storage.getSettings();
      storage.setSettings('audio', !settings.audio);
      this.updateSoundButtonSprite();

      audioManager.playSound();
    },
    onLevels: function(){
      game.state.start('levels', true, false, config.defaultBlockIndex || 0);

      audioManager.playSound();
    },
    onLanguage: function(code){
      var settings = storage.getSettings();
      storage.setSettings('language', code);
      this.updateLanguageButtons();

      audioManager.playSound();
    },
    create: function(){
      game.world.setBounds(0, 0, config.width, config.height);
	  audioManager.playMusic('musicMenu');
	  game.add.text(70, 350,"isNativeAudioEnabled: " + audioManager.isNativeAudioEnabled(), { font: "22px KZSupercell", fill: "#fff", align: "center" });
    }
  }
}
