module.exports = {
  debug: false,
  width: 1920,
  height: 1080,
  defaultLanguage: 'ba',
  defaultBlockIndex: 0,
  UI: {
    levels: {
      levelItem: { width: 150, height: 150 },
      levelItemsPadding: 20,
      blockWidthScale: 0.5,
      blockMarginTop: 120,
      blockArrowMarginLeft: 50,
      levelItemTextStyle: { font: "64px Arial", fill: "#fff", align: "center" },
      headerTextStyle: { font: "32px Arial", fill: "#fff", align: "center" },
      types: {
        0: 'levelItemCity',
        1: 'levelItemCountrySide',
        2: 'levelItemHouse'
      }
    },
    game: {
      timerMarginTop: 50,
      timerOffsetX: -50,
      pauseButtonMarginTop: 50,
      pauseButtonOffsetX: 50,
      timerTextStyle: { font: "48px Arial", fill: "#fff", align: "center" }
    }
  },
  map: {
    main: {
      name: "main",
      walls: [7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
      ground: [1,2,3,4,5,6],
      underground: [25],
      groundDanger: [25],
      danger: []
    },
    objects: {
      name: "objects",
      children: [31, 32],
      traps: [25,26,27,28,29,30],
      escapes: [34],
      hero: [33]
    }
  },
  children: {
    bodyScale: 0.5, // 1 - full tile, 0 - no body
    defaultSpeed: 120
  },
  hero: {
    bodyScale: 0.35 // 1 - full tile, 0 - no body
  }
}