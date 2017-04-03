module.exports = function(game, Phaser){
  function Hero(){
    var sprite;
    var speed = 50;
    var currentDir;
    
    this.preload = function(){
      game.load.image('guy', 'assets/guy.png');
    }

    this.create = function(){
      sprite = game.add.sprite(0, 0, 'guy');
      game.physics.enable(sprite);
      sprite.body.setSize(32, 32, 0, 0);
      sprite.body.collideWorldBounds = true;
      currentDir = this.getRandomDirection();
    }

    this.update = function(){
      sprite.body.velocity.x = 0;
      sprite.body.velocity.y = 0;
      switch(currentDir){
        case 'up': 
          sprite.body.velocity.y = -speed;
        break;
        case 'right': 
          sprite.body.velocity.x = speed;
        break;
        case 'down': 
          sprite.body.velocity.y = speed;
        break;
        case 'left': 
          sprite.body.velocity.x = -speed;
        break;

        default: break;
      }
    }
    
    this.getRandomDirection = function(){
      var directions = ['up', 'right', 'down', 'left'];
      return directions[parseInt(Math.random() * directions.length)];
    }
    
    this.getDestinationPoint = function(map){
      // observe tile by tile in current direction, 
      // detect possible ways for each tile
      // set tile as destination if it has ortogonal way or tiles finished
    }
    
    this.getCollider = function(){
      return sprite;
    }
    
    this.render = function(){
      game.debug.text(currentDir, 100, game.height - 20);
      game.debug.geom(new Phaser.Point( 64, 64 ), 'rgba(0, 256, 0, 1)');
    }
  }
  return new Hero();
}
