var config = require('../config');
var directions = require('./directions');

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

    this.getTileCoords = function(worldX, worldY){
      return { x: Math.floor(worldX / map.tileWidth), y: Math.floor(worldY / map.tileHeight)}
    }

    this.getTile = function(x, y){
      if( x >= map.width || y >= map.height || x < 0 || y < 0 ){
        return void 0;
      }
      return map.layer.data[y][x];
    }

    this.getTilesInDirection = function(dir, start){
      var tiles = [];
      var delta = directions.isPositive(dir) ? 1 : -1;
      var inc = function(value){
        return value + delta;
      }
      if(directions.isVertical(dir)){
        for(var y = start.y; y < map.height && y >= 0; y = inc(y)){
          tiles.push(this.getTile(start.x, y));
        }
      }else{
        for(var x = start.x; x < map.width && x >= 0; x = inc(x)){
          tiles.push(this.getTile(x, start.y));
        }
      }

      return tiles;
    }

    this.getTileWays = function(tile){
      var x = tile.x;
      var y = tile.y;
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

    this.debugTile = function(tile){
      game.debug.geom(
        new Phaser.Point(
          tile.x * map.tileWidth + map.tileWidth / 2,
          tile.y * map.tileHeight + map.tileHeight / 2
        ),
        'rgba(0, 256, 255, 1)'
      );
    }
  }
  return new Map();
}
