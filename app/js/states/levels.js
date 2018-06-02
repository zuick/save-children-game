var config = require('../configs/config');
var UI = require('../configs/ui');
var levelsConfig = require('../configs/levels');
var l10n = require('../modules/l10n');
var utils = require('../modules/utils');
var storage = require('../modules/storage');
var difficulty_titles = ['DIFFICULTY_LEVEL_EAZY', 'DIFFICULTY_LEVEL_MIDDLE', 'DIFFICULTY_LEVEL_HARD'];

module.exports = function(game, Phaser){
  var audioManager = require('../modules/audio').manager();
  var blockWidth = config.width * UI.levels.blockWidthScale;
  var levelItemScale = utils.isSmallAspect() ? UI.levels.blockScaleForSmallAspect : 1;
  var levelItemFullWidth = levelItemScale * (UI.levels.levelItem.width + UI.levels.levelItemsPadding);
  var levelItemFullHeight = levelItemScale * (UI.levels.levelItem.height + UI.levels.levelItemsPadding);
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

    drawLevelItem: function(x, y, index, number, type, scale, resolved){
      var item = game.add.button(x, y, 'levelsItems', function(){ 
		  game.state.start(
			'game', true, false, currentBlockIndex, index, false, 
			levelsConfig[currentBlockIndex][index].disableCollisions,
			levelsConfig[currentBlockIndex][index].disableFX,
			levelsConfig[currentBlockIndex][index].disableStrayUpdate
		  );
		}, this, type
	  );
	  item.setFrames(type, type, type);
	  
	  item.scale.set(scale);
	  var centerX = item.width / (2 * scale);
	  var centerY = item.height / (2 * scale);

      var shadow = game.add.text(
        centerX + UI.levels.levelItemTextOffsetX * scale + shadowSettings.x,
        centerY + UI.levels.levelItemTextOffsetY * scale + shadowSettings.y,
        number, shadowSettings.style
      );
      shadow.anchor.set(0.5);
      shadow.alpha = shadowSettings.alpha;

      var text = game.add.text(
        centerX + UI.levels.levelItemTextOffsetX * scale,
		centerY+ UI.levels.levelItemTextOffsetY * scale,
        number, UI.levels.levelItemTextStyle
      );
      text.anchor.set(0.5);

      item.addChild(shadow);
      item.addChild(text);

      if(resolved){
        var check = game.add.sprite(
			centerX + UI.levels.levelItemCheckOffsetX * scale,
			centerY + UI.levels.levelItemCheckOffsetY * scale,
          'buttons'
        );
        check.anchor.set(0.5);
        check.frame = 8;
        item.addChild(check);
      }

      return item;
    },

    drawBlock: function(){
      var progress = storage.getProgress();
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
        var number = utils.levelNumber(currentBlockIndex, index);
        levelItems.push(this.drawLevelItem(
          blockX + marginLeft + col * levelItemFullWidth,
          blockY + row * levelItemFullHeight,
          index,
          number,
		  type,
		  levelItemScale,
          typeof(progress[number]) !== 'undefined'
        ));
      }.bind(this))

      header = game.add.text(config.width / 2, UI.levels.blockMarginTop / 2, l10n.get(difficulty_titles[currentBlockIndex]), UI.levels.headerTextStyle);
      header.anchor.x = 0.5;
      header.anchor.y = 0.5;
    },

    drawArrows: function(scale){
      // clear first
      if(prevArrow) prevArrow.destroy();
      if(nextArrow) nextArrow.destroy();

      // draw next
      var maxLevelsRows = Math.ceil(levelsConfig[currentBlockIndex].length / maxLevelItems);
      var y = blockY + (maxLevelsRows * levelItemFullHeight) / 2
      if(currentBlockIndex < levelsConfig.length - 1){
        nextArrow = game.add.button(blockX + blockWidth + UI.levels.blockArrowMarginLeft, y, 'levelsBlockArrows', this.onNextBlock, this, 1);
        nextArrow.setFrames(1,1,1);
        nextArrow.anchor.x = 0.5;
        nextArrow.anchor.y = 0.5;
      }
      // draw prev
      if(currentBlockIndex > 0){
        prevArrow = game.add.button(blockX - UI.levels.blockArrowMarginLeft, y, 'levelsBlockArrows', this.onPrevBlock, this, 0);
        prevArrow.setFrames(0,0,0);
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

    drawBackButton: function(scale){      
      backButton = game.add.button(
        UI.levels.backButton.left,
        config.height / 2  + UI.levels.backButton.offsetY,
        'buttons',
        this.onBack,
        this,
        2
      );
      backButton.anchor.set(0.5);
      backButton.setFrames(2, 2, 2);
      backButton.scale.set(scale);
    },

    onNextBlock: function(){
      if(currentBlockIndex + 1 < levelsConfig.length){
        currentBlockIndex++;
        this.redraw();
      }

      audioManager.playSound();
    },

    onPrevBlock: function(){
      if(currentBlockIndex - 1 >= 0){
        currentBlockIndex--;
        this.redraw();
      }

      audioManager.playSound();
    },

    onBack: function(){
      game.state.start('start', true, false);

      audioManager.playSound();
    },

    redraw: function(scale){
      this.drawBlock();
      this.drawArrows(scale);
    },

    create: function(){
      var scale = (Phaser.Device.iOS || Phaser.Device.android) ? 1.5 : 1;
      utils.backgroundFullSize(game.add.sprite(0, 0, 'levelsBackground'), true);
      this.drawHeaderTint();
      this.drawBackButton(scale);
      game.stage.backgroundColor = UI.levels.backgroundColor;
      game.world.setBounds(0, 0, config.width, config.height);
      this.redraw(scale);
      audioManager.playMusic('musicMenu');
	},
	
	render: function(){
		game.debug.text(Math.floor(1000 / game.time.elapsed), 80, 25, '#00ff00');
	}
  }
}
