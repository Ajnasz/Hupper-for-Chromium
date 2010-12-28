HUPJson = {
  decode: function(text) {
      // JSON = Components.classes["@mozilla.org/dom/json;1"].createInstance(Components.interfaces.nsIJSON);
      return JSON.parse(text);
  },
  encode: function(obj) {
    return JSON.stringify(obj);
    // return obj.toSource();
  }
}
