var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"];
var HupStyle = function(uri) {
  this.uri = uri;
  this.updateState();
};
HupStyle.prototype = {
  getFromDb: function() {
    // db.getStyle(this.uri, callback)
  },
  addToDb: function() {
    // db.addStyle(this.uri, false)
  },
  updateState: function() {
    // (this.isLoaded()) ? db.activateStyle() : db.deactivate())
  },
  isLoaded: function() {
    return sss.sheetRegistered(this.uri, sss.AGENT_SHEET);
  },
  load: function() {
    if(!this.isLoaded()) {
        sss.loadAndRegisterSheet(this.uri, sss.AGENT_SHEET);
        this.updateState();
    }
  },
  unLoad: function() {
    if(this.isLoaded()) {
        sss.unregisterSheet(this.uri, sss.AGENT_SHEET);
        this.updateState();
    }
  },
};

let EXPORTED_SYMBOLS = ['HupStyle'];
