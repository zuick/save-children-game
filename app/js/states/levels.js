var config = require('../configs/config');
var UI = require('../configs/ui');
var levelsConfig = require('../configs/levels');
var l10n = require('../modules/l10n');

module.exports = function(game, Phaser){
  var blockWidth = config.width * UI.levels.blockWidthScale;
  var levelItemFullWidth = UI.levels.levelItem.width + UI.levels.levelItemsPadding;
  var levelItemFullHeight = UI.levels.levelItem.height + UI.levels.levelItemsPadding;
  var blockX = config.width / 2 - blockWidth / 2;
  var blockY = UI.levels.blockMarginTop;
  var maxLevelItems = Math.floor(blockWidth / levelItemFullWidth);

  var currentBlockIndex = 0;
  var levelItems = [];
  var prevArrow, nextArrow, header, headerTint;
  var shadowSettings = UI.levels.levelItemTextShadow;
  return {
    init: function(index){
      if(typeof(index) !== 'undefined'){
        currentBlockIndex = index;
      }
    },

    drawLevelItem: function(x, y, index, key){
      var item = game.add.button(x, y, key, function(){ game.state.start('game', true, false, currentBlockIndex, index);});
      var shadow = game.add.text(
        item.width / 2 + UI.levels.levelItemTextOffsetX + shadowSettings.x,
        item.height / 2 + UI.levels.levelItemTextOffsetY + shadowSettings.y,
        index + 1, shadowSettings.style
      );
      shadow.anchor.set(0.5);
      shadow.alpha = shadowSettings.alpha;

      var text = game.add.text(
        item.width / 2 + UI.levels.levelItemTextOffsetX,
        item.height / 2 + UI.levels.levelItemTextOffsetY,
        index + 1, UI.levels.levelItemTextStyle
      );
      text.anchor.set(0.5);

      item.addChild(shadow);
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
        if(Object.keys(UI.levels.types).indexOf(type.toString()) === -1) type = 0;

        var row = Math.floor(index / maxLevelItems);
        var col = index % maxLevelItems;
        levelItems.push(this.drawLevelItem(
          blockX + marginLeft + col * levelItemFullWidth,
          blockY + row * levelItemFullHeight,
          index,
          UI.levels.types[type]
        ));
      }.bind(this))

      header = game.add.text(config.width / 2, UI.levels.blockMarginTop / 2, l10n.get('DIFFICULTY_LEVEL', [currentBlockIndex + 1]), UI.levels.headerTextStyle);
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
        nextArrow = game.add.button(blockX + blockWidth + UI.levels.blockArrowMarginLeft, y, 'levelsBlockArrowRight', this.onNextBlock, this);
        nextArrow.anchor.x = 0.5;
        nextArrow.anchor.y = 0.5;
      }
      // draw prev
      if(currentBlockIndex > 0){
        prevArrow = game.add.button(blockX - UI.levels.blockArrowMarginLeft, y, 'levelsBlockArrowLeft', this.onPrevBlock, this);
        prevArrow.anchor.x = 0.5;
        prevArrow.anchor.y = 0.5;
      }
    },

    drawHeaderTint: function(){
      if(headerTint) headerTint.destroy();
      headerTint = game.add.sprite(config.width / 2, UI.levels.blockMarginTop / 2, 'pixel');
      headerTint.anchor.set(0.5);
      headerTint.tint = 0x000000;
      headerTint.width = config.width;
      headerTint.height = UI.levels.headerHeight;
      headerTint.alpha = 0.5;
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
      game.add.sprite(0, 0, 'levelsBackground');
      this.drawHeaderTint();
      game.stage.backgroundColor = UI.levels.backgroundColor;
      game.world.setBounds(0, 0, config.width, config.height);
      this.redraw();
    }
  }
}
