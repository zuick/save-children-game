var config = require('../configs/config');

function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
    }
}

var localStorageAvailable = storageAvailable('localStorage');

var defaultProgress = [];
var settingsKey = 'beskman_settings';

module.exports = {
  getSettings: function(){
    var settings = localStorage.getItem(settingsKey);
    if(localStorageAvailable && settings){
      return JSON.parse(settings);
    }
    return {
      language: config.defaultLanguage,
      audio: true
    };
  },

  setSettings: function(key, value){
    var oldValue = this.getSettings();
    if(oldValue.hasOwnProperty(key)){
      oldValue[key] = value;
      if(localStorageAvailable){
        localStorage.setItem(settingsKey, JSON.stringify(oldValue));
      }
    }
  }
}
