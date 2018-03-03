var config = require('../configs/config');
var storage = require('../modules/storage');

module.exports = function(game, Phaser){
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
