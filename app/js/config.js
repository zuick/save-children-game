module.exports = {
  debug: false,
  width: 1920,
  height: 1080,
  map: {
    main: {
      name: "main",
      walls: [7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
      ground: [1,2,3,4,5,6]
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
    bodyScale: 0.5 // 1 - full tile, 0 - no body
  },
  hero: {
    bodyScale: 0.75 // 1 - full tile, 0 - no body
  },
  levels: [
    {
      src: 'assets/levels/test.json',
      childrenSpeed: 120
    }
  ]
}
