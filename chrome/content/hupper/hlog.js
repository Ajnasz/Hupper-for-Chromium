/**
 * @class Log
 * @namespace Hupper
 * @constructor
 * @module Hupper
 * @description Mozilla logging service, is a class to make the logging easier
 */
Hupper.Log = function() {};
Hupper.Log.prototype = {
  /**
   * Stores a log service
   */
  s: null,
  /**
   * Stores the loggable message
   */
  msg: null,
  /**
   * @param {String} arguments The arguments will be written to the error console
   */
  log: function() {
    this.msg = new String();
    for(var i = 0, al = arguments.length; i < al; i++) {
      this.msg += ', ' + arguments[i];
    }
    try {
      console.log('HUPPER: ' + this.msg.replace(/^, /, ''));
    }
    catch(e) {
      // alert(this.msg.join(', '));
      // alert(this.msg);
    };
  }
};

