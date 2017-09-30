var config = require('../config');
var directions = require('./directions');

module.exports = function(game, Phaser){
  function Map(){
    var map;
    var mainLayer;
    var children;

    this.create = function(tilemap, mainLayerName){
      map = game.add.tilemap(tilemap);
      map.addTilesetImage('tilemap', 'tilemap');

      if(typeof(mainLayerName) !== 'undefined'){
        mainLayer = map.createLayer(mainLayerName);
      }
    }

    this.getTilesInLayer = function(layerName, indexes, reversed){
      var result = [];
      var layer = this.getLayer(layerName);
      if(layer && layer.data){
        layer.data.forEach(function(row){
          if(reversed !== 'reversed'){
            row.forEach(function(tile){
              if(typeof(indexes) === 'undefined' || indexes.indexOf(tile.index) !== -1){
                result.push(tile);
              }
            })
          }else{
            for(var i = row.length - 1; i > 0; i--){
              if(typeof(indexes) === 'undefined' || indexes.indexOf(row[i].index) !== -1){
                result.push(row[i]);
              }
            }
          }
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

    this.getSize = function(){
      return { x: map.width * map.tileWidth, y: map.height* map.tileHeight };
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

    this.getTilesAround = function(tile){
      var x = tile.x;
      var y = tile.y;
      return [
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
    }

    this.getNextTileFrom = function(tile, dir){
      return this.getTilesAround(tile)
        .filter(
          function(t){ return t.tile && t.name === dir; }
        )
        .map(
          function(t){ return t.tile }
        )[0];
    }

    this.getTileWays = function(tile){
      return this.getTilesAround(tile)
        .filter(
          function(t){ return t.tile && !this.isWall(t.tile) }.bind(this)
        )
        .map(
          function(t){ return t.name }
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

    this.ceilPosition = function(x, y){
      return { x: Math.floor(Math.round(x) / map.tileWidth) * map.tileWidth, y: Math.floor(Math.round(y) / map.tileHeight) * map.tileHeight };
    }

    this.debugTile = function(tile){
      var worldPosition = this.getTileWorldXY(tile);
      game.debug.geom(
        new Phaser.Rectangle(worldPosition.x, worldPosition.y, tile.width, tile.height),
        'rgba(0, 32, 0, 0.2)'
      );
    }
  }
  return new Map();
}
