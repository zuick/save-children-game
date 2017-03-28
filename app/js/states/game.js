module.exports = function(game){
  return {
    preload: function() {
      game.load.image('guy', 'assets/guy.png');
    },
    create: function() {
      game.add.sprite(0, 0, 'guy');
    }
  }
}
