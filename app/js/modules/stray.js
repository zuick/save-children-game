var directions = require('./directions');
var difference = require('lodash.difference');

module.exports = function(game, Phaser){
  function Stray(){
    var sprite;
    var speed = 25;
    var currentDir;
    var currentTile;
    var nextTile;
    var map;
    this.create = function(x, y, _map, _speed){
      map = _map;
      speed = _speed;
      sprite = game.add.sprite(x, y, 'guy');
      game.physics.enable(sprite);
      sprite.body.setSize(sprite.texture.width, sprite.texture.height, 0, 0);
    }

    this.update = function(){
      currentTile = map.getTileAt(sprite.x, sprite.y);
      if(!currentDir){
        currentDir = directions.getRandomFrom(map.getTileWays(currentTile));
      }else{
        nextTile = map.getNextTileFrom(currentTile, currentDir);
        if(nextTile){
          var delta = this.getDeltaTo(nextTile);
          var nextDeltaTile = map.getTileAt(sprite.x + delta.x, sprite.y + delta.y);
          if(nextDeltaTile.x === nextTile.x && nextDeltaTile.y === nextTile.y){
            var ways = map.getTileWays(nextDeltaTile);
            var backwardDir = directions.getOpposite(currentDir);
            var canMoveForward = ways.indexOf(currentDir) !== -1;
            var canMovebackward = ways.indexOf(backwardDir) !== -1;
            var turnWays = difference(ways, [backwardDir, currentDir]);
            if(!canMoveForward){
              if(turnWays.length > 0){
                currentDir = directions.getRandomFrom(turnWays);
              }else if(canMovebackward){
                currentDir = backwardDir;
              }
              delta = this.getDeltaTo(nextTile, true);
            }
          }
          sprite.y += delta.y;
          sprite.x += delta.x;          
        }
      }
    }

    this.getDeltaTo = function(tile, isAccurate){
      var dwp = map.getTileWorldXY(tile);
      var delta = speed * game.time.elapsedMS / 1000;
      var dx = dwp.x - sprite.x;
      var dy = dwp.y - sprite.y;
      if(isAccurate){
        return {
          x: Math.sign(dx) * Math.min(Math.abs(dx), delta),
          y: Math.sign(dy) * Math.min(Math.abs(dy), delta)
        }
      }
      return {
        x: Math.sign(dx) * delta,
        y: Math.sign(dy) * delta
      }
    }

    this.getCollider = function(){
      return sprite;
    }

    this.render = function(){
      game.debug.text(currentDir, 100, game.height - 20);
      if(map && currentTile && nextTile){
        map.debugTile(currentTile);
        map.debugTile(nextTile);
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

    }
  }

  return Stray;
}
