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
  7: tileSprite('houseA1', -2, -137, tileSprite('houseShadow', -81, -137)),
  8: tileSprite('houseA2', 1, -137),
  31: tileSprite('boy', 0, -60),
  32: tileSprite('girl', 0, -55),
  33: tileSprite('hero', 0, -100),
  34: tileSprite('target', 12, 5)
}
