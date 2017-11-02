var utils = require('../modules/utils');

module.exports = function(game, Phaser){
  function Hero(){
    var sprite;
    var map;
    this.child;
    this.create = function(x, y, _map, spriteOptions, bodyScale){
      map = _map;
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
    }

    this.getCollider = function(){
      return sprite;
    }

    this.destroy = function(){
      sprite.destroy();
    }

    this.position = function(){
      return {
        x: sprite.x + map.get().tileWidth / 2,
        y: sprite.y + map.get().tileHeight / 2
      }
    }

    this.render = function(){
      game.debug.body(sprite);
    }

    this.setDirectionFromChildrens = function(childrenPositions){
      var heroPosition = this.position();
      var dir = 'left';
      if(childrenPositions.length > 0){
        var nearest = childrenPositions[0];
        childrenPositions.forEach(function(pos){
          if(utils.distance(heroPosition, pos) < utils.distance(heroPosition, nearest)){
            nearest = pos;
          }
        });
        var dx = nearest.x - heroPosition.x;
        var dy = nearest.y - heroPosition.y;
        if(Math.abs(dx) > Math.abs(dy)){
          dir = dx > 0 ? 'right' : 'left';
        }else{
          dir = dy > 0 ? 'down' : 'up';
        }
      }
      if(dir === 'left'){
        this.child.frame = 0;
        sprite.children.forEach(function(innerSprite){
          innerSprite.scale.x = 1;
        })
      }else if(dir === 'right'){
        this.child.frame = 0;
        sprite.children.forEach(function(innerSprite){
          innerSprite.scale.x = -1;
        })
      }else if(dir === 'up'){
        this.child.frame = 1;
      }else if(dir === 'down'){
        this.child.frame = 2;
      }
    }
  }

  return Hero;
}
