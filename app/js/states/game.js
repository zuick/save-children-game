module.exports = function(game, Phaser){
  var map;
  var guy;
  var walls;
  var background;
  return {
    preload: function() {
      game.load.tilemap('map', 'assets/levels/level-1.json', null, Phaser.Tilemap.TILED_JSON);
      game.load.image('tilemap', 'assets/tilemap.png');
      game.load.image('guy', 'assets/guy.png');
    },
    create: function() {
      game.physics.startSystem(Phaser.Physics.ARCADE);

      map = game.add.tilemap('map');

      map.addTilesetImage('tilemap', 'tilemap');
      map.setCollision(3, true, 'walls');

      background = map.createLayer('background');
      walls = map.createLayer('walls');
      background.resizeWorld();

      guy = game.add.sprite(16, 16, 'guy');
      game.physics.enable(guy);
      guy.body.setCircle(8);
      guy.body.collideWorldBounds = true;

      cursors = game.input.keyboard.createCursorKeys();
    },
    update: function(){
      var speed = 50;
      guy.body.velocity.x = 0;
      guy.body.velocity.y = 0;

      if (cursors.up.isDown){
        guy.body.velocity.y = -speed;
      }
      if (cursors.down.isDown){
        guy.body.velocity.y = speed;
      }
      if (cursors.left.isDown){
        guy.body.velocity.x = -speed;
      }
      if (cursors.right.isDown){
        guy.body.velocity.x = speed;
      }
      game.physics.arcade.collide(guy, walls);
    }
  }
}
