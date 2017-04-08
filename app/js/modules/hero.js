var directions = require('./directions');
var difference = require('lodash.difference');

module.exports = function(game, Phaser){
  function Hero(){
    var sprite;
    var speed = 50;
    var currentDir;
    var destinationTile;
    var map;
    this.preload = function(){
      game.load.image('guy', 'assets/guy.png');
    }

    this.create = function(_map){
      map = _map;
      sprite = game.add.sprite(0, 0, 'guy');
    }

    this.update = function(){
      if(!destinationTile){
        var currentTile = map.getTileAt(sprite.x, sprite.y);
        currentDir = directions.getRandomFrom(map.getTileWays(currentTile));
        destinationTile = this.getDestinationFrom(currentTile);
      }

      if(currentDir){
        var delta = this.getDeltaToDest();
        if(delta.x === 0 && delta.y === 0){
          console.log("destination get");
        }else{
          sprite.x += delta.x;
          sprite.y += delta.y;
        }
      }
    }

    this.getDeltaToDest = function(){
      var dwp = map.getTileWorldXY(destinationTile);
      var delta = speed * game.time.elapsedMS / 1000;
      var dx = dwp.x - (sprite.x + (sprite.texture.width / 2));
      var dy = dwp.y - (sprite.y + (sprite.texture.height / 2));

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
          if(possibleTurns.length > 0){
            return directionTiles[i];
          }
      }

      return currentTile;
    }


    this.getCollider = function(){
      return sprite;
    }

    this.render = function(){
      game.debug.text(currentDir, 100, game.height - 20);
      if(map && destinationTile){
        map.debugTile(destinationTile);
      }
    }
  }
  return new Hero();
}
