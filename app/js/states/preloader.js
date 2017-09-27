var config = require('../config');
module.exports = function(game, Phaser){
  return{
    preload: function() {
      game.add.text( game.world.centerX, game.world.centerY, "Loading", { fill: "#4b692f" } ).anchor.setTo( 0.5, 0.5 );
      config.levels.forEach(function(level, index){
        game.load.tilemap('level' + index, level.src, null, Phaser.Tilemap.TILED_JSON);
      });

      game.load.image('tilemap', 'assets/tilemap_big.png');
      game.load.image('target', 'assets/target.png');

      game.load.image('boy', 'assets/characters/boy.png');
      game.load.image('girl', 'assets/characters/girl.png');
      game.load.image('hero', 'assets/characters/hero.png');

      game.load.image('ground01', 'assets/ground/01.png');
      game.load.image('ground02', 'assets/ground/02.png');
      game.load.image('houseA1', 'assets/houses/A1.png');
      game.load.image('houseA2', 'assets/houses/A2.png');
      game.load.image('houseShadow', 'assets/houses/shadow.png');
    },
    create: function(){
      //game.state.start( 'start', true, false );
      game.state.start('game', true, false, 0);
    }
  }
}
