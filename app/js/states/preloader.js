var config = require('../configs/config');
var levelsConfig = require('../configs/levels');
module.exports = function(game, Phaser){
  return{
    preload: function() {
      game.add.text( game.world.centerX, game.world.centerY, "Loading", { fill: "#4b692f" } ).anchor.setTo( 0.5, 0.5 );
      levelsConfig.forEach(function(levelsBlock, blockIndex){
        levelsBlock.forEach(function(level, index){
          game.load.tilemap('level' + blockIndex + '-' + index, level.src, null, Phaser.Tilemap.TILED_JSON);
        })
      });

      game.load.image('tilemap', 'assets/tilemap_big.png');
      game.load.image('target', 'assets/target.png');

      game.load.image('boy', 'assets/characters/boy.png');
      game.load.image('girl', 'assets/characters/girl.png');
      game.load.image('hero', 'assets/characters/hero.png');

      game.load.image('ground01', 'assets/ground/01.png');
      game.load.image('ground02', 'assets/ground/02.png');
      game.load.image('underground', 'assets/ground/03.png');
      game.load.image('houseA1', 'assets/houses/A1.png');
      game.load.image('houseA2', 'assets/houses/A2.png');
      game.load.image('danger1', 'assets/danger/01.png');
      game.load.image('houseShadow', 'assets/houses/shadow.png');

      game.load.image('levelItemCity', 'assets/UI/level_item_city.png');
      game.load.image('levelItemCountrySide', 'assets/UI/level_item_countryside.png');
      game.load.image('levelItemHouse', 'assets/UI/level_item_house.png');
      game.load.image('levelsBlockArrow', 'assets/UI/levels_block_arrow.png');
    },
    create: function(){
      //game.state.start( 'start', true, false );
      game.state.start('levels', true, false, config.defaultBlockIndex || 0);
    }
  }
}
