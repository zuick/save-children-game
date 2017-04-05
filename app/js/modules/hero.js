module.exports = function(game, Phaser){
  function Hero(){
    var sprite;
    var speed = 10;
    var currentDir;
    var distination;
    var map;
    var currentTile;
    this.preload = function(){
      game.load.image('guy', 'assets/guy.png');
    }

    this.create = function(_map){
      sprite = game.add.sprite(0, 0, 'guy');
      currentDir = this.getRandomDirection();
      map = _map;
    }

    this.update = function(){
      var delta = speed * game.time.elapsedMS / 1000;
      switch(currentDir){
        case 'up':
          sprite.x += delta;
        break;
        case 'right':
          sprite.x += delta;
        break;
        case 'down':
          sprite.y -= delta;
        break;
        case 'left':
          sprite.x -= delta;
        break;

        default: break;
      }

      this.getDestinationPoint();
    }

    this.getRandomDirection = function(){
      //var directions = ['up', 'right', 'down', 'left'];
      var directions = ['right', 'down'];
      return directions[parseInt(Math.random() * directions.length)];
    }

    this.getCurrentTile = function(){
      return { x: Math.floor(sprite.x / map.tileWidth), y: Math.floor(sprite.y / map.tileHeight)}
    }

    this.getDestinationPoint = function(){
      currentTile = this.getCurrentTile();
      // observe tile by tile in current direction,
      // detect possible ways for each tile
      // set tile as destination if it has ortogonal way or tiles finished
    }

    this.getCollider = function(){
      return sprite;
    }

    this.render = function(){
      game.debug.text(currentDir, 100, game.height - 20);
      game.debug.geom(new Phaser.Point(currentTile.x * map.tileWidth + map.tileWidth / 2, currentTile.y * map.tileHeight + map.tileHeight / 2), 'rgba(0, 256, 0, 1)');
    }
  }
  return new Hero();
}
