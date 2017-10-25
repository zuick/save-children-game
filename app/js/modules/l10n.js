var format = require("../modules/stringFormat");
var config = require('../configs/config');
var languages = {
  ba: require('../configs/languages/ba'),
  ru: require('../configs/languages/ru')
};
var storage = require('../modules/storage');

module.exports = {
  get: function(key, params, language){
    var code = language || storage.getSettings().language;
    if(languages[code]){
      if(languages[code][key]){
        return format(languages[code][key], params || {});
      }else{
        console.log("Can't find key:" + key);
      }
    }else{
      console.log("Can't find language: " + code);
    }
    return key;
  }
}
