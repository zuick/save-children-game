var config = require('../configs/config');
var levelsConfig = require('../configs/levels');
var l10n = require('../modules/l10n');

module.exports = function(game, Phaser){
  return {
    text: void 0,
    preload: function() {
      var splash = game.add.sprite(0, 0, 'splash');
      var loadingText = game.add.text( game.world.centerX, game.world.centerY + 300, l10n.get('LOADING'), { font: "32pt KZSupercell", fill: "#fff", align: "center" } ).anchor.setTo( 0.5, 0.5 );
      levelsConfig.forEach(function(levelsBlock, blockIndex){
        levelsBlock.forEach(function(level, index){
          game.load.tilemap('level' + blockIndex + '-' + index, level.src, null, Phaser.Tilemap.TILED_JSON);
        })
      });
      game.load.image('tilemap', 'assets/tilemap_big.png');
      game.load.image('target', 'assets/target.png');
      game.load.image('bonus', 'assets/bonus.png');

      game.load.spritesheet('boy', 'assets/characters/boy.png', 160, 185, 12);
      game.load.spritesheet('girl', 'assets/characters/girl.png', 160, 185, 12);
      game.load.spritesheet('hero', 'assets/characters/hero.png', 256, 256, 3);

      game.load.image('ground01', 'assets/ground/01.png');
      game.load.image('ground02', 'assets/ground/02.png');
      game.load.image('ground03', 'assets/ground/03.png');
      game.load.image('ground04', 'assets/ground/04.png');
      game.load.image('ground05', 'assets/ground/05.png');
      game.load.image('ground06', 'assets/ground/06.png');
      game.load.image('houseA1', 'assets/walls/A1.png');
      game.load.image('houseA2', 'assets/walls/A2.png');
      game.load.image('houseA3', 'assets/walls/A3.png');
      game.load.image('houseB1', 'assets/walls/B1.png');
      game.load.image('houseB2', 'assets/walls/B2.png');
      game.load.image('houseB3', 'assets/walls/B3.png');
      game.load.image('wall01', 'assets/walls/01.png');
      game.load.image('wall02', 'assets/walls/02.png');
      game.load.image('wall03', 'assets/walls/03.png');
      game.load.image('wall04', 'assets/walls/04.png');
      game.load.image('wall05', 'assets/walls/05.png');
      game.load.image('wall06', 'assets/walls/06.png');
      game.load.image('wall07', 'assets/walls/07.png');
      game.load.image('wall08', 'assets/walls/08.png');
      game.load.image('danger01', 'assets/danger/01.png');
      game.load.image('danger02', 'assets/danger/02.png');
      game.load.image('danger03', 'assets/danger/03.png');
      game.load.image('danger04', 'assets/danger/04.png');
      game.load.image('danger05', 'assets/danger/05.png');
      game.load.image('danger06', 'assets/danger/06.png');
      game.load.image('danger07', 'assets/danger/07.png');
      game.load.image('houseShadow', 'assets/walls/shadow.png');

      game.load.image('levelsBackground', 'assets/UI/bkg.jpg');
      game.load.image('popup', 'assets/UI/popup.png');
      game.load.image('popupSmall', 'assets/UI/popup_small.png');
      game.load.image('popupQuiz', 'assets/UI/popup_quiz.png');
      game.load.image('iconSuccess', 'assets/UI/icon_success.png');
      game.load.image('iconFail', 'assets/UI/icon_fail.png');
      game.load.image('levelStatus', 'assets/UI/level_stat.png');
      game.load.image('timer', 'assets/UI/timer.png');
      game.load.image('play', 'assets/UI/play.png');
      game.load.image('pixel', 'assets/UI/pixel.png');
      game.load.image('quizCorrect', 'assets/UI/quiz_correct.png');
      game.load.image('quizQuestionBackground', 'assets/UI/quiz_question_bkg.png');

      game.load.image('borderA1', 'assets/borders/A1.png');
      game.load.image('borderA2', 'assets/borders/A2.png');
      game.load.image('borderA3', 'assets/borders/A3.png');
      game.load.image('borderB1', 'assets/borders/B1.png');
      game.load.image('borderB2', 'assets/borders/B1.png');
      game.load.image('borderB3', 'assets/borders/B3.png');
      game.load.image('borderC1', 'assets/borders/C1.png');
      game.load.image('borderC2', 'assets/borders/C2.png');


      game.load.spritesheet('levelsItems', 'assets/UI/levels_items.png', 230, 260, 3);
      game.load.spritesheet('levelsBlockArrows', 'assets/UI/levels_navigation.png', 108, 112, 2);
      game.load.spritesheet('languageButton', 'assets/UI/language_button.png', 370, 100, 2);
      game.load.spritesheet('buttons', 'assets/UI/buttons.png', 80, 76, 9);
      game.load.spritesheet('buttonsLarge', 'assets/UI/buttons_large.png', 200, 80, 3);
      game.load.spritesheet('buttonsMenu', 'assets/UI/menu_buttons.png', 256, 256, 4);
      game.load.spritesheet('popupTitle', 'assets/UI/popup_title.png', 391, 72, 2);
      game.load.spritesheet('sparks', 'assets/danger/sparks.png', 220, 180, 11);
      game.load.spritesheet('quizMarkers', 'assets/UI/quiz_markers.png', 94, 102, 2);
      game.load.spritesheet('quizQuestions', 'assets/UI/quiz_questions.png', 500, 390, 4);
      game.load.spritesheet('quizAnswers', 'assets/UI/quiz_answers.png', 250, 251, 12);

      game.load.audio('musicEasy', 'assets/music/easy.mp3');
      game.load.audio('musicMedium', 'assets/music/medium.mp3');
      game.load.audio('musicHard', 'assets/music/hard.mp3');
      game.load.audio('musicMenu', 'assets/music/menu.mp3');

      game.load.audio('audioButton', 'assets/sfx/button.mp3');
      game.load.audio('audioWin', 'assets/sfx/win.mp3');
      game.load.audio('audioLose', 'assets/sfx/lose.mp3');
      game.load.audio('audioBonus', 'assets/sfx/bonus.mp3');
      game.load.audio('audioSpark1', 'assets/sfx/spark1.mp3');
      game.load.audio('audioSpark2', 'assets/sfx/spark2.mp3');
      game.load.audio('audioSpark3', 'assets/sfx/spark3.mp3');
      game.load.audio('audioSpark4', 'assets/sfx/spark4.mp3');
      game.load.audio('audioBuzz1', 'assets/sfx/buzz1.mp3');
      game.load.audio('audioBuzz2', 'assets/sfx/buzz2.mp3');
      game.load.audio('audioBuzz3', 'assets/sfx/buzz3.mp3');
      game.load.audio('audioBuzz4', 'assets/sfx/buzz4.mp3');
      game.load.audio('audioTarget', 'assets/sfx/target.mp3');
      game.load.audio('audioClash', 'assets/sfx/clash.mp3');
    },
    create: function(){
      game.state.start('start', true, false);
    }
  }
}
