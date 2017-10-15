var config = require('../configs/config');

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
      game.state.start('preloader', true, false);
    }
  }
}