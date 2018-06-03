var config = require('../configs/config');
var storage = require('../modules/storage');
var _manager;

function NativeSound(name, loop, volume) {
	volume = volume || 1;
	window.plugins.NativeAudio.setVolumeForComplexAsset(name, volume);
	this.key = name;
	this.play = function () {
		if (loop)
			window.plugins.NativeAudio.loop(name);
		else
			window.plugins.NativeAudio.play(name);
	}
	this.stop = function () {
		window.plugins.NativeAudio.stop(name);
	}
}

var AudioManager = function (game, Phaser) {
	this.isNativeAudioEnabled = function() {
		return !!(window.plugins && window.plugins.NativeAudio);
	}
	this.enabled = storage.getSettings().audio;
	this.currentMusic;
	this.currentBuzz;
	
	this.play = function (sound) {
		if (this.enabled) {
			sound.play();
		}
	}

	this.stopCurrentMusic = function(){
		if(this.currentMusic)
		this.currentMusic.stop();
	}

	this.playBuzz = function (key, volume) {
		this.currentBuzz = this.playSound(key, volume);
	}

	this.stopBuzz = function () {
		if (this.currentBuzz) {
			this.currentBuzz.stop();
		}
	}

	this.playMusic = function (key) {
		if (!this.currentMusic || this.currentMusic.key !== key) {
			if (this.currentMusic) this.currentMusic.stop();
			this.currentMusic = this.isNativeAudioEnabled()
				? new NativeSound(key, true)
				: game.add.audio(key, config.audio.musicVolume, true);

			this.play(this.currentMusic);
		}
	}

	this.playSound = function (key, volume) {
		key = key || 'audioButton';
		var sfx = this.isNativeAudioEnabled()
			? new NativeSound(key, false, volume)
			: game.add.audio(key, volume || config.audio.sfxVolume);

		this.play(sfx);
		return sfx;
	}

	this.onSettingsChanged = function (settings) {
		if (this.currentMusic && this.enabled !== settings.audio) {
			this.enabled = settings.audio;
			if (settings.audio) {
				this.play(this.currentMusic);
			} else {
				this.currentMusic.stop();
			}
		}
	}

	storage.addListener(this.onSettingsChanged.bind(this))
}

module.exports = {
	init: function (game, Phaser) {
		_manager = new AudioManager(game, Phaser);
	},
	manager: function () {
		return _manager;
	}
}
