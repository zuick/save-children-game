var directions = require('./directions');

module.exports = function(game, Phaser){
  function Hero(){
    var sprite;
    var speed = 10;
    var currentDir;
    var distinationTile;
    var map;
    var currentTile;
    this.preload = function(){
      game.load.image('guy', 'assets/guy.png');
    }

    this.create = function(_map){
      map = _map;
      sprite = game.add.sprite(0, 0, 'guy');
      currentDir = directions.getRandom();
      currentTile = map.getTileCoords(sprite.x, sprite.y);
    }

    this.update = function(){
      var delta = speed * game.time.elapsedMS / 1000;
      switch(currentDir){
        case 'up':
          sprite.y -= delta;
        break;
        case 'right':
          sprite.x += delta;
        break;
        case 'down':
          sprite.y += delta;
        break;
        case 'left':
          sprite.x -= delta;
        break;

        default: break;
      }

      this.getDestinationPoint();
    }

    this.getDestinationPoint = function(){
      var newTile = map.getTileCoords(sprite.x, sprite.y);
      if(currentTile.x !== newTile.x || currentTile.y !== newTile.y){
        currentTile = newTile;
        var wayTiles = map.getTilesInDirection(currentDir, currentTile);
        
      }
      // observe tile by tile in current direction,
      // detect possible ways for each tile
      // set tile as destination if it has ortogonal way or tiles finished
    }

    this.getCollider = function(){
      return sprite;
    }

    this.render = function(){
      game.debug.text(currentDir, 100, game.height - 20);
      if(map && distinationTile){
        map.debugTile(distinationTile);
      }
    }
  }
  return new Hero();
}
