var config = require('../config');

module.exports = function(game, Phaser){
  var blockWidth = config.width * config.UI.levels.blockWidthScale;
  var levelItemFullWidth = config.UI.levels.levelItem.width + config.UI.levels.levelItemsPadding;
  var levelItemFullHeight = config.UI.levels.levelItem.height + config.UI.levels.levelItemsPadding;
  var blockX = config.width / 2 - blockWidth / 2;
  var blockY = config.UI.levels.blockMarginTop;
  var maxLevelItems = Math.floor(blockWidth / levelItemFullWidth);
  var levelItemTextStyle = { font: "64px Arial", fill: "#fff", align: "center" };

  var currentBlockIndex = 0;

  return {
    drawLevelItem: function(x, y, index, key){
      var item = game.add.button(x, y, key, function(){ game.state.start('game', true, false, index); console.log(index);});
      var text = game.add.text(item.width / 2, item.height / 2, index + 1, levelItemTextStyle);
      text.anchor.x = 0.5;
      text.anchor.y = 0.5;
      item.addChild(text);
    },

    drawBlock: function(levels){
      var marginLeft = (blockWidth - maxLevelItems * levelItemFullWidth) / 2;
      levels.forEach(function(level, index){
        var type = level.type || 0;
        if(Object.keys(config.UI.levels.types).indexOf(type.toString()) === -1) type = 0;

        var row = Math.floor(index / maxLevelItems);
        var col = index % maxLevelItems;
        this.drawLevelItem(
          blockX + marginLeft + col * levelItemFullWidth,
          blockY + row * levelItemFullHeight,
          index,
          config.UI.levels.types[type]
        );
      }.bind(this))
    },

    create: function(){
      this.drawBlock(config.levels[currentBlockIndex])
    }
  }
}
