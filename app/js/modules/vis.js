var stateKey, eventKey, keys = {
  hidden: "visibilitychange",
  webkitHidden: "webkitvisibilitychange",
  mozHidden: "mozvisibilitychange",
  msHidden: "msvisibilitychange"
};
for (stateKey in keys) {
  if (stateKey in document) {
    eventKey = keys[stateKey];
    break;
  }
}
module.exports = {
  state: function(){
    return !document[stateKey];
  },
  subsribe: function(c) {
    if (c) document.addEventListener(eventKey, c);
  },
  unsubscribe: function(c){
    if (c) document.addEventListener(eventKey, c);
  }
}
