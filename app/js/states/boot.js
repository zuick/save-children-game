var config = require('../configs/config');
var storage = require('../modules/storage');

module.exports = function(game, Phaser){
  // iframe audio fix
  if (game.device.android && game.device.chrome && game.device.chromeVersion >= 55) {
    game.sound.setTouchLock();
    game.input.touch.addTouchLockCallback(function () {
        if (this.noAudio || !this.touchLocked || this._unlockSource !== null) {
            return true;
        }
        if (this.usingWebAudio) {
            // Create empty buffer and play it
            // The SoundManager.update loop captures the state of it and then resets touchLocked to false

            var buffer = this.context.createBuffer(1, 1, 22050);
            this._unlockSource = this.context.createBufferSource();
            this._unlockSource.buffer = buffer;
            this._unlockSource.connect(this.context.destination);

            if (this._unlockSource.start === undefined) {
                this._unlockSource.noteOn(0);
            }
            else {
                this._unlockSource.start(0);
            }

            //Hello Chrome 55!
            if (this._unlockSource.context.state === 'suspended') {
                this._unlockSource.context.resume();
            }
        }

        //  We can remove the event because we've done what we needed (started the unlock sound playing)
        return true;

    }, game.sound, true);
  }
  return {
    doScale: function(){
      var w = document.body.clientWidth / config.width;
      var h = document.body.clientHeight / config.height;
      game.scale.setUserScale(Math.min(w,h), Math.min(w,h));
      game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    },
    preload: function() {
      this.doScale();
      game.load.image('splash', 'assets/splash.jpg');
      game.scale.setResizeCallback(this.doScale, this);

    },
    create: function(){
      storage.initTutorialMode();
      game.add.text( 0, 0, ".", { font: "1pt Bangers" } );
      game.add.text( 0, 0, ".", { font: "1pt KZSupercell" } );
      game.state.start('preloader', true, false);
    }
  }
}
