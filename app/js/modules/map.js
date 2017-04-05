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

    this.getTileWays = function(x, y){
      var tiles = [
        {
          name: 'up',
          tile: this.getTile(x, y - 1)
        },
        {
          name: 'down',
          tile: this.getTile(x, y + 1)
        },
        {
          name: 'left',
          tile: this.getTile(x - 1, y)
        },
        {
          name: 'right',
          tile: this.getTile(x + 1, y)
        },
      ];

      return tiles
        .filter(
          function(t){ return t.tile && !this.isWall(t.tile)}.bind(this)
        )
        .map(
          function(t){ return t.name}
        )
    }

    this.isWall = function(tile){
      return config.map.walls.indexOf(tile.index) !== -1;
    }

    this.get = function(){
      return map;
    }
  }
  return new Map();
}
