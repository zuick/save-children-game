module.exports = function(game, Phaser){
  function Bonus(){
    this.sprite;
    this.create = function(x, y, map, spriteOptions, callback, context){
      var w = map.get().tileWidth;
      var h = map.get().tileHeight;

      this.sprite = game.add.button(x + w/2, y + h/2, spriteOptions.key, callback, context);
      this.sprite.alpha = 0;
      this.sprite.anchor.set(0.5);

      game.add.tween(this.sprite).to( { alpha: 1 }, 500, "Linear", true);
      game.add.tween(this.sprite.scale).to( { x: 1.2, y: 1.2 }, 500, "Linear", true, 0, -1, true);
    }

    this.destroy = function(){
      game.add.tween(this.sprite.scale).to( { x: 2, y: 2 }, 500, "Linear", true);
      game.add.tween(this.sprite).to( { alpha: 0 }, 500, "Linear", true).onComplete.add(this.doDestroy, this);
    }

    this.doDestroy = function(){
      this.sprite.destroy();
    }
  }

  return Bonus;
}
