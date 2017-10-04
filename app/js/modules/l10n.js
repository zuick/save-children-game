var format = require("../modules/stringFormat");
var config = require('../configs/config');
var languages = {
  ba: require('../configs/languages/ba'),
  ru: require('../configs/languages/ru')
}

module.exports = {
  get: function(key, params){
    if(languages[config.defaultLanguage]){
      if(languages[config.defaultLanguage][key]){
        return format(languages[config.defaultLanguage][key], params || {});
      }else{
        console.log("Can't find key:" + key);
      }
    }else{
      console.log("Can't find language: " + config.defaultLanguage);
    }
    return key;
  }
}
