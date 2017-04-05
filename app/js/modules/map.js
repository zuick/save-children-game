var config = require('../config');

module.exports = function(game, Phaser){
  function Map(){
    var map;
    var mainLayer;
    var walls;

    this.preload = function(){
      game.load.tilemap('map', 'assets/levels/level-1.json', null, Phaser.Tilemap.TILED_JSON);
      game.load.image('tilemap', 'assets/tilemap.png');
    }

    this.create = function(){
      map = game.add.tilemap('map');
      map.addTilesetImage('tilemap', 'tilemap');

      mainLayer = map.createLayer('main');
      mainLayer.resizeWorld();      
    }

    this.getColliderLayer = function(){
      return walls;
    }

    this.getTileCoords = function(x, y){
      return { x: Math.floor(x / map.tileWidth), y: Math.floor(y / map.tileHeight)}
    }

    this.getTile = function(x, y){
      if( x >= map.width || y >= map.height || x < 0 || y < 0 ){
        return void 0;
      }
      return map.layer.data[y][x];
    }

    this.get = function(){
      return map;
    }
  }
  return new Map();
}
