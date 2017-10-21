var levelsConfig = require('../configs/levels');

module.exports = {
  formatTime: function(timeInSeconds){
    var minutes = (Math.floor(timeInSeconds / 60)).toString();
    var seconds = (timeInSeconds % 60).toString();
    if(minutes.length == 1) minutes = '0' + minutes;
    if(seconds.length == 1) seconds = '0' + seconds;
    return minutes + ":" + seconds;
  },
  levelNumber: function(block, level){
    return levelsConfig.slice(0, block).reduce(function(acc, curr){ return acc + curr.length; }, 0) + level + 1;
  }
}
