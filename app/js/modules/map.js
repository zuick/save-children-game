var config = require('../config');

module.exports = function(game, Phaser){
  function Map(){
    var map;
    var background;
    var walls;

    this.preload = function(){
      game.load.tilemap('map', 'assets/levels/level-1.json', null, Phaser.Tilemap.TILED_JSON);
      game.load.image('tilemap', 'assets/tilemap.png');
    }

    this.create = function(){
      map = game.add.tilemap('map');
      map.addTilesetImage('tilemap', 'tilemap');
      map.setCollision(config.map.collisionIndexes, true, 'walls');

      background = map.createLayer('background');
      walls = map.createLayer('walls');
      background.resizeWorld();
    }

    this.getColliderLayer = function(){
      return walls;
    }

    this.getMap = function(){
      return map;
    }
  }
  return new Map();
}
