module.exports = function(game, Phaser){
  function Trap(){
    var sprite;
    this.child;
    this.create = function(x, y, map, spriteOptions, bodyScale){
      var w = map.get().tileWidth;
      var h = map.get().tileHeight;

      var scale = (bodyScale || 1);
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
  }

  return Trap;
}
