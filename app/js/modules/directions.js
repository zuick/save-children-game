var difference = require('lodash.difference');

module.exports = {
  horizontal: ['left', 'right'],
  vertical: ['up', 'down'],
  getAll: function(){
    return this.vertical.concat(this.horizontal);
  },
  getOpposite: function(dir){
    if(this.isVertical(dir)){
      return difference(this.vertical, [dir])[0];
    }
    if(this.isHorizontal(dir)){
      return difference(this.horizontal, [dir])[0];
    }
    return this.horizontal[0];
  },
  getRandom: function(){
    return this.getRandomFrom(this.getAll());
  },
  getRandomFrom: function(directions){
    if(directions.length == 0) return '';
    return directions[parseInt(Math.random() * directions.length)];
  },
  isVertical: function(dir){
    return this.vertical.indexOf(dir) !== -1;
  },
  isHorizontal: function(dir){
    return this.horizontal.indexOf(dir) !== -1;
  },
  isPositive: function(dir){
    return this.vertical.indexOf(dir) > 0 || this.horizontal.indexOf(dir) > 0;
  }
}
