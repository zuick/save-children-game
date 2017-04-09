var config = require('../config');
var directions = require('./directions');

module.exports = function(game, Phaser){
  function Map(){
    var map;
    var mainLayer;
    var children;

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

    this.getTilesInLayer = function(layerName, indexes){
      var result = [];
      var layer = this.getLayer(layerName);
      if(layer){
        layer.data.forEach(function(row){
          row.forEach(function(tile){
            if(indexes.indexOf(tile.index) !== -1){
              result.push(tile);
            }
          })
        })
      }
      return result;
    }

    this.getLayer = function(name){
      var index = map.getLayerIndex(name);
      if(index >= 0){
        return map.layers[index];
      }
    }

    this.getTileAt = function(worldX, worldY){
      return this.getTile(Math.floor(Math.round(worldX) / map.tileWidth), Math.floor(Math.round(worldY) / map.tileHeight));
    }

    this.getTile = function(x, y, layerName){
      layerName = layerName || config.map.main.name;
      var layer = this.getLayer(layerName);
      if(layer){
        if( x >= map.width || y >= map.height || x < 0 || y < 0 ){
          return void 0;
        }
        return layer.data[y][x];
      }
    }

    this.getTilesInDirection = function(dir, start){
      var tiles = [];
      var delta = directions.isPositive(dir) ? 1 : -1;
      var inc = function(value){
        return value + delta;
      }
      if(directions.isVertical(dir)){
        for(var y = inc(start.y); y < map.height && y >= 0; y = inc(y)){
          tiles.push(this.getTile(start.x, y));
        }
      }else{
        for(var x = inc(start.x); x < map.width && x >= 0; x = inc(x)){
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

    this.getTileWorldXY = function(tile){
      return { x: tile.x * map.tileWidth, y: tile.y * map.tileHeight };
    }

    this.isWall = function(tile){
      return config.map.main.walls.indexOf(tile.index) !== -1;
    }

    this.get = function(){
      return map;
    }

    this.debugTile = function(tile){
      var worldPosition = this.getTileWorldXY(tile);
      game.debug.geom(
        new Phaser.Point(worldPosition.x, worldPosition.y),
        'rgba(0, 256, 255, 1)'
      );
    }
  }
  return new Map();
}
