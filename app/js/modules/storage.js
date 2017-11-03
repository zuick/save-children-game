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

var defaultProgress = {};
var settingsKey = 'beskman_settings';
var progressKey = 'beskman_progress';
var wasVisitedKey = 'beskman_was_visited';
var listeners = [];

var tutorialShownCounter = 0;
var tutorialMode = false;

module.exports = {
  initTutorialMode: function(){
    if(localStorageAvailable){
      var wasVisited = localStorage.getItem(wasVisitedKey);
      if(!wasVisited){
        localStorage.setItem(wasVisitedKey, "true");
        tutorialMode = true;
      }else{
        tutorialMode = false;
      }
    }
  },

  setTutorialShown: function(){
    tutorialShownCounter++;
  },

  shouldShowTutorial: function(){
    return tutorialMode ? tutorialShownCounter < config.firstVisitTutorialShow : tutorialShownCounter < 1;
  },

  addListener: function(callback){
    listeners.push(callback);
  },

  getSettings: function(){
    if(localStorageAvailable){
      var settings = localStorage.getItem(settingsKey);
      if(settings){
        return JSON.parse(settings);
      }
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

    listeners.forEach(function(callback){
      if(typeof(callback) === 'function'){
        callback(oldValue);
      }
    })
  },

  getProgress: function(){
    if(localStorageAvailable){
      var progress = localStorage.getItem(progressKey);
      if(progress){
        return JSON.parse(progress);
      }
    }
    return defaultProgress;
  },

  setProgress: function(id, time){
    var oldValue = this.getProgress();
    oldValue[id] = time;
    if(localStorageAvailable){
      localStorage.setItem(progressKey, JSON.stringify(oldValue));
    }
  }
}
