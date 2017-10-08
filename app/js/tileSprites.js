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
  7: tileSprite('houseA1', 0, -136, tileSprite('houseShadow', -81, -137)),
  8: tileSprite('houseA2', 0, -136),
  9: tileSprite('houseA3', 0, -136),
  19: tileSprite('bush'),
  25: tileSprite('danger1', 0, 10, tileSprite('underground', 0, 5)),
  31: tileSprite('boy', 0, -60),
  32: tileSprite('girl', 0, -55),
  33: tileSprite('hero', 0, -100),
  34: tileSprite('target', 12, 5)
}
