var directions = require('./directions');
var difference = require('lodash.difference');

module.exports = function(game, Phaser){
  function Stray(){
    var sprite;
    var speed = 25;
    var currentDir;
    var destination;
    var map;
    this.create = function(x, y, _map, _speed){
      map = _map;
      speed = _speed;
      sprite = game.add.sprite(x, y, 'guy');
      game.physics.enable(sprite);
      sprite.body.setSize(sprite.texture.width, sprite.texture.height, 0, 0);
    }

    this.update = function(){
      if(!destination){
        var currentTile = map.getTileAt(sprite.x, sprite.y);
        currentDir = directions.getRandomFrom(map.getTileWays(currentTile));
        destination = this.getDestinationFrom(currentTile);
      }else if(currentDir){
        var delta = this.getDeltaToDest();
        if(delta.x === 0 && delta.y === 0){
          var currentTile = map.getTileAt(sprite.x, sprite.y);
          currentDir = destination.dir;
          destination = this.getDestinationFrom(currentTile);
        }else{
          sprite.x += delta.x;
          sprite.y += delta.y;
        }
      }
    }

    this.getDeltaToDest = function(){
      var dwp = map.getTileWorldXY(destination.tile);
      var delta = speed * game.time.elapsedMS / 1000;
      var dx = dwp.x - sprite.x;
      var dy = dwp.y - sprite.y;

      return {
        x: Math.sign(dx) * Math.min(Math.abs(dx), delta),
        y: Math.sign(dy) * Math.min(Math.abs(dy), delta)
      }
    }

    this.getDestinationFrom = function(currentTile){
      var directionTiles = map.getTilesInDirection(currentDir, currentTile);
      for(var i = 0; i < directionTiles.length; i++){
          var ways = map.getTileWays(directionTiles[i]);
          var possibleTurns = difference(ways, [currentDir, directions.getOpposite(currentDir)]);
          var possibleTurnsWithStraight = difference(ways, [directions.getOpposite(currentDir)]);
          if(possibleTurnsWithStraight.length === 0){
            return  { tile: directionTiles[i], dir: directions.getOpposite(currentDir) };
          }else if(possibleTurns.length > 0){
            return  { tile: directionTiles[i], dir: directions.getRandomFrom(possibleTurnsWithStraight) };
          }
      }

      return { tile: currentTile, dir: currentDir };
    }


    this.getCollider = function(){
      return sprite;
    }

    this.render = function(){
      game.debug.text(currentDir, 100, game.height - 20);
      if(map && destination && destination.tile){
        map.debugTile(destination.tile);
      }
    }

    this.destroy = function(){
      sprite.destroy();
    }

    this.onTrap = function(){
      this.destroy();
    }

    this.isOverlap = function(tile){
      var x = sprite.x;
      var y = sprite.y;
      var w = sprite.texture.width;
      var h = sprite.texture.height;
      var tiles = [];
      tiles.push(map.getTileAt(x, y));
      tiles.push(map.getTileAt(x + w, y));
      tiles.push(map.getTileAt(x, y + h));
      tiles.push(map.getTileAt(x + w, y + h));
      return tiles.indexOf(tile) !== -1;
    }

    this.onHero = function(){
      var currentTile = map.getTileAt(sprite.x, sprite.y);
      currentDir = directions.getOpposite(currentDir);
      destination = this.getDestinationFrom(currentTile);
    }
  }

  return Stray;
}
