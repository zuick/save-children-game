(function(){
  window.PIXI = require('phaser/build/custom/pixi');
  window.p2 = require('phaser/build/custom/p2');
  window.Phaser = require('phaser/build/custom/phaser-split');
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-canvas');
  var gameState = require('./states/game')(game);

  game.state.add('game', gameState);
  game.state.start('game');
})();
