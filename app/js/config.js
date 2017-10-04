module.exports = {
  debug: false,
  width: 1920,
  height: 1080,
  defaultBlockIndex: 0,
  UI: {
    levels: {
      levelItem: { width: 150, height: 150 },
      levelItemsPadding: 20,
      blockWidthScale: 0.5,
      blockMarginTop: 120,
      blockArrowMarginLeft: 50,
      types: {
        0: 'levelItemCity',
        1: 'levelItemCountrySide',
        2: 'levelItemHouse'
      }
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
  },
  levels: [
    [
      {
        src: 'assets/levels/Level_1.json',
        type: 0
      },
      {
        src: 'assets/levels/Level_2.json',
        type: 0
      },
      {
        src: 'assets/levels/test.json',
        type: 1
      },
      {
        src: 'assets/levels/test.json',
        type: 1
      },
      {
        src: 'assets/levels/test.json',
        type: 1
      },
      {
        src: 'assets/levels/test.json',
        type: 2
      },
      {
        src: 'assets/levels/test.json',
        type: 2
      },
      {
        src: 'assets/levels/test.json',
        type: 2
      },
      {
        src: 'assets/levels/test.json',
        type: 2
      },
      {
        src: 'assets/levels/test.json',
        type: 2
      }
    ],
    [
      {
        src: 'assets/levels/Level_1.json',
        type: 2
      },
      {
        src: 'assets/levels/Level_2.json',
        type: 0
      },
      {
        src: 'assets/levels/test.json',
        type: 2
      },
      {
        src: 'assets/levels/test.json',
        type: 0
      },
      {
        src: 'assets/levels/test.json',
        type: 2
      },
      {
        src: 'assets/levels/test.json',
        type: 0
      },
      {
        src: 'assets/levels/test.json',
        type: 2
      },
      {
        src: 'assets/levels/test.json',
        type: 0
      },
      {
        src: 'assets/levels/test.json',
        type: 2
      },
      {
        src: 'assets/levels/test.json',
        type: 0
      }
    ],
    [
      {
        src: 'assets/levels/Level_1.json',
        type: 1
      },
      {
        src: 'assets/levels/Level_2.json',
        type: 0
      },
      {
        src: 'assets/levels/test.json',
        type: 1
      },
      {
        src: 'assets/levels/test.json',
        type: 0
      },
      {
        src: 'assets/levels/test.json',
        type: 1
      },
      {
        src: 'assets/levels/test.json',
        type: 0
      },
      {
        src: 'assets/levels/test.json',
        type: 1
      },
      {
        src: 'assets/levels/test.json',
        type: 0
      },
      {
        src: 'assets/levels/test.json',
        type: 1
      },
      {
        src: 'assets/levels/test.json',
        type: 0
      }
    ]
  ]
}
