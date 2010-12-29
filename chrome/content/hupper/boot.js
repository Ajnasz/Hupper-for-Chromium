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
      // HUP document object
      HUP.w = ww;
      HUP.hp = new HP();
      // Logger
      HUP.L = new Hupper.Log();
      Hupper.styles();
      // Elementer
      var elementer = new Hupper.Elementer(ww);;
      HUP.El = elementer;
      HUP.Ev = new HUPEvents();

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
            default:
              output = 'text bundle is undefined: ' + n;
              break;
          }
          return output;
        },
        getFormattedString: function(n) {
          var output = '';
          switch(n) {
            case 'hideTaxonomy':
              output = 'hideTaxonomy';
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
    }
};
