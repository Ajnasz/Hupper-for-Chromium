/*global Hupper: true, HUP: true, StyleLoader: true, chrome: true*/
Hupper.styles = function () {
    var addStyle, indentStyle,
    accesibilityStyle, widthStyle, minFontsizeStyle, styleLoader;
    addStyle = function (s) {
        var isUrl = /^chrome:\/\//.test(s);
        if (isUrl) {
            s = s.replace(/^chrome:\/\/hupper\/skin/, 'chrome/skin/classic/hupper');
        }
        chrome.extension.sendRequest({style: s, isUrl: isUrl});
    };
    HUP.hp.get.trollfiltermethod(function (response) {
        var styles = '',
            trollfiltermethod = response.pref.value;

        HUP.hp.get.trollCommentClass(function (response) {
            var trollCommentClass = response.pref.value;

            HUP.hp.get.hidetrollanswers(function (response) {
                var hidetrollanswers = response.pref.value;

                HUP.hp.get.trollCommentAnswersClass(function (response) {
                    var trollCommentAnswersClass = response.pref.value;

                    HUP.hp.get.trollCommentHeaderClass(function (response) {
                        var trollCommentHeaderClass = response.pref.value;

                        HUP.hp.get.trollcolor(function (response) {
                            var trollcolor = response.pref.value;

                            HUP.hp.get.hilightforumlinesonhover(function (response) {
                                var hilightforumlinesonhover = response.pref.value;
                                switch (trollfiltermethod) {
                                case 'hide':
                                    styles += '.' + trollCommentClass +
                                      ' {display:none !important;}';
                                    if (hidetrollanswers) {
                                        styles += '.' + trollCommentAnswersClass +
                                          ' {display:none !important;}';
                                    }
                                    break;
                                // case 'hilight':
                                default:
                                    // styles += '.' + trollCommentHeaderClass +
                                    //   ' {background-color:' + trollcolor + ' !important;}';
                                    styles += '.' + trollCommentClass + ' .submitted {' +
                                        'background-color:' + trollcolor + ' !important;' +
                                    '}';
                                    break;
                                }
                                if (hilightforumlinesonhover) {
                                    styles += 'tr.odd:hover td,' +
                                      'tr.even:hover td {background-color: #D8D8C4;}';
                                }
                                addStyle(styles);
                            });
                        });
                    });
                });
            });
        });
    });
    indentStyle = 'chrome://hupper/skin/indentstyles.css';
    accesibilityStyle = 'chrome://hupper/skin/accesibilitystyles.css';
    widthStyle = function (width) {
        return '' +
        '/* hupper width */' +
          '.sidebar {' +
            'width:' + width + 'px !important;' +
          '}';
    };
    minFontsizeStyle = function (fontsize) {
        return '' +
          '/* min font size */' +
            'body,#all,#top-nav,#top-nav a,.sidebar .block .content,#footer,.node .links {' +
              'font-size:' + fontsize + 'px !important;' +
          '}';
    };


    HUP.hp.get.styleIndent(function (response) {
        if (response.pref.value) {
            addStyle(indentStyle);
        }
    });
    HUP.hp.get.styleAccessibility(function (response) {
        if (response.pref.value) {
            addStyle(accesibilityStyle);
        }
    });
    HUP.hp.get.styleWiderSidebar(function (response) {
        var width = response.pref.value;
        if (width > 0) {
            addStyle(widthStyle(width));
        }
    });
    HUP.hp.get.styleMinFontsize(function (response) {
        var minFontsize = response.pref.value;
        if (minFontsize > 0) {
            addStyle(minFontsizeStyle(minFontsize));
        }
    });
    addStyle("chrome://hupper/skin/hupper.css");
};
