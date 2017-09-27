module.exports = function(game, Phaser){
  function Escape(){
    var sprite;

    this.create = function(x, y, spriteOptions){
      sprite = game.add.sprite(x + spriteOptions.offsetX, y + spriteOptions.offsetY, spriteOptions.key);
      game.physics.enable(sprite);
      sprite.body.setSize(sprite.texture.width, sprite.texture.height, 0, 0);
    }

    this.getCollider = function(){
      return sprite;
    }
  }

  return Escape;
}
