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
    this.create = function(x, y, _map, _speed, _preferForward, spriteOptions, bodyScale){
      console.log(x,y);
      map = _map;
      speed = _speed;
      var scale = (bodyScale || 1);
      var w = map.get().tileWidth;
      var h = map.get().tileHeight;

      sprite = game.add.sprite(x, y);
      this.child = game.add.sprite(spriteOptions.offsetX + w/2, spriteOptions.offsetY + h/2, spriteOptions.key);
      this.child.anchor.x = 0.5;
      this.child.anchor.y = 0.5;
      sprite.addChild(this.child);

      sprite.texture.width = w;
      sprite.texture.height = h;

      game.physics.enable(sprite);
      sprite.body.setSize(w * scale, h * scale, (w - w * scale) /2, (h - h * scale) /2);

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

    this.isBodyOverlap = function(other){
      var rect = {
        x: sprite.x + sprite.body.offset.x,
        y: sprite.y + sprite.body.offset.y,
        w: sprite.body.width,
        h: sprite.body.height
      }

      var otherRect = {
        x: other.x + other.body.offset.x,
        y: other.y + other.body.offset.y,
        w: other.body.width,
        h: other.body.height
      }
      var res =  this.isPointInRect({ x: otherRect.x, y: otherRect.y }, rect) ||
             this.isPointInRect({ x: otherRect.x + otherRect.w, y: otherRect.y }, rect) ||
             this.isPointInRect({ x: otherRect.x, y: otherRect.y + otherRect.h }, rect) ||
             this.isPointInRect({ x: otherRect.x + otherRect.w, y: otherRect.y + otherRect.h}, rect) ||
             this.isPointInRect({ x: rect.x, y: rect.y }, otherRect) ||
             this.isPointInRect({ x: rect.x + rect.w, y: rect.y }, otherRect) ||
             this.isPointInRect({ x: rect.x, y: rect.y + rect.h }, otherRect) ||
             this.isPointInRect({ x: rect.x + rect.w, y: rect.y + rect.h}, otherRect);
             return res;
    }

    this.isPointInRect = function(point, rect){
      return point.x >= rect.x &&
             point.y >= rect.y &&
             point.x <= rect.x + rect.w &&
             point.y <= rect.y + rect.h;
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
