module.exports = {
  width: 586,
  height: 320,
  map: {
    main: {
      name: "main",
      walls: [3]
    },
    children: {
      name: "children",
      children: [4]
    },
    colliders: {
      name: "colliders",
      traps: [2],
      escapes: [5]
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
