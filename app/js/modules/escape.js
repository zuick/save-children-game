var utils = require('./utils');

module.exports = function(game, Phaser){
  function Escape(){
    var sprite;

    this.create = function(x, y, map, spriteOptions){
      sprite = game.add.sprite(x + spriteOptions.offsetX, y + spriteOptions.offsetY, spriteOptions.key);
      game.physics.enable(sprite);
	  utils.setBodySize(sprite.body, sprite.texture.width, sprite.texture.height, 1, map.worldScale);
    }

    this.getCollider = function(){
      return sprite;
	}
	
	this.render = function(){
		game.debug.body(sprite);
	}
  }

  return Escape;
}
