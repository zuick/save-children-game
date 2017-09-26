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
    var preferForward = false;
    var floatX;
    var floatY;
    this.child;
    this.create = function(x, y, _map, _speed, _preferForward, spriteOptions, _bodyscale){
      map = _map;
      speed = _speed;
      var scale = (_bodyscale || 1);
      var w = map.get().tileWidth * scale;
      var h = map.get().tileHeight * scale;

      sprite = game.add.sprite(x, y);
      this.child = game.add.sprite(spriteOptions.offsetX + w/2, spriteOptions.offsetY + h/2, spriteOptions.key);
      this.child.anchor.x = 0.5;
      this.child.anchor.y = 0.5;
      sprite.addChild(this.child);
      
      sprite.texture.width = w;
      sprite.texture.height = h;

      game.physics.enable(sprite);
      sprite.body.setSize(w, h, 0, 0);

      preferForward = _preferForward;
      floatX = x;
      floatY = y;
    }

    this.update = function(){
      if(!currentDir){
        currentDir = directions.getRandomFrom(
          map.getTileWays(
            map.getTileAt(sprite.x, sprite.y)
          )
        );
      }else{
        var x = currentDir === 'right' || currentDir === 'down' ? floatX : floatX + sprite.texture.width - 1;
        var y = currentDir === 'right' || currentDir === 'down' ? floatY : floatY + sprite.texture.height - 1;
        currentTile = map.getTileAt(x, y);
        nextTile = map.getNextTileFrom(currentTile, currentDir);
        if(nextTile){
          var delta = this.getDeltaTo(nextTile);
          var nextDeltaTile = map.getTileAt(x + delta.x, y + delta.y);
          if(nextDeltaTile.x === nextTile.x && nextDeltaTile.y === nextTile.y){
            var ways = map.getTileWays(nextDeltaTile);
            var backwardDir = directions.getOpposite(currentDir);
            var canMoveForward = ways.indexOf(currentDir) !== -1;
            var canMoveBackward = ways.indexOf(backwardDir) !== -1;
            var turnWays = difference(ways, [backwardDir, currentDir]);
            if(preferForward){
              if(!canMoveForward){
                if(turnWays.length > 0){
                  currentDir = directions.getRandomFrom(turnWays);
                }else if(canMovebackward){
                  currentDir = backwardDir;
                }
                delta = this.getDeltaTo(nextTile, true);
              }
            }else{
              if(turnWays.length > 0){
                currentDir = directions.getRandomFrom(turnWays);
                delta = this.getDeltaTo(nextTile, true);
              }else if(!canMoveForward && canMoveBackward){
                currentDir = backwardDir;
                delta = this.getDeltaTo(nextTile, true);
              }
            }
          }
          floatX += delta.x;
          floatY += delta.y;
          sprite.x = Math.round(floatX);
          sprite.y = Math.round(floatY);
        }
      }

      if(currentDir === 'left'){
        sprite.children.forEach(function(innerSprite){
          innerSprite.scale.x = -1;
        })
      }else if(currentDir === 'right'){
        sprite.children.forEach(function(innerSprite){
          innerSprite.scale.x = 1;
          //innerSprite.x +=
        })
      }
    }

    this.getDeltaTo = function(tile, isAccurate){
      var dwp = map.getTileWorldXY(tile);
      var delta = speed * game.time.physicsElapsed;
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
      game.debug.body(sprite);
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
      tiles.push(map.getTileAt(x + w - 1, y));
      tiles.push(map.getTileAt(x, y + h - 1));
      tiles.push(map.getTileAt(x + w - 1, y + h - 1));
      return tiles.indexOf(tile) !== -1;
    }

    this.onTrap = function(){
      sprite.tint = 0xFF0000;
    }

    this.onHero = function(){
      currentDir = directions.getOpposite(currentDir);
    }
  }

  return Stray;
}
