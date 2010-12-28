Hupper.styles = function() {
  var addStyle = function(s) {
    var isUrl = /^chrome:\/\//.test(s);
    if(isUrl) {
      s = s.replace(/^chrome:\/\/hupper\/skin/, 'chrome/skin/classic/hupper');
    }
    chrome.extension.sendRequest({style: s, isUrl: isUrl}, function(response) {
      console.log('response: ', response);
    });
  };
  chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
      console.log('this is a request: ', request);
  });
  console.log('init styles');
      var stylesToLoad = [];

      HUP.hp.get.trollfiltermethod(function(response) {
        var styles = '';
        HUP.hp.get.trollCommentClass(function(response) {
          var trollCommentClass = response.pref.value;
          HUP.hp.get.hidetrollanswers(function(response) {
            var hidetrollanswers = response.pref.value;
            HUP.hp.get.trollCommentAnswersClass(function(response) {
              var trollCommentAnswersClass = response.pref.value;
              HUP.hp.get.trollCommentHeaderClass(function(response) {
                var trollCommentHeaderClass = response.pref.value;
                HUP.hp.get.trollcolor(function(response) {
                  var trollcolor = response.pref.value;

                  switch(response.pref.value) {
                    case 'hide':
                      styles += '.' + trollCommentClass + ' {display:none !important;}';
                      if(hidetrollanswers) {
                        styles += '.' + trollCommentAnswersClass + ' {display:none !important;}';
                      }
                      break;
                    case 'hilight':
                    default:
                      styles += '.' + trollCommentHeaderClass + ' {background-color:' + trollcolor + ' !important;}';
                      break;
                  };
                  HUP.hp.get.hilightforumlinesonhover(function(response) {
                    if(response.pref.value) {
                      styles += 'tr.odd:hover td, tr.even:hover td {background-color: #D8D8C4;}';
                    }
                    addStyle(styles);
                  });

                });
              });
            });
          });
        });
      });
      var indentStyle = 'chrome://hupper/skin/indentstyles.css',
          accesibilityStyle = 'chrome://hupper/skin/accesibilitystyles.css';
      var widthStyle = function(width) {
        return '' +
        '/* hupper width */' +
          '.sidebar {' +
            'width:' + width + 'px !important;' +
          '}';
      };
      var minFontsizeStyle = function(fontsize) {
        return '' +
          '/* min font size */' +
            'body,#all,#top-nav,#top-nav a,.sidebar .block .content,#footer,.node .links {' +
              'font-size:' + fontsize + 'px !important;' +
          '}';
      };


      //stylesToLoad.push(styles);
      HUP.hp.get.styleIndent(function(response) {
        if (response.pref.value) {
          addStyle(indentStyle);
        }
      });
      HUP.hp.get.styleAccessibility(function(response) {
        if (response.pref.value) {
          addStyle(accesibilityStyle);
        }
      });
      HUP.hp.get.styleWiderSidebar(function(response) {
        var width = response.pref.value;
        if(width > 0) {
          addStyle(widthStyle(width));
        }
      });
      HUP.hp.get.styleMinFontsize(function(response) {
        var minFontsize = response.pref.value;
        if (minFontsize > 0) {
          addStyle(minFontsizeStyle(minFontsize));
        }
      });
      addStyle("chrome://hupper/skin/hupper.css");
      console.log('init styles finished');
};
