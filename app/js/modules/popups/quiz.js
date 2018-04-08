var config = require('../../configs/config');
var UI = require('../../configs/ui');
var l10n = require('../l10n');
var utils = require('../utils');

module.exports = function(game, Phaser){
  var basic = require('../popups/basic')(game, Phaser);
  var audioManager = require('../../modules/audio').manager();
  return {
    create: function(x, y, onAccept, onCancel, context){
      var options = UI.popups.quiz;
      var quizOptions = config.quiz[Math.floor(Math.random() * config.quiz.length)];
      var base = basic.create(x, y, options.opacity, void 0, options.mobileScale);
      var win = basic.tint(x, y, options.width, options.height, 1, 0xc24729, 'popupQuiz');
      win.scale.set(options.scale);

      var question = game.add.sprite(x, y + options.question.offsetY, 'quizQuestions');
      question.anchor.set(0.5);
      question.frame = quizOptions.question;

      var questionTextBackground = game.add.sprite(x, y + options.question.text.offsetY, 'quizQuestionBackground');
      questionTextBackground.anchor.set(0.5);

      var questionText = game.add.text(x, y + options.question.text.offsetY, l10n.get(quizOptions.key), options.question.text.style);
      questionText.anchor.set(0.5);


      base.add(win);
      base.add(question);
      base.add(questionTextBackground);
      base.add(questionText);

      var answerMinOffset = (options.answers.w * quizOptions.answers.length + options.answers.padding * (quizOptions.answers.length - 1)) / 2;
      var shuffled = utils.shuffle(utils.copyArray(quizOptions.answers));
      var buttons = [];

      shuffled.forEach(function(frame, index){
        var isCorrect = frame === quizOptions.correct;
        var buttonX = x - answerMinOffset + index * (options.answers.w + options.answers.padding) + options.answers.w / 2 - options.answers.padding / 2;
        var buttonY = y + options.answers.offsetY;

        var answer = basic.button( buttonX, buttonY, 'quizAnswers', frame );
        answer.anchor.set(0.5);

        var answerBorder;
        if(isCorrect){
          answerBorder = game.add.sprite( buttonX, buttonY, 'quizCorrect' );
          answerBorder.anchor.set(0.5);
          answerBorder.alpha = 0;
        }

        var icon = game.add.sprite( buttonX + options.answers.iconOffsetX , buttonY + options.answers.iconOffsetY, 'quizMarkers' );
        icon.anchor.set(0.5);
        icon.alpha = 0;
        icon.frame = isCorrect ? 0 : 1;

        var waveTween = game.add.tween(answer).to(
          { y: y + options.answers.offsetY - options.answers.tweenY },
          options.answers.tweenDuration, "Linear",
          true,
          index * options.answers.waveTweenDuration / 2, -1, true
        );

        var clicked = false;
        answer.onInputDown.add(function(){
          if(clicked) return;
          clicked = true;
          audioManager.playSound(isCorrect ? 'audioWin' : 'audioLose');
          buttons.forEach(function(btn){
            btn.waveTween.pause();
            var normalPositionTween = game.add.tween(btn.button).to({ y: buttonY }, options.answers.waveTweenDuration / 3, "Linear", true );
            normalPositionTween.onComplete.add(function(){
              if(btn.isCorrect){
                var zoomTween = game.add.tween(btn.button.scale).to(
                  { x: options.answers.scaleCorrectTween, y: options.answers.scaleCorrectTween },
                  options.answers.scaleTweenDuration, Phaser.Easing.Exponential.Out,
                  true
                );
                var borderZoomTween = game.add.tween(btn.border.scale).to(
                  { x: options.answers.scaleCorrectTween, y: options.answers.scaleCorrectTween },
                  options.answers.scaleTweenDuration, Phaser.Easing.Exponential.Out,
                  true
                );
                var borderAlphaTween = game.add.tween(btn.border).to(
                  { alpha: 1 },
                  options.answers.scaleTweenDuration, Phaser.Easing.Exponential.Out,
                  true
                );
              }else{
                var zoomTween = game.add.tween(btn.button.scale).to(
                  { x: options.answers.scaleIncorrectTween, y: options.answers.scaleIncorrectTween },
                  options.answers.scaleTweenDuration, Phaser.Easing.Exponential.Out,
                  true
                );
              }
              var iconAlphaTween = game.add.tween(btn.icon).to(
                { alpha: 1 },
                options.answers.iconAlphaTweenDuration, Phaser.Easing.Exponential.Out,
                true, options.answers.iconAlphaTweenDelay
              );
            });
          });
          setTimeout(isCorrect ? onAccept.bind(context) : onCancel.bind(context), options.answers.closeDelay);
        }, context);

        base.add(answer);
        if(answerBorder){
          base.add(answerBorder);
        }
        buttons.push({ isCorrect: isCorrect, button: answer, border: answerBorder, waveTween: waveTween, icon: icon });
      }.bind(this));

      return base;
    }
  }
}
