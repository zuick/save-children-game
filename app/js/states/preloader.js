var config = require('../configs/config');
var levelsConfig = require('../configs/levels');
module.exports = function(game, Phaser){
  return {
    text: void 0,
    doScale: function(){
      var w = document.body.clientWidth / config.width;
      var h = document.body.clientHeight / config.height;
      game.scale.setUserScale(Math.min(w,h), Math.min(w,h));
      game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    },
    loadUpdate: function(){
      text.text = "Loading: " + this.load.progress + "%";
    },
    preload: function() {
      this.doScale();
      game.scale.setResizeCallback(this.doScale, this);
      text = game.add.text( game.world.centerX, game.world.centerY, "Loading: 0%", { fill: "#ccc", align: "center" } ).anchor.setTo( 0.5, 0.5 );
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
      game.load.image('levelsBlockArrow', 'assets/UI/levels_block_arrow.png');

      game.load.spritesheet('pauseButton', 'assets/UI/buttons.png', 48, 48, 2);
      game.load.image('pixel', 'assets/UI/pixel.png');
    },
    create: function(){
      game.state.start('game', true, false, 0, 0);
      //game.state.start('levels', true, false, config.defaultBlockIndex || 0);
    }
  }
}
