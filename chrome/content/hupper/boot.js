/**
 * Initialization function, runs when the page is loaded
 * @param {Event} e window load event object
 */
Hupper.boot = function(e) {
    var ww = document;
    var logger = new Hupper.Log();
    // logger.log(ww.location.hostname);
    if(ww && ww.location && typeof ww.location.hostname == 'string'
        && (ww.location.hostname == 'hup.hu' || ww.location.hostname == 'www.hup.hu' ||
        /http:\/\/(localhost\/hupper\/hg|hupper|hupperl)\/.+\.html/.test(ww.location.href))) {
      /**
      * A unique global object to store all global objects/array/... of the Hupper Extension
      */
      HUP = {};
      Hupper.HUP = HUP;
      // HUP document object
      HUP.w = ww;
      HUP.hp = new HP();
      // Logger
      HUP.L = new Hupper.Log();
      Hupper.styles();
      // Elementer
      var elementer = new Hupper.Elementer(ww);;
      HUP.El = elementer;
      HUP.Ev = new Hupper.Events(HUP.w);

      HUP.Bundles = {
        getString: function(n) {
          var output = '';
          switch(n) {
            case 'FirstLinkText':
              output = 'first';
              break;
            case 'LastLinkText':
              output = 'last';
              break;
            case 'PrevLinkText':
              output = 'previous';
              break;
            case 'NextLinkText':
              output = 'next';
              break;
            case 'TopLinkText':
              output = 'top';
              break;
            case 'BackLinkText':
              output = 'back';
              break;
            case 'ParentLinkText':
              output = 'parent comment';
              break;
            case 'markingText':
              output = 'mark as read';
              break;
            case 'markAllRead':
              output = 'mark all as read';
              break;
            case 'firstNew':
              output = 'first new message';
              break;
            case 'restoreBlocks':
              output = 'restore hidden blocks';
              break;
            case 'markingSuccess':
              output = 'done';
              break;
            case 'markingError':
              output = 'error';
              break;
            case 'markingProgress':
              output = 'marking...';
              break;
            case 'restoreNodes':
              output = 'Restore hidden articles';
              break;
            default:
              output = 'text bundle is undefined: ' + n;
              break;
          }
          return output;
        },
        getFormattedString: function(n) {
          var output = '',
              args = Array.prototype.slice.call(arguments, 1);
          switch(n) {
            case 'hideTaxonomy':
              output = 'hide artilces in the ' + args[0] + ' category';
              break;
            case 'pointSum':
              output = args[0] + ' points';
              break;
            default:
              output = 'formatted bundle string is undefined: ' + n;
          }
          return output;
        }
      };
      // Lang stuffs
      // HUP.Bundles = document.getElementById('hupper-bundles');
      // Hupper.addHupStyles();
      var hupMenu = new Hupper.Menu();
      HUP.BlockMenus = new Hupper.BlockMenus(hupMenu);
      // Stores the mark as read nodes
      HUP.markReadNodes = [];
      HUP.w.nextLinks = [];
      // if comments are available
      if(HUP.El.GetId('comments')) {
        var c = new Hupper.GetComments();
        var newComments = c.newComments;
        HUP.hp.get.showqnavbox(function(response) {
          if(c.newComments.length && response.pref.value) {
            Hupper.appendNewNotifier(null, null, hupMenu);
          }
        });
      } else {
        HUP.hp.get.insertnewtexttonode(function(response) {
          if(response.pref.value) {
            var nodes = Hupper.getNodes();
            Hupper.parseNodes(nodes[0], nodes[1], new Hupper.NodeMenus(hupMenu));
            HUP.hp.get.showqnavbox(function(response) {
              if(nodes[1].length > 0 && response.pref.value) {
                Hupper.appendNewNotifier('#node-' + nodes[1][0].id, true, hupMenu);
              }
            });
          }
        });
      }
      Hupper.setBlocks();


      var getUserElement = function (userUrl) {
          var url = userUrl.replace(/^https?:\/\/[^/]+/, '');

          return document.querySelector('a[title="Felhasználói profil megtekintése."][href="' + url + '"]');
      };

      var markAsTroll = function (element) {
          if (element) {
              var user = element.innerHTML;
              trollHandler.addTroll(user, function () {
                  if (c) {
                      c.comments.forEach(function (comment) {
                          if (comment.user === user) {
                              comment.setTroll();
                          }
                      });
                  }
              });
          }
      };
      var unmarkTroll = function (element) {
          if (element) {
              var user = element.innerHTML;
              trollHandler.removeTroll(user, function () {
                  if (c) {
                      c.comments.forEach(function (comment) {
                          if (comment.user === user) {
                              comment.unsetTroll();
                          }
                      });
                  }
              });
          }
      };

      var highlightUser = function (element) {
          if (element) {
              var user = element.innerHTML;
              HUP.hp.get.huppercolor(function (response) {
                  var color = response.pref.value || '#B5D7BE';
                  trollHandler.highlightUser(user, color, function () {
                      if (c) {
                          c.comments.forEach(function (comment) {
                              if (comment.user === user) {
                                  comment.highLightComment(color);
                              }
                          });
                      }
                  });
              });
          }
      };

      var unhighlightUser = function (element) {
          if (element) {
              var user = element.innerHTML;
              trollHandler.unhighlightUser(user, function () {
                  if (c) {
                      c.comments.forEach(function (comment) {
                          if (comment.user === user) {
                              comment.unhighLightComment();
                          }
                      });
                  }
              });
          }
      };

      chrome.extension.onRequest.addListener(function (r) {
          var element = getUserElement(r.ev.linkUrl);
          switch (r.type) {
              case 'troll':
                  markAsTroll(element);
                  break;
              case 'untroll':
                  unmarkTroll(element);
                  break;
              case 'highlight':
                  highlightUser(element);
                  break;
              case 'unhighlight':
                  unhighlightUser(element);
                  break;
          }
      });
      HUP.hp.get.setunlimitedlinks(function (response) {
          if (response.pref.value) {
              var linkParams = [
                  '/cikkek',
                  '/node',
                  '/promo',
                  '/szavazasok'
              ], callStr = [];
              linkParams.forEach(function (link) {
                  callStr.push('a[href^="' + link + '"]');
                  callStr.push('a[href^="' + link + '"]');
                  callStr.push('a[href^="' + link + '"]');
                  callStr.push('a[href^=" ' + link + '"]');
                  callStr.push('a[href^=" ' + link + '"]');
                  callStr.push('a[href^=" ' + link + '"]');
                  callStr.push('a[href^="http://hup.hu' + link + '"]');
                  callStr.push('a[href^="http://hup.hu' + link + '"]');
                  callStr.push('a[href^="http://hup.hu' + link + '"]');
                  callStr.push('a[href^=" http://hup.hu' + link + '"]');
                  callStr.push('a[href^=" http://hup.hu' + link + '"]');
                  callStr.push('a[href^=" http://hup.hu' + link + '"]');
                  callStr.push('a[href^="http://www.hup.hu' + link + '"]');
                  callStr.push('a[href^="http://www.hup.hu' + link + '"]');
                  callStr.push('a[href^="http://www.hup.hu' + link + '"]');
                  callStr.push('a[href^=" http://www.hup.hu' + link + '"]');
                  callStr.push('a[href^=" http://www.hup.hu' + link + '"]');
                  callStr.push('a[href^=" http://www.hup.hu' + link + '"]');
              });
              Array.prototype.slice
                  .call(HUP.w.querySelectorAll(callStr.join(','))).forEach(function (elem) {
                      if (elem.search.length > 1) {
                          elem.search += '&comments_per_page=9999';
                      } else {
                          elem.search = '?comments_per_page=9999';
                      }
              });
          }
      });
    }
};
