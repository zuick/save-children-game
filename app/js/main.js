(function(){
  window.PIXI = require('phaser/build/custom/pixi');
  window.p2 = require('phaser/build/custom/p2');
  window.Phaser = require('phaser/build/custom/phaser-split');
  var config = require('./configs/config');
  var game = new Phaser.Game(config.width, config.height, window.Phaser.AUTO);
  var gameState = require('./states/game')(game, window.Phaser);
  var preloaderState = require('./states/preloader')(game, window.Phaser);
  var startState = require('./states/start')(game, window.Phaser);
  var levelsState = require('./states/levels')(game, window.Phaser);
  var bootState = require('./states/boot')(game, window.Phaser);

  game.state.add('preloader', preloaderState);
  game.state.add('levels', levelsState);
  game.state.add('start', startState);
  game.state.add('game', gameState);
  game.state.add('boot', bootState);

  game.state.start('boot');
})();
