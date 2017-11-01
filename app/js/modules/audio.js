var config = require('../configs/config');
var storage = require('../modules/storage');
var _manager;

var AudioManager = function(game, Phaser){
  this.enabled = storage.getSettings().audio;
  this.currentMusic;
  this.play = function(sound){
    if(this.enabled){
      sound.play();
    }
  }
  this.playMusic = function(key){
    if(!this.currentMusic || this.currentMusic.key !== key){
      if(this.currentMusic) this.currentMusic.stop();
      this.currentMusic = game.add.audio(key, config.audio.musicVolume, true);
      this.play(this.currentMusic);
    }
  }
  this.playSound = function(key, volume){
    key = key || 'audioButton';
    var sfx = game.add.audio(key, volume || config.audio.sfxVolume);
    sfx.play();
  }
  this.onSettingsChanged = function(settings){
    if(this.currentMusic){
      this.enabled = settings.audio;
      if(settings.audio){
        this.play(this.currentMusic);
      }else{
        this.currentMusic.stop();
      }
    }
  }

  storage.addListener(this.onSettingsChanged.bind(this))
}

module.exports = {
  init: function(game, Phaser){
    _manager = new AudioManager(game, Phaser);
  },
  manager: function(){
    return _manager;
  }
}
