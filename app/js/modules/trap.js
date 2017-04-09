module.exports = function(game, Phaser){
  function Trap(){
    var sprite;

    this.create = function(x, y){
      sprite = game.add.sprite(x, y, 'trap');
      game.physics.enable(sprite);
      sprite.body.setSize(sprite.texture.width, sprite.texture.height, 0, 0);
    }

    this.getCollider = function(){
      return sprite;
    }
  }

  return Trap;
}
