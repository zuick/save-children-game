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
  },
  shuffle: function(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
  },
  copyArray: function(a){
    var newArray = [];
    a.forEach(function(i){ newArray.push(i)});
    return newArray;
  }
}
