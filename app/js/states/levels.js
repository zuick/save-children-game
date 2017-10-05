var config = require('../configs/config');
var levelsConfig = require('../configs/levels');
var l10n = require('../modules/l10n');

module.exports = function(game, Phaser){
  var blockWidth = config.width * config.UI.levels.blockWidthScale;
  var levelItemFullWidth = config.UI.levels.levelItem.width + config.UI.levels.levelItemsPadding;
  var levelItemFullHeight = config.UI.levels.levelItem.height + config.UI.levels.levelItemsPadding;
  var blockX = config.width / 2 - blockWidth / 2;
  var blockY = config.UI.levels.blockMarginTop;
  var maxLevelItems = Math.floor(blockWidth / levelItemFullWidth);

  var currentBlockIndex = 0;
  var levelItems = [];
  var prevArrow, nextArrow, header;

  return {
    init: function(index){
      if(typeof(index) !== 'undefined'){
        currentBlockIndex = index;
      }
    },

    drawLevelItem: function(x, y, index, key){
      var item = game.add.button(x, y, key, function(){ game.state.start('game', true, false, currentBlockIndex, index);});
      var text = game.add.text(item.width / 2, item.height / 2, index + 1, config.UI.levels.levelItemTextStyle);
      text.anchor.x = 0.5;
      text.anchor.y = 0.5;
      item.addChild(text);
      return item;
    },

    drawBlock: function(){
      //clear first
      levelItems.forEach(function(item){ item.destroy(); });
      if(header) header.destroy();

      var levels = levelsConfig[currentBlockIndex];
      var marginLeft = (blockWidth - maxLevelItems * levelItemFullWidth) / 2;
      levels.forEach(function(level, index){
        var type = level.type || 0;
        if(Object.keys(config.UI.levels.types).indexOf(type.toString()) === -1) type = 0;

        var row = Math.floor(index / maxLevelItems);
        var col = index % maxLevelItems;
        levelItems.push(this.drawLevelItem(
          blockX + marginLeft + col * levelItemFullWidth,
          blockY + row * levelItemFullHeight,
          index,
          config.UI.levels.types[type]
        ));
      }.bind(this))

      header = game.add.text(config.width / 2, config.UI.levels.blockMarginTop / 2, l10n.get('DIFFICULTY_LEVEL', [currentBlockIndex + 1]), config.UI.levels.headerTextStyle);
      header.anchor.x = 0.5;
      header.anchor.y = 0.5;
    },

    drawArrows: function(){
      // clear first
      if(prevArrow) prevArrow.destroy();
      if(nextArrow) nextArrow.destroy();

      // draw next
      var maxLevelsRows = Math.ceil(levelsConfig[currentBlockIndex].length / maxLevelItems);
      var y = blockY + (maxLevelsRows * levelItemFullHeight) / 2
      if(currentBlockIndex < levelsConfig.length - 1){
        nextArrow = game.add.button(blockX + blockWidth + config.UI.levels.blockArrowMarginLeft, y, 'levelsBlockArrow', this.onNextBlock, this);
        nextArrow.anchor.x = 0.5;
        nextArrow.anchor.y = 0.5;
        nextArrow.scale.x = -1;
      }
      // draw prev
      if(currentBlockIndex > 0){
        prevArrow = game.add.button(blockX - config.UI.levels.blockArrowMarginLeft, y, 'levelsBlockArrow', this.onPrevBlock, this);
        prevArrow.anchor.x = 0.5;
        prevArrow.anchor.y = 0.5;
      }
    },

    onNextBlock: function(){
      if(currentBlockIndex + 1 < levelsConfig.length){
        currentBlockIndex++;
        this.redraw();
      }
    },

    onPrevBlock: function(){
      if(currentBlockIndex - 1 >= 0){
        currentBlockIndex--;
        this.redraw();
      }
    },

    redraw: function(){
      this.drawBlock();
      this.drawArrows();
    },

    create: function(){
      game.world.setBounds(0, 0, config.width, config.height);
      this.redraw();
    }
  }
}
