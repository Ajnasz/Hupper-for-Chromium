

var Prefs = {
    prefMap: {
        trolls: 'extensions.hupper.trolls',
        filtertrolls: 'extensions.hupper.filtertrolls',
        trollfiltermethod: 'extensions.hupper.trollfiltermethod',
        trollcolor: 'extensions.hupper.trollcolor',
        huppers: 'extensions.hupper.huppers',
        filterhuppers: 'extensions.hupper.filterhuppers',
        huppercolor: 'extensions.hupper.huppercolor',
        replacenewcommenttext: 'extensions.hupper.replacenewcommenttext',
        newcommenttext: 'extensions.hupper.newcommenttext',
        extracommentlinks: 'extensions.hupper.extracommentlinks',
        hilightforumlinesonhover: 'extensions.hupper.hilightforumlinesonhover',
        insertpermalink: 'extensions.hupper.insertpermalink',
        insertnewtexttonode: 'extensions.hupper.insertnewtexttonode',
        fadeparentcomment: 'extensions.hupper.fadeparentcomment',
        showqnavbox: 'extensions.hupper.showqnavbox',
        hidetrollanswers: 'extensions.hupper.hidetrollanswers',
        hideads: 'extensions.hupper.hideads',
        highlightusers: 'extensions.hupper.highlightusers',
        username: 'extensions.hupper.username',
        hidetaxonomy: 'extensions.hupper.hidetaxonomy',
        showinstatusbar: 'extensions.hupper.showinstatusbar',
        blocks: 'extensions.hupper.blocks',
        parseblocks: 'extensions.hupper.parseblocks',
        styleIndent: 'extensions.hupper.style_indent',
        styleAccessibility: 'extensions.hupper.style_accessibility',
        styleWiderSidebar: 'extensions.hupper.style_wider_sidebar',
        styleMinFontsize: 'extensions.hupper.style_min_fontsize',
        hideboringcomments: 'extensions.hupper.hideboringcomments',
        boringcommentcontents: 'extensions.hupper.boringcommentcontents',
        setunlimitedlinks: 'extensions.hupper.setunlimitedlinks'
    },
    get: function (n, cb) {
        var name, output;

        name = Prefs.prefMap[n] || n;
        output = localStorage[name];

        if (typeof output === 'undefined') {
            switch (name) {
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
            case "extensions.hupper.hideboringcomments":
            case "extensions.hupper.setunlimitedlinks":
                output = true;
                break;
            case "extensions.hupper.insertpermalink":
            case "extensions.hupper.hideads":
                output = false;
                break;
            case "extensions.hupper.trollfiltermethod":
                output = 'hilight';
                break;
            case "extensions.hupper.trollcolor":
                output = '#CFB2A7';
                break;
            case "extensions.hupper.huppercolor":
                output = '#B5D7BE';
                break;
            case "extensions.hupper.newcommenttext":
                output = '[new]';
                break;
            case "extensions.hupper.trolls":
            case "extensions.hupper.huppers":
            case "extensions.hupper.username":
            case "extensions.hupper.hidetaxonomy":
                output = '';
                break;
            case "extensions.hupper.highlightusers":
                output = "username:#fff999,username2:#999fff";
                break;
            case "extensions.hupper.blocks":
                output = '{}';
                break;
            case 'extensions.hupper.style_wider_sidebar':
            case 'extensions.hupper.style_min_fontsize':
                output = 0;
                break;
            case 'extensions.hupper.boringcommentcontents':
                output = "^([-_]|-1|\\+1)$";
                break;
            }

        }
        if (cb) {
            cb({
                success: true,
                pref: {
                    name: name,
                    value: output
                }
            });
        }
        return output;
    },
    set: function (n, v, cb) {
        var name = Prefs.prefMap[n] || n;
        console.log(name);
        localStorage[name] = v;
        if (cb) {
            cb({
                success: true,
                pref: {
                    name: name,
                    value: localStorage[name]
                }
            });
        }
    }
};

