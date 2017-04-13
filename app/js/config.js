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
      childrenSpeed: 20
    },
    {
      src: 'assets/levels/level-1.json',
      childrenSpeed: 100
    }
  ]
}
