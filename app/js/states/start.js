var config = require('../config');
module.exports = function(game, Phaser){
  return {
    preload: function(){
      this.game.add.text( game.world.centerX, game.world.centerY - config.height / 6, "SAVE CHILDREN PROTOTYPE", { fill: "#FFF" } ).anchor.setTo( 0.5, 0.5 );
      this.game.add.text( game.world.centerX, game.world.centerY + config.height / 6, "click to start", { fill: "#DDD" } ).anchor.setTo( 0.5, 0.5 );
      game.input.onDown.add(this.startGame, this);
      game.stage.backgroundColor = '#4b692f';
    },
    startGame: function(){
      if(config.levels.length > 0){
        game.state.start('game', true, false, 0);
      }
    }
  }
}
