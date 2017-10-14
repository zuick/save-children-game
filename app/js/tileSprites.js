function tileSprite(key, offsetX, offsetY, shadow){
  return {
    key: key,
    offsetX: offsetX || 0,
    offsetY: offsetY || 0,
    shadow: shadow
  }
}

module.exports = {
  1: tileSprite('ground01'),
  2: tileSprite('ground02'),
  3: tileSprite('ground03'),
  4: tileSprite('ground04'),
  5: tileSprite('ground01'),
  6: tileSprite('ground02'),
  7: tileSprite('houseA1', 0, -136, tileSprite('houseShadow', -81, -137)),
  8: tileSprite('houseA2', 0, -136),
  9: tileSprite('houseA3', 0, -136),
  13: tileSprite('houseB1', 0, -136, tileSprite('houseShadow', -81, -137)),
  14: tileSprite('houseB2', 0, -136),
  15: tileSprite('houseB3', 0, -136),
  19: tileSprite('wall01', 0, -60),
  20: tileSprite('wall02', 0, -45),
  21: tileSprite('wall03', 0, -35),
  25: tileSprite('danger01', 0, 10, tileSprite('underground', 0, 5)),
  26: tileSprite('danger02', 1, -40),
  27: tileSprite('danger03', 1, -50),
  31: tileSprite('boy', 0, -60),
  32: tileSprite('girl', 0, -55),
  33: tileSprite('hero', 0, -100),
  34: tileSprite('target', 12, 5)
}
