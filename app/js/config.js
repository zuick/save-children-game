module.exports = {
  width: 1920,
  height: 1080,
  map: {
    main: {
      name: "main",
      walls: [7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
      ground: [1,2,3,4,5,6]
    },
    children: {
      name: "children",
      children: [31, 32]
    },
    colliders: {
      name: "colliders",
      traps: [25,26,27,28,29,30],
      escapes: [33]
    }
  },
  levels: [
    {
      src: 'assets/levels/level-1.json',
      childrenSpeed: 40
    },
    {
      src: 'assets/levels/level-2.json',
      childrenSpeed: 40
    },
    {
      src: 'assets/levels/level-3.json',
      childrenSpeed: 50
    },
    {
      src: 'assets/levels/level-4.json',
      childrenSpeed: 60
    }
  ]
}
