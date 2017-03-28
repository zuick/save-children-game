module.exports = function(game){
  return {
    preload: function() {
      game.load.tilemap('map', 'assets/levels/level-1.json', null, Phaser.Tilemap.TILED_JSON);
      game.load.image('tilemap', 'assets/tilemap.png');
    },
    create: function() {
      var map = game.add.tilemap('map');
      map.addTilesetImage('tilemap', 'tilemap');
      var background = map.createLayer('background');
      var walls = map.createLayer('walls');
      background.resizeWorld();
    }
  }
}
