var config = require('../config');
module.exports = function(game, Phaser){
  return{
    preload: function() {
      game.add.text( game.world.centerX, game.world.centerY, "Loading", { fill: "#4b692f" } ).anchor.setTo( 0.5, 0.5 );
      /*game.load.image('tilemap', 'assets/tilemap.png');
      config.levels.forEach(function(level, index){
        game.load.tilemap('level' + index, level.src, null, Phaser.Tilemap.TILED_JSON);
      });
      */
      game.load.image('tilemap', 'assets/tilemap_big.png');
      game.load.tilemap('level', 'assets/levels/big_test.json', null, Phaser.Tilemap.TILED_JSON);
      game.load.image('guy', 'assets/guy.png');
      game.load.image('trap', 'assets/trap.png');
      game.load.image('escape', 'assets/escape.png');
      game.load.image('hero', 'assets/hero.png');
      game.load.image('tree', 'assets/tree.png');

      game.load.image('ground01', 'assets/ground/01.png');
      game.load.image('ground02', 'assets/ground/02.png');
      game.load.image('houseA1', 'assets/houses/A1.png');
      game.load.image('houseA2', 'assets/houses/A2.png');
    },
    create: function(){
      game.state.start( 'test', true, false );
    }
  }
}
