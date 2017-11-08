module.exports = {
  debug: false,
  width: 1920,
  height: 1080,
  enableBorders: false,
  firstVisitTutorialShow: 4,
  defaultLanguage: 'ru',
  defaultBlockIndex: 0,
  defaultBonusDelay: 15,
  bonusActiveTime: 7,
  bonusDeactivateAnimationDuration: 0.2,
  bonusMarkScale: 0.9,
  failDelay: 800,
  failsToStartQuiz: 5,
  audio: {
    musicByDifficulty: {
      0: 'musicEasy',
      1: 'musicMedium',
      2: 'musicHard'
    },
    sparks: ['audioSpark1', 'audioSpark2', 'audioSpark3', 'audioSpark4'],
    buzz: ['audioBuzz1', 'audioBuzz2', 'audioBuzz3', 'audioBuzz4'],
    buzzInterval: 6,
    musicVolume: 1,
    sfxVolume: 1,
    buzzVolume: 0.3
  },
  map: {
    main: {
      name: "main",
      walls: [7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
      ground: [1,2,3,4,5,6],
      groundDanger: [25],
      danger: [26,27,28,29,30,36]
    },
    objects: {
      name: "objects",
      children: [31, 32],
      traps: [25,26,27,28,29,30],
      hero: [33],
      escapes: [34],
      bonus: [35]
    },
    defaultGroundByLevelType: {
      0: 1,
      1: 3,
      2: 5
    }
  },
  children: {
    bodyScale: 0.5, // 1 - full tile, 0 - no body
    defaultSpeed: 110,
    speedAccuracy: 10,
    slowModeSpeed: 70,
    overlapCheckingOvertaking: 12
  },
  hero: {
    bodyScale: 0.3 // 1 - full tile, 0 - no body
  },
  quiz: [
    {
      question: 0,
      answers: [0, 1, 2],
      correct: 2,
      key: 'QUIZ_TITLE_1'
    },
    {
      question: 1,
      answers: [3, 4, 5],
      correct: 5,
      key: 'QUIZ_TITLE_2'
    },
    {
      question: 2,
      answers: [6, 7, 8],
      correct: 8,
      key: 'QUIZ_TITLE_3'
    },
    {
      question: 3,
      answers: [9, 10, 11],
      correct: 10,
      key: 'QUIZ_TITLE_4'
    }
  ]
}
