function tileSprite(key, offsetX, offsetY){
  return {
    key: key,
    offsetX: offsetX || 0,
    offsetY: offsetY || 0
  }
}

module.exports = {
  1: tileSprite('ground01'),
  2: tileSprite('ground02'),
  7: tileSprite('houseA1', -84, -137),
  8: tileSprite('houseA2', 1, -137)
}
