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
  5: tileSprite('ground05'),
  6: tileSprite('ground06'),
  7: tileSprite('houseA1', 0, -136, tileSprite('houseShadow', -81, -137)),
  8: tileSprite('houseA2', 0, -136),
  9: tileSprite('houseA3', 0, -136),
  13: tileSprite('houseB1', 0, -136, tileSprite('houseShadow', -81, -137)),
  14: tileSprite('houseB2', 0, -136),
  15: tileSprite('houseB3', 0, -136),
  19: tileSprite('wall01', 0, -60),
  20: tileSprite('wall02', 5, -45),
  21: tileSprite('wall03', 0, -35),
  10: tileSprite('wall04', -4, -144),
  16: tileSprite('wall05', 0, -143),
  11: tileSprite('wall06', -3, -148),
  17: tileSprite('wall07', 6, -40),
  22: tileSprite('wall08', 0, -45),
  25: tileSprite('danger01', 0, 15),
  26: tileSprite('danger02', 1, -40),
  27: tileSprite('danger03', 0, -50),
  28: tileSprite('danger04', 14, -60),
  29: tileSprite('danger05', -15, -50),
  30: tileSprite('danger06', 0, -18),
  36: tileSprite('danger07', 0, 3),
  31: tileSprite('boy', 0, -60),
  32: tileSprite('girl', 0, -55),
  33: tileSprite('hero', 0, -100),
  34: tileSprite('target', 12, 5),
  35: tileSprite('bonus')
}
