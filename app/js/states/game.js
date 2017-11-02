var config = require('../configs/config');
var UI = require('../configs/ui');
var levelsConfig = require('../configs/levels');
var tileSprites = require('../tileSprites');
var l10n = require('../modules/l10n');
var utils = require('../modules/utils');
var vis = require('../modules/vis');
var storage = require('../modules/storage');

var states = {
  normal: 0,
  paused: 1,
  success: 2,
  gameover: 3
}

module.exports = function(game, Phaser){
  var map = require('../modules/map')(game, Phaser);
  var Stray = require('../modules/stray')(game, Phaser);
  var Trap = require('../modules/trap')(game, Phaser);
  var Escape = require('../modules/escape')(game, Phaser);
  var Hero = require('../modules/hero')(game, Phaser);
  var Bonus = require('../modules/bonus')(game, Phaser);
  var pausePopupCreator = require('../modules/popups/pause')(game, Phaser);
  var successPopupCreator = require('../modules/popups/success')(game, Phaser);
  var gameoverPopupCreator = require('../modules/popups/gameover')(game, Phaser);
  var confirmPopupCreator = require('../modules/popups/confirm')(game, Phaser);
  var quizPopupCreator = require('../modules/popups/quiz')(game, Phaser);
  var audioManager = require('../modules/audio').manager();

  var children, traps, escapes, savedChildren, hero, sparksEffects,
    currentLevelIndex, currentBlockIndex, initialChildrenCount, numberOfFails, slowMode,
    middleLayer, backLayer, UILayer,
    timerText, state, pauseButton, statusText, levelNumberText, backButton,
    pausePopup, successPopup, gameoverPopup, confirmPopup, quizPopup,
    bonusDelay, bonusPlaces, bonuses, trapsActive, bonusesMarks;

  var screenParams = {
    scale: 1,
    offsetX: 0,
    offsetY: 0
  }
  var time = 0;
  return {
    init: function(blockIndex, levelIndex, isSlowMode){
      children = [];
      traps = [];
      escapes = [];
      sparksEffects = [];
      savedChildren = 0;
      initialChildrenCount = 0;
      if(currentBlockIndex !== blockIndex || currentLevelIndex !== levelIndex){
        numberOfFails = 0;
      }
      currentBlockIndex = blockIndex;
      currentLevelIndex = levelIndex;
      bonusDelay = config.defaultBonusDelay;
      bonusPlaces = [];
      bonuses = [];
      bonusesMarks = [];
      trapsActive = true;
      time = 0;
      state = states.normal;
      timerText = void 0;
      statusText = void 0;
      levelNumberText = void 0;
      pauseButton = void 0;
      backButton = void 0;
      slowMode = !!isSlowMode;
      if(pausePopup) pausePopup.destroy();
      pausePopup = void 0;

      if(successPopup) successPopup.destroy();
      successPopup = void 0;

      if(gameoverPopup) gameoverPopup.destroy();
      gameoverPopup = void 0;

      if(quizPopup) quizPopup.destroy();
      quizPopup = void 0;

      this.closeConfrim();
      this.loadMap();

      vis.unsubscribe(this.onWindowVisibleChanged.bind(this));
      vis.subsribe(this.onWindowVisibleChanged.bind(this));
    },
    onWindowVisibleChanged: function(){
      if(!vis.state()){
        this.onPauseClicked();
      }
    },
    loadMap: function(){
      map.create('level' + currentBlockIndex + '-' + currentLevelIndex, void 0, this.isTileOccupied.bind(this));
      backLayer = game.add.group();
      middleLayer = game.add.group();
      UILayer = game.add.group();

      var childSpeed = slowMode
        ? config.children.slowModeSpeed
        : (levelsConfig[currentBlockIndex][currentLevelIndex].childrenSpeed || config.children.defaultSpeed ) - Math.round(Math.random() * config.children.speedAccuracy);

      var type = levelsConfig[currentBlockIndex][currentLevelIndex].type || 0;

      bonusDelay = levelsConfig[currentBlockIndex][currentLevelIndex].bonusDelay || config.defaultBonusDelay;
      bonusPlaces = map.getTilesInLayer(config.map.main.name, config.map.main.ground);

      // fill gorunds, empty space with last ground option
      map.getTilesInLayer(config.map.main.name).forEach(function(tile, index){
        var worldPosition = map.getTileWorldXY(tile);
        var spriteOptions = tileSprites[tile.index];

        if(spriteOptions && config.map.main.ground.indexOf(tile.index) !== -1){
          backLayer.create(worldPosition.x + spriteOptions.offsetX, worldPosition.y + spriteOptions.offsetY, spriteOptions.key);
        }

        if(spriteOptions && (config.map.main.walls.indexOf(tile.index) !== -1 || config.map.main.danger.indexOf(tile.index) !== -1)){
          var groundSpriteOptions = tileSprites[config.map.defaultGroundByLevelType[type]];
          backLayer.create(worldPosition.x + groundSpriteOptions.offsetX, worldPosition.y + groundSpriteOptions.offsetY, groundSpriteOptions.key);
        }
      });

      // fill shadows
      map.getTilesInLayer(config.map.main.name, config.map.main.walls).forEach(function(tile, index){
        var worldPosition = map.getTileWorldXY(tile);
        var spriteOptions = tileSprites[tile.index];

        if(spriteOptions && spriteOptions.shadow){
          backLayer.create(worldPosition.x + spriteOptions.shadow.offsetX, worldPosition.y + spriteOptions.shadow.offsetY, spriteOptions.shadow.key);
        }
      });

      // fill houses
      map.getTilesInLayer(config.map.main.name, config.map.main.walls).forEach(function(tile, index){
        var worldPosition = map.getTileWorldXY(tile);
        var spriteOptions = tileSprites[tile.index];

        if(spriteOptions){
          middleLayer.create(worldPosition.x + spriteOptions.offsetX, worldPosition.y + spriteOptions.offsetY, spriteOptions.key);
        }
      });

      // fill dangers
      map.getTilesInLayer(config.map.main.name, config.map.main.danger.concat(config.map.main.groundDanger)).forEach(function(tile, index){
        var worldPosition = map.getTileWorldXY(tile);
        var spriteOptions = tileSprites[tile.index];

        if(spriteOptions){
          var instance = new Trap();
          instance.create(worldPosition.x, worldPosition.y, map, spriteOptions);
          middleLayer.add(instance.getCollider());
          traps.push(instance);
        }
      });

      // objects
      if(map.get().objects.objects){
        map.get().objects.objects.forEach(function(obj){
          var spriteOptions = tileSprites[obj.gid];
          var worldPosition = map.ceilPosition(obj.x + map.get().tileWidth / 2, obj.y - map.get().tileHeight / 2);
          if(spriteOptions){
            // children
            if(config.map.objects.children.indexOf(obj.gid) !== -1){
              var instance = new Stray();
              var ceiled = map.ceilPosition(worldPosition.x, worldPosition.y);

              instance.create(ceiled.x, ceiled.y, map, childSpeed, spriteOptions, config.children.bodyScale, obj.properties);
              children.push(instance);
              middleLayer.add(instance.getCollider());

            }else if(config.map.objects.escapes.indexOf(obj.gid) !== -1){
              var instance = new Escape();
              instance.create(worldPosition.x, worldPosition.y, spriteOptions);
              backLayer.add(instance.getCollider());
              escapes.push(instance);

            }else if(config.map.objects.hero.indexOf(obj.gid) !== -1){
              hero = new Hero();
              hero.create(worldPosition.x, worldPosition.y, map, spriteOptions, config.hero.bodyScale);
              middleLayer.add(hero.getCollider());

            }
          }
        });
      }

      initialChildrenCount = children.length;

      screenParams.offsetX = (config.width - map.getSize().x) / 2;
      screenParams.offsetY = (config.height - map.getSize().y) / 2;

      game.world.setBounds(-screenParams.offsetX, -screenParams.offsetY, config.width - screenParams.offsetX, config.height - screenParams.offsetY);
    },
    createText: function(options, text, anchor){
      var t = game.add.text(
        config.width / 2 - screenParams.offsetX + options.offsetX,
        options.marginTop - screenParams.offsetY,
        text,
        options.style
      );
      if(options.stroke){
        t.stroke = options.stroke.color;
        t.strokeThickness = options.stroke.thickness;
      }
      t.anchor.set(anchor);
      return t;
    },
    create: function() {
      game.stage.backgroundColor = UI.game.backgroundColor;
      game.physics.startSystem(Phaser.Physics.ARCADE);
      game.input.onDown.add(this.onPointerDown, this);

      game.input.keyboard.addKey(Phaser.Keyboard.N).onUp.add(this.nextLevel, this);
      game.input.keyboard.addKey(Phaser.Keyboard.S).onUp.add(this.onSuccess, this);
      game.time.events.loop(Phaser.Timer.SECOND, this.updateTime, this);
      game.time.events.loop(Phaser.Timer.SECOND * config.audio.buzzInterval, this.buzzSound, this);
      this.activateTraps();

      timerText = this.createText(UI.game.timerText, utils.formatTime(time), 0.5);
      levelNumberText = this.createText(UI.game.levelNumberText, utils.levelNumber(currentBlockIndex, currentLevelIndex), 0.5);
      statusText = this.createText(UI.game.statusText, "", 0.5);
      backButton = game.add.button(
        config.width / 2 - screenParams.offsetX + UI.game.backButton.offsetX,
        UI.game.backButton.marginTop - screenParams.offsetY,
        'buttons',
        this.onBackClicked,
        this,
        2
      );
      backButton.anchor.set(0.5);
      backButton.setFrames(2, 2, 2);


      UILayer.add(game.add.sprite(config.width / 2 - screenParams.offsetX + UI.game.timer.offsetX, UI.game.timer.marginTop - screenParams.offsetY, 'timer'));
      UILayer.add(game.add.sprite(config.width / 2 - screenParams.offsetX + UI.game.status.offsetX, UI.game.status.marginTop - screenParams.offsetY, 'levelStatus'));
      UILayer.add(backButton);
      UILayer.add(timerText);
      UILayer.add(levelNumberText);
      UILayer.add(statusText);

      pauseButton = game.add.button(
        config.width / 2 - screenParams.offsetX + UI.game.pauseButton.offsetX,
        UI.game.pauseButton.marginTop - screenParams.offsetY,
        'buttons',
        this.onPauseClicked,
        this,
        0
      );

      pauseButton.anchor.set(0.5);
      UILayer.add(pauseButton);

      this.updateStatusText();
      audioManager.playMusic(config.audio.musicByDifficulty[currentBlockIndex]);
    },
    buzzSound: function(){
      if(state === states.normal && trapsActive){
        audioManager.stopBuzz();
        audioManager.playBuzz(config.audio.buzz[Math.floor(Math.random() * config.audio.buzz.length)], config.audio.buzzVolume);
      }
    },
    onSuccess: function(){
      storage.setProgress(utils.levelNumber(currentBlockIndex, currentLevelIndex), time);
      var levelTitlesTimes = levelsConfig[currentBlockIndex][currentLevelIndex].titlesTime || [60, 60, 60];
      var titleRate = 0;
      if(time > levelTitlesTimes[1] && time <= levelTitlesTimes[2]){
        titleRate = 1;
      }else if(time > levelTitlesTimes[2]){
        titleRate = 2;
      }
      var titleKey = 'LEVEL_TITLE_' + currentBlockIndex + '_' + currentLevelIndex + '_' + titleRate;

      successPopup = successPopupCreator.create(
        config.width / 2 - screenParams.offsetX,
        config.height / 2 - screenParams.offsetY,
        l10n.get(titleKey), time, savedChildren, initialChildrenCount,
        this.returnToMenu,
        this.returnToLevels,
        this.restartLevel,
        this.nextLevel,
        this
      );
      state = states.success;
      numberOfFails = 0;

      audioManager.playSound('audioWin');
      audioManager.stopBuzz();
    },
    onFail: function(){
      numberOfFails++;
      if(numberOfFails >= config.failsToStartQuiz){
        quizPopup = quizPopupCreator.create(
          config.width / 2 - screenParams.offsetX,
          config.height / 2 - screenParams.offsetY,
          function(){ this.restartLevel(true, true); }.bind(this),
          function(){ this.restartLevel(false, true); }.bind(this),
          this
        );
      }else{
        gameoverPopup = gameoverPopupCreator.create(
          config.width / 2 - screenParams.offsetX,
          config.height / 2 - screenParams.offsetY,
          time, savedChildren, initialChildrenCount,
          this.returnToMenu,
          this.returnToLevels,
          this.restartLevel,
          this
        );
      }
      state = states.gameover;

      audioManager.playSound('audioLose');
      audioManager.stopBuzz();
    },
    onPauseClicked: function(){
      audioManager.playSound();
      if(state === states.normal){
        game.paused = true;
        state = states.paused;
        if(pauseButton){
          pauseButton.input.enabled = false;
          pauseButton.setFrames(1, 1, 1);
        }
        pausePopup = pausePopupCreator.create(config.width / 2 - screenParams.offsetX, config.height / 2 - screenParams.offsetY);
      }

    },
    onBackClicked: function(){
      if(state === states.normal){
        state = states.paused;

        confirmPopup = confirmPopupCreator.create(
          config.width / 2 - screenParams.offsetX,
          config.height / 2 - screenParams.offsetY,
          l10n.get('CONFIRM_TO_LEVELS'),
          this.returnToLevels,
          this.closeConfrim,
          this
        );
      }

      audioManager.playSound();
    },
    closeConfrim: function(){
      if(confirmPopup){
        confirmPopup.destroy();
        confirmPopup = void 0;
        audioManager.playSound();
      }
      state = states.normal;
    },
    onContinueClicked: function(){
      if(state === states.paused && pausePopup){
        game.paused = false;
        state = states.normal;
        if(pauseButton){
          pauseButton.input.enabled = true;
          pauseButton.setFrames(0, 0, 0);
        }
        if(pausePopup) pausePopup.destroy();
      }

      audioManager.playSound();
    },
    updateTime: function(){
      if(state === states.normal){
        time++;
        timerText.text = utils.formatTime(time);
      }
    },
    createBonuses: function(){
      if(bonuses.length === 0){
        var tile = bonusPlaces[Math.floor(Math.random() * bonusPlaces.length)];
        var worldPosition = map.getTileWorldXY(tile);
        var spriteOptions = tileSprites[config.map.objects.bonus[0]];
        var instance = new Bonus();

        instance.create(worldPosition.x, worldPosition.y, map, spriteOptions, this.onBonusClicked, this);
        bonuses.push(instance);
        middleLayer.add(instance.sprite);
      }
    },
    onBonusClicked: function(){
      if(trapsActive && state === states.normal){
        this.deactivateTraps();

        game.time.events.add(Phaser.Timer.SECOND * config.bonusActiveTime, this.activateTraps, this);
        bonuses.forEach(function(b){
          this.destroyFromLayer(middleLayer, b.sprite);
          b.destroy();
        }.bind(this));
        bonuses = [];
        audioManager.playSound('audioBonus');
        audioManager.stopBuzz();
      }
    },
    deactivateTraps: function(){
      trapsActive = false;
      map.getTilesInLayer(config.map.main.name, config.map.main.danger.concat(config.map.main.groundDanger)).forEach(function(tile, index){
        var worldPosition = map.getTileWorldXY(tile);
        var w = map.get().tileWidth;
        var h = map.get().tileHeight;
        var offset = map.get().tileHeight / 6;
        var markWrapper = game.add.sprite(worldPosition.x + w/2, worldPosition.y + h/2 + offset);
        var mark = game.add.sprite(0, 5 - offset, 'bonus');
        markWrapper.addChild(mark);
        mark.scale.x = config.bonusMarkScale;
        mark.scale.y = config.bonusMarkScale;
        mark.anchor.set(0.5);
        game.add.tween(mark).to( { y: - 5 - offset}, 1400, "Linear", true, 0, -1, true);
        bonusesMarks.push(markWrapper);
        middleLayer.add(markWrapper);
      });
      sparksEffects.forEach(function(s){
        this.destroyFromLayer(middleLayer, s);
        s.destroy();
      }.bind(this));
      sparksEffects = [];
    },
    activateTraps: function(){
      trapsActive = true;
      game.time.events.add(Phaser.Timer.SECOND * bonusDelay, this.createBonuses, this);

      bonusesMarks.forEach(function(m){
        this.destroyFromLayer(middleLayer, m);
        m.destroy()
      }.bind(this));
      bonusesMarks = [];

      traps.forEach(function(trap){
        var options = UI.game.sparks.simple;
        var basicFrames = [0,1,2,3,4,5,6,7,8,9,10,10,10];
        for(var i = 0; i < Math.floor(Math.random() * options.emptyFramesRange); i++){
          basicFrames.push(10);
        };
        var x = trap.getCollider().x + map.get().tileWidth / 2;
        var y = trap.getCollider().y + map.get().tileHeight / 2
        var offset = map.get().tileHeight / 6;
        var roffset = Math.floor(Math.random() * options.yRange / 2);
        var sparksWrapper = game.add.sprite(x, y + offset);
        var sparks = game.add.sprite(0, -options.yRange / 2 - offset, 'sparks');
        sparksWrapper.addChild(sparks);
        sparks.animations.add('idle', basicFrames, 16, true);
        sparks.animations.play('idle');
        sparks.alpha = 0.9;
        sparks.anchor.set(0.5);
        game.add.tween(sparks).to({y: options.yRange / 2 - offset}, options.duration + Math.floor(Math.random() * options.duration), "Linear", true, 0, -1, options.yoyo);
        sparksEffects.push(sparksWrapper);
        middleLayer.add(sparksWrapper);
      });

      this.buzzSound();
    },
    update: function(){
      if(state === states.normal){
        var _this = this;
        children.forEach(function(child){
          traps.forEach(function(trap){
            game.physics.arcade.collide(child.getCollider(), trap.getCollider(), _this.trapCollision, null, _this);
          });

          escapes.forEach(function(esc){
            game.physics.arcade.collide(child.getCollider(), esc.getCollider(), _this.escapeCollision, null, _this);
          });

          if(hero){
            game.physics.arcade.collide(child.getCollider(), hero.getCollider(), _this.heroCollision, null, _this);
          }
          child.update();
        });

        if(initialChildrenCount !== 0 && initialChildrenCount === savedChildren){
          this.onSuccess();
        }

        middleLayer.sort('y', Phaser.Group.SORT_ASCENDING);

        if (game.input.keyboard.isDown(Phaser.Keyboard.ESC)){
          this.onBackClicked();
        }
      }
    },
    returnToLevels: function(){
      this.destroyHero();
      game.state.start('levels', true, false, void 0);

      audioManager.playSound();
      audioManager.stopBuzz();
    },
    returnToMenu: function(){
      this.destroyHero();
      game.state.start('start', true, false);

      audioManager.playSound();
      audioManager.stopBuzz();
    },
    nextLevel: function(){
      this.destroyHero();
      var nextBlockIndex = currentLevelIndex + 1 >= levelsConfig[currentBlockIndex].length ? currentBlockIndex + 1 : currentBlockIndex;
      nextBlockIndex = nextBlockIndex >= levelsConfig.length ? 0 : nextBlockIndex;
      var nextLevelIndex = currentLevelIndex + 1 >= levelsConfig[nextBlockIndex].length || nextBlockIndex !== currentBlockIndex ? 0 : currentLevelIndex + 1;

      game.state.restart(true, false, nextBlockIndex, nextLevelIndex);

      audioManager.playSound();
      audioManager.stopBuzz();
    },
    restartLevel: function(isSlowMode, quite){
      this.destroyHero();
      game.state.restart(true, false, currentBlockIndex, currentLevelIndex, isSlowMode === true);

      if(!quite) audioManager.playSound();
      audioManager.stopBuzz();
    },
    escapeCollision: function(child, esc){
      this.removeChild(child, function(){ savedChildren++; this.updateStatusText() }.bind(this));
      audioManager.playSound('audioTarget');
    },
    updateStatusText: function(){
      if(statusText){
        statusText.text = savedChildren + "/" + initialChildrenCount;
      }
    },
    trapCollision: function(child, trap){
      var index = children.map(function(c){ return c.getCollider() }).indexOf(child);
      var _this = this;
      if(index !== -1){
        children[index].onTrap();
      }
      state = states.gameover;
      setTimeout(this.onFail.bind(this), config.failDelay);
      audioManager.playSound(config.audio.sparks[Math.floor(Math.random() * config.audio.sparks.length)]);
    },
    heroCollision: function(child, hero){
      var index = children.map(function(c){ return c.getCollider() }).indexOf(child);
      if(index !== -1){
        children[index].onHero();
        audioManager.playSound('audioClash');
      }
    },
    removeChild: function(child, onRemove){
      var index = children.map(function(c){ return c.getCollider() }).indexOf(child);
      if(index !== -1){
        this.destroyFromLayer(middleLayer, child);
        children[index].destroy();
        children.splice(index, 1);
        if(typeof onRemove === 'function'){
          onRemove(child);
        }
      }
    },
    destroyFromLayer: function(layer, object){
      layer.remove(layer.getChildIndex(object));
    },
    destroyHero: function(){
      if(typeof hero !== 'undefined'){
        this.destroyFromLayer(middleLayer, hero.getCollider());
        hero.destroy();
        hero = void 0;
      }
    },
    isTileOccupied: function(tile){
      if(!trapsActive && config.map.main.danger.concat(config.map.main.groundDanger).indexOf(tile.index) !== -1){
        return true;
      }

      if(hero){
        var heroTile = map.getTileAt(hero.getCollider().x, hero.getCollider().y);
        return tile === heroTile;
      }

      return false;
    },
    onPointerDown: function(pointer){
      if(state === states.paused){
        this.onContinueClicked();
      }else if(state === states.normal){
        var ceiled = map.ceilPosition(pointer.x - screenParams.offsetX, pointer.y - screenParams.offsetY);
        if(bonuses.map(function(b){ return map.ceilPosition(b.sprite.x, b.sprite.y) }).filter(function(b){ return ceiled.x === b.x && ceiled.y === b.y }).length === 0){
          this.destroyHero();

          var tileBehind = map.getTileAt(ceiled.x, ceiled.y);
          if(tileBehind &&
            config.map.main.walls.indexOf(tileBehind.index) === -1 &&
            traps.map(function(t){ return map.ceilPosition(t.getCollider().x, t.getCollider().y) }).filter(function(p){ return ceiled.x === p.x && ceiled.y === p.y }).length === 0 // no traps on this tile
          ){
            hero = new Hero();
            hero.create(ceiled.x, ceiled.y, map, tileSprites[config.map.objects.hero[0]], config.hero.bodyScale);
            var childOverlap = children.filter(function(child){ return child.isBodyOverlap(hero.getCollider())}).length > 0;
            middleLayer.add(hero.getCollider());
            if(childOverlap){
              this.destroyHero();
            }
          }
        }
      }
    },
    render: function(){
      if(config.debug){
        children.forEach(function(child){
          child.render();
        });
        if(hero){
          hero.render();
        }
      }
    }
  }
}
