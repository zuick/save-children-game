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
    var preferTurning = false;
    var floatX;
    var floatY;
    var preferedDir;

    this.child;
    this.inTrap = false;
    this.create = function(x, y, _map, _speed, spriteOptions, bodyScale, properties){
      preferedDir = typeof(properties) === 'object' ? properties.dir : '';
      preferForward = typeof(properties) === 'object' ? properties.preferForward : false;
      preferTurning = typeof(properties) === 'object' ? properties.preferTurning : false;

      map = _map;
      speed = _speed;
      var scale = (bodyScale || 1);
      var w = map.get().tileWidth;
      var h = map.get().tileHeight;

      sprite = game.add.sprite(x, y);
      this.child = game.add.sprite(spriteOptions.offsetX + w/2, spriteOptions.offsetY + h/2, spriteOptions.key);
      this.child.anchor.x = 0.5;
      this.child.anchor.y = 0.5;
      this.child.animations.add('walk_left_right', [0,1,2,3], 4, true);
      this.child.animations.add('walk_up', [4,5,6,7], 4, true);
      this.child.animations.add('walk_down', [8,9,10,11], 4, true);
      this.child.animations.add('idle', [1], 4, true);
      sprite.addChild(this.child);

      sprite.texture.width = w;
      sprite.texture.height = h;

      game.physics.enable(sprite);
      sprite.body.setSize(w * scale, h * scale, (w - w * scale) /2, (h - h * scale) /2);

      floatX = x;
      floatY = y;
    }

    this.update = function(){
      if(!this.inTrap){
        var oldValue = currentDir;

        if(!currentDir){
          var possibleWays = map.getTileWays(map.getTileAt(sprite.x, sprite.y));
          if(preferedDir && possibleWays.indexOf(preferedDir) !== -1){
            currentDir = preferedDir;
          }else{
            currentDir = directions.getRandomFrom(possibleWays);
          }
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
              var exludeWays = [backwardDir];
              if(preferTurning) exludeWays.push(currentDir);

              var turnWays = difference(ways, exludeWays);
              if(preferForward){
                if(!canMoveForward){
                  if(turnWays.length > 0){
                    currentDir = directions.getRandomFrom(turnWays);
                  }else if(canMoveBackward){
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
                }else{
                  currentDir = void 0;
                }
              }
            }
            floatX += delta.x;
            floatY += delta.y;
            sprite.x = Math.round(floatX);
            sprite.y = Math.round(floatY);
          }else{
            currentDir = void 0;
            var pos = map.getTileWorldXY(currentTile);
            sprite.x = pos.x;
            sprite.y = pos.y;
            floatX = sprite.x;
            floatY = sprite.y;
          }
        }

        if(currentDir === 'left'){
          sprite.children.forEach(function(innerSprite){
            innerSprite.scale.x = 1;
          })
          this.child.animations.play('walk_left_right');
        }else if(currentDir === 'right'){
          sprite.children.forEach(function(innerSprite){
            innerSprite.scale.x = -1;
          })
          this.child.animations.play('walk_left_right');
        }else if(currentDir === 'up'){
          this.child.animations.play('walk_up');
        }else if(currentDir === 'down'){
          this.child.animations.play('walk_down');
        }else{
          this.child.animations.play('idle');
        }
      }
    }

    this.sign = function(x){
      return x === 0 ? 0 : (x > 0 ? 1 : -1);
    }

    this.getDeltaTo = function(tile, isAccurate){
      var dwp = map.getTileWorldXY(tile);
      var delta = speed * game.time.elapsed / 1000;
      var dx = dwp.x - sprite.x;
      var dy = dwp.y - sprite.y;
      if(isAccurate){
        return {
          x: this.sign(dx) * Math.min(Math.abs(dx), delta),
          y: this.sign(dy) * Math.min(Math.abs(dy), delta)
        }
      }
      return {
        x: this.sign(dx) * delta,
        y: this.sign(dy) * delta
      }
    }

    this.getCollider = function(){
      return sprite;
    }

    this.position = function(){
      return {
        x: sprite.x + map.get().tileWidth / 2,
        y: sprite.y + map.get().tileHeight / 2
      }
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
      this.inTrap = true;
      this.child.animations.stop();
      game.add.tween(sprite).to( { alpha: 0.2 }, 100, "Linear", true, 0, 3, true);
    }

    this.onHero = function(){
      currentDir = directions.getOpposite(currentDir);
    }
  }

  return Stray;
}
