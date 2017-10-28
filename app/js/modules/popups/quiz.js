var config = require('../../configs/config');
var UI = require('../../configs/ui');
var l10n = require('../l10n');
var utils = require('../utils');

module.exports = function(game, Phaser){
  var basic = require('../popups/basic')(game, Phaser);
  return {
    create: function(x, y, onAccept, onCancel, context){
      var options = UI.popups.quiz;
      var quizOptions = config.quiz[Math.floor(Math.random() * config.quiz.length)];
      var base = basic.create(x, y, options.opacity);
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
      shuffled.forEach(function(frame, index){
        var answer = basic.button(
          x - answerMinOffset + index * (options.answers.w + options.answers.padding) + options.answers.w / 2 - options.answers.padding / 2,
          y + options.answers.offsetY, 'quizAnswers',
          frame,
          function(){
            if(frame === quizOptions.correct){
              onAccept();
            }
          },
          context
        );
        answer.anchor.set(0.5);
        game.add.tween(answer).to(
          { y: y + options.answers.offsetY - options.answers.tweenY },
          options.answers.tweenDuration, "Linear",
          true,
          index * options.answers.tweenDuration / 2, -1, true
        );
        base.add(answer);
      }.bind(this));

      return base;
    }
  }
}
