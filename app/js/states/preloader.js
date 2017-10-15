var config = require('../configs/config');
var levelsConfig = require('../configs/levels');
module.exports = function(game, Phaser){
  return {
    text: void 0,
    preload: function() {
      var splash = game.add.sprite(0, 0, 'splash');
      var loadingText = game.add.text( game.world.centerX, game.world.centerY + 300, "Loading...", { fill: "#fff", align: "center" } ).anchor.setTo( 0.5, 0.5 );
      levelsConfig.forEach(function(levelsBlock, blockIndex){
        levelsBlock.forEach(function(level, index){
          game.load.tilemap('level' + blockIndex + '-' + index, level.src, null, Phaser.Tilemap.TILED_JSON);
        })
      });
      game.load.image('tilemap', 'assets/tilemap_big.png');
      game.load.image('target', 'assets/target.png');
      game.load.image('bonus', 'assets/bonus.png');

      game.load.spritesheet('boy', 'assets/characters/boy.png', 160, 185, 12);
      game.load.spritesheet('girl', 'assets/characters/girl.png', 160, 185, 12);
      game.load.image('hero', 'assets/characters/hero.png');

      game.load.image('ground01', 'assets/ground/01.png');
      game.load.image('ground02', 'assets/ground/02.png');
      game.load.image('ground03', 'assets/ground/03.png');
      game.load.image('ground04', 'assets/ground/04.png');
      game.load.image('ground05', 'assets/ground/05.png');
      game.load.image('ground06', 'assets/ground/06.png');
      game.load.image('houseA1', 'assets/walls/A1.png');
      game.load.image('houseA2', 'assets/walls/A2.png');
      game.load.image('houseA3', 'assets/walls/A3.png');
      game.load.image('houseB1', 'assets/walls/B1.png');
      game.load.image('houseB2', 'assets/walls/B2.png');
      game.load.image('houseB3', 'assets/walls/B3.png');
      game.load.image('wall01', 'assets/walls/01.png');
      game.load.image('wall02', 'assets/walls/02.png');
      game.load.image('wall03', 'assets/walls/03.png');
      game.load.image('wall04', 'assets/walls/04.png');
      game.load.image('wall05', 'assets/walls/05.png');
      game.load.image('wall06', 'assets/walls/06.png');
      game.load.image('wall07', 'assets/walls/07.png');
      game.load.image('wall08', 'assets/walls/08.png');
      game.load.image('danger01', 'assets/danger/01.png');
      game.load.image('danger02', 'assets/danger/02.png');
      game.load.image('danger03', 'assets/danger/03.png');
      game.load.image('danger04', 'assets/danger/04.png');
      game.load.image('danger05', 'assets/danger/05.png');
      game.load.image('danger06', 'assets/danger/06.png');
      game.load.image('danger07', 'assets/danger/07.png');
      game.load.image('houseShadow', 'assets/walls/shadow.png');

      game.load.image('levelItemCity', 'assets/UI/level_item_city.png');
      game.load.image('levelItemCountrySide', 'assets/UI/level_item_countryside.png');
      game.load.image('levelItemHouse', 'assets/UI/level_item_house.png');
      game.load.image('levelsBlockArrowLeft', 'assets/UI/prev.png');
      game.load.image('levelsBlockArrowRight', 'assets/UI/next.png');
      game.load.image('levelsBackground', 'assets/UI/bkg.jpg');
      game.load.spritesheet('buttons', 'assets/UI/buttons.png', 80, 76, 3);
      game.load.image('pixel', 'assets/UI/pixel.png');
    },
    create: function(){
      //game.state.start('game', true, false, 0, 0);
      game.state.start('levels', true, false, config.defaultBlockIndex || 0);
    }
  }
}
