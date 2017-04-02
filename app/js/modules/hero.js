module.exports = function(game, Phaser){
  function Hero(){
    var sprite;
    var cursors;
    var speed = 50;
    this.preload = function(){
      game.load.image('guy', 'assets/guy.png');
    }

    this.create = function(){
      sprite = game.add.sprite(16, 16, 'guy');
      game.physics.enable(sprite);
      sprite.body.setCircle(8);
      sprite.body.collideWorldBounds = true;

      cursors = game.input.keyboard.createCursorKeys();
    }

    this.update = function(){
      sprite.body.velocity.x = 0;
      sprite.body.velocity.y = 0;

      if (cursors.up.isDown){
        sprite.body.velocity.y = -speed;
      }
      if (cursors.down.isDown){
        sprite.body.velocity.y = speed;
      }
      if (cursors.left.isDown){
        sprite.body.velocity.x = -speed;
      }
      if (cursors.right.isDown){
        sprite.body.velocity.x = speed;
      }
    }

    this.getCollider = function(){
      return sprite;
    }
  }
  return new Hero();
}
