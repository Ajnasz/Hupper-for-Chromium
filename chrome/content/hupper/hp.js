HP = function() {
  // this.M = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
  var prefs = {};
  var getPref = function(n, cb) {
    var callback = function(response) {
      prefs[response.pref.name] = response.pref.value;
      if (typeof cb === 'function') {
        cb(response);
      }
    };
    // here we do some caching
    if (typeof prefs[n] === 'undefined') {
      chrome.extension.sendRequest({pref: {name: n}}, callback);
    } else {
      callback({success: true, pref: {name: n, value: prefs[n]}});
    }
  };
  var setPref = function(n, v, cb) {
    var callback = function(response) {
      prefs[response.pref.name] = response.pref.value;
      if (typeof cb === 'function') {
        cb(response);
      }
    };
    chrome.extension.sendRequest({pref: {name: n, value: v}}, callback);
  };
  this.M = new function() {
    return {
      getBoolPref: function(n, cb) {
        getPref(n, cb);
        return;
        var output = localStorage[n];
        if (typeof output === 'undefined') {
          switch(n) {
            case 'extensions.hupper.filtertrolls':
            case "extensions.hupper.hidetrollanswers":
            case "extensions.hupper.filterhuppers":
            case "extensions.hupper.replacenewcommenttext":
            case "extensions.hupper.prevnextlinks":
            case "extensions.hupper.extracommentlinks":
            case "extensions.hupper.hilightforumlinesonhover":
            case "extensions.hupper.insertnewtexttonode":
            case "extensions.hupper.showqnavbox":
            case "extensions.hupper.fadeparentcomment":
            case "extensions.hupper.showinstatusbar":
            case "extensions.hupper.parseblocks":
            case "extensions.hupper.style_indent":
            case "extensions.hupper.style_accessibility":
              output = true;
              break;
            case "extensions.hupper.insertpermalink":
            case "extensions.hupper.hideads":
              output = false;
              break;
          }
        }
        return !!output;
      },
      getCharPref: function(n, cb) {
        getPref(n, cb);
        return;
        var output = localStorage[n];
        if (typeof output === 'undefined') {
          switch(n) {
            case 'extensions.hupper.blocks':
              output = '{}';
              break;
            case "extensions.hupper.trolls":
              output = '';
              break;
            case "extensions.hupper.trollfiltermethod":
              output = 'hilight';
              break;
            case "extensions.hupper.trollcolor":
              output = '#CFB2A7';
              break;
            case "extensions.hupper.huppers":
              output = '';
              break;
            case "extensions.hupper.huppercolor":
              output = '#B5D7BE';
              break;
            case "extensions.hupper.newcommenttext":
              output = '[new]';
              break;
            case "extensions.hupper.username":
              output = '';
              break;
            case "extensions.hupper.hidetaxonomy":
              output = '';
              break;
            case "extensions.hupper.blocks":
              output = '({})';
              break;
          }
        }
        return output + '';
      },
      getIntPref: function(n, cb) {
        getPref(n, cb);
        return;
        var output = localStorage[n];
        if (typeof output === 'undefined') {
          switch(n) {
            case 'extensions.hupper.style_wider_sidebar':
              output = 0;
              break;
            case 'extensions.hupper.style_min_fontsize':
              output = 0;
              break;
          }
        }
        console.log(output);
        return parseInt(output, 10);
      },
      setBoolPref: function(n, v, cb) {
        setPref(n, v, cb)
        return;
        localStorage[n] = !!v;
      },
      setCharPref: function(n, v, cb) {
        setPref(n, v, cb)
        return;
        localStorage[n] = '' + v;
      },
      setIntPref: function(n, v, cb) {
        setPref(n, v, cb)
        return;
        localStorage[n] = parseInt(v, 10);
      },
    }
  }()
  this.get.M = this.set.M = this.M;
};
HP.prototype = {
  M: null, // Manager
  get: {
    trolls: function(cb) {
      return this.M.getCharPref('extensions.hupper.trolls', cb);
    },
    /**
    * @return {Boolean}
    */
    filtertrolls: function(cb) {
      return this.M.getBoolPref('extensions.hupper.filtertrolls', cb);
    },
    trollcolor: function(cb) {
      return this.M.getCharPref('extensions.hupper.trollcolor', cb);
    },
    /**
    * @return hide, hilight
    */
    trollfiltermethod: function(cb) {
      // hide, hilight
      return this.M.getCharPref('extensions.hupper.trollfiltermethod', cb);
    },
    /**
    * @return {String}
    */
    huppers: function(cb) {
      return this.M.getCharPref('extensions.hupper.huppers', cb);
    },
    /**
     * @namespace HP.get
     * @return {Boolean}
     */
    filterhuppers: function(cb) {
      return this.M.getBoolPref('extensions.hupper.filterhuppers', cb);
    },
    huppercolor: function(cb) {
      return this.M.getCharPref('extensions.hupper.huppercolor', cb);
    },
    replacenewcommenttext: function(cb) {
      return this.M.getBoolPref('extensions.hupper.replacenewcommenttext', cb);
    },
    newcommenttext: function(cb) {
      return this.M.getCharPref('extensions.hupper.newcommenttext', cb);
    },
    extracommentlinks: function(cb) {
      return this.M.getBoolPref('extensions.hupper.extracommentlinks', cb);
    },
    hilightforumlinesonhover: function(cb) {
      return this.M.getBoolPref('extensions.hupper.hilightforumlinesonhover', cb);
    },
    insertpermalink: function(cb) {
      return this.M.getBoolPref('extensions.hupper.insertpermalink', cb);
    },
    insertnewtexttonode: function(cb) {
      return this.M.getBoolPref('extensions.hupper.insertnewtexttonode', cb);
    },
    fadeparentcomment: function(cb) {
      return this.M.getBoolPref('extensions.hupper.fadeparentcomment', cb);
    },
    showqnavbox: function(cb) {
      return this.M.getBoolPref('extensions.hupper.showqnavbox', cb);
    },
    hidetrollanswers: function(cb) {
      return this.M.getBoolPref('extensions.hupper.hidetrollanswers', cb);
    },
    hideads: function(cb) {
      return this.M.getBoolPref('extensions.hupper.hideads', cb);
    },
    highlightusers: function(cb) {
      return this.M.getCharPref('extensions.hupper.highlightusers', cb);
    },
    username: function(cb) {
      return this.M.getCharPref('extensions.hupper.username', cb);
    },
    hidetaxonomy: function(cb) {
      return this.M.getCharPref('extensions.hupper.hidetaxonomy', cb);
    },
    showinstatusbar: function(cb) {
      return this.M.getBoolPref('extensions.hupper.showinstatusbar', cb);
    },
    blocks: function(cb) {
      return this.M.getCharPref('extensions.hupper.blocks', cb);
    },
    /**
    * @type Boolean
    */
    prevnextlinks: function(cb) {
      return this.M.getBoolPref('extensions.hupper.prevnextlinks', cb);
    },
    parseblocks: function(cb) {
      return this.M.getBoolPref('extensions.hupper.parseblocks', cb);
    },
    styleIndent: function(cb) {
      return this.M.getBoolPref('extensions.hupper.style_indent', cb);
    },
    styleAccessibility: function(cb) {
      return this.M.getBoolPref('extensions.hupper.style_accessibility', cb);
    },
    styleWiderSidebar: function(cb) {
      return this.M.getIntPref('extensions.hupper.style_wider_sidebar', cb);
    },
    styleMinFontsize: function(cb) {
      return this.M.getIntPref('extensions.hupper.style_min_fontsize', cb);
    },
    trollCommentHeaderClass: function(cb) {
      return 'trollHeader'
    },
    trollCommentClass: function(cb) {
      return 'trollComment';
    },
    trollCommentAnswersClass: function(cb) {
      return 'trollCommentAnswer';
    },
  },
  set: {
    M: this.M,
    trolls: function(value, cb) {
      this.M.setCharPref('extensions.hupper.trolls', value, cb);
    },
    /**
     * @namespace HP.set
     * @return {Boolean}
     */
    filtertrolls: function(value, cb) {
      this.M.setBoolPref('extensions.hupper.filtertrolls', value, cb);
    },
    trollfiltermethod: function(value, cb) {
      // hide, hilig, cbht
      this.M.setCharPref('extensions.hupper.trollfiltermethod', value);
    },
    trollcolor: function(value, cb) {
      this.M.setCharPref('extensions.hupper.trollcolor', value, cb);
    },
    huppers: function(value, cb) {
      this.M.setCharPref('extensions.hupper.huppers', value, cb);
    },
    filterhuppers: function(value, cb) {
      this.M.setBoolPref('extensions.hupper.filterhuppers', value, cb);
    },
    huppercolor: function(value, cb) {
      this.M.setCharPref('extensions.hupper.huppercolor', value, cb);
    },
    replacenewcommenttext: function(value, cb) {
      this.M.setBoolPref('extensions.hupper.replacenewcommenttext', value, cb);
    },
    newcommenttext: function(value, cb) {
      this.M.setCharPref('extensions.hupper.newcommenttext', value, cb);
    },
    extracommentlinks: function(value, cb) {
      this.M.setBoolPref('extensions.hupper.extracommentlinks', value, cb);
    },
    hilightforumlinesonhover: function(value, cb) {
      this.M.setBoolPref('extensions.hupper.hilightforumlinesonhover', value, cb);
    },
    insertpermalink: function(value, cb) {
      this.M.setBoolPref('extensions.hupper.insertpermalink', value, cb);
    },
    insertnewtexttonode: function(value, cb) {
      this.M.setBoolPref('extensions.hupper.insertnewtexttonode', value, cb);
    },
    fadeparentcomment: function(value, cb) {
      this.M.setBoolPref('extensions.hupper.fadeparentcomment', value, cb);
    },
    showqnavbox: function(value, cb) {
      this.M.setBoolPref('extensions.hupper.showqnavbox', value, cb);
    },
    hidetrollanswers: function(value, cb) {
      this.M.setBoolPref('extensions.hupper.hidetrollanswers', value, cb);
    },
    hideads: function(value, cb) {
      this.M.setBoolPref('extensions.hupper.hideads', value, cb);
    },
    highlightusers: function(value, cb) {
      this.M.setCharPref('extensions.hupper.highlightusers', value, cb);
    },
    username: function(value, cb) {
      return this.M.setCharPref('extensions.hupper.username', value, cb);
    },
    hidetaxonomy: function(value, cb) {
      return this.M.setCharPref('extensions.hupper.hidetaxonomy', value, cb);
    },
    showinstatusbar: function(value, cb) {
      return this.M.setBoolPref('extensions.hupper.showinstatusbar', value, cb);
    },
    blocks: function(value, cb) {
      return this.M.setCharPref('extensions.hupper.blocks', value, cb);
    },
    parseblocks: function(value, cb) {
      return this.M.setBoolPref('extensions.hupper.parseblocks', value, cb);
    },
    styleIndent: function(value, cb) {
      return this.M.setBoolPref('extensions.hupper.style_indent', value, cb);
    },
    styleAccessibility: function(value, cb) {
      return this.M.setBoolPref('extensions.hupper.style_accessibility', value, cb);
    },
    styleWiderSidebar: function(value, cb) {
      return this.M.setIntPref('extensions.hupper.style_wider_sidebar', value, cb);
    },
    styleMinFontsize: function(value, cb) {
      return this.M.setIntPref('extensions.hupper.style_min_fontsize', value, cb);
    },
  }
};
