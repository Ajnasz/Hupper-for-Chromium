// Saves options to localStorage.

var prefItems = [
    {id: 'enabletrollfilter', prefName: 'filtertrolls'},
    {id: 'trolls', prefName: 'trolls'},
    {id: 'trollcolor', prefName: 'trollcolor'},
    {id: 'trollfiltermethod', prefName: 'trollfiltermethod'},
    // {id: 'HUP-enable-hupperfilter', prefName: 'filterhuppers'},
    // {id: 'huppers', prefName: 'huppers'},
    // {id: 'HUP-hupper-color', prefName: 'huppercolor'},
    {id: 'enablenewcommentchange', prefName: 'replacenewcommenttext'},
    {id: 'newcommenttext', prefName: 'newcommenttext'},
    {id: 'extracommentlinks', prefName: 'extracommentlinks'},
    {id: 'hilightforumlinesonhover', prefName: 'hilightforumlinesonhover'},
    {id: 'insertpermalink', prefName: 'insertpermalink'},
    {id: 'insertnewtexttonode', prefName: 'insertnewtexttonode'},
    {id: 'fadeparentcomment', prefName: 'fadeparentcomment'},
    {id: 'showquicknavbox', prefName: 'showqnavbox'},
    {id: 'trollfilterHideanswers', prefName: 'hidetrollanswers'},
    {id: 'highlightusers', prefName: 'highlightusers'},
    {id: 'hidetaxonomy', prefName: 'hidetaxonomy'},
    {id: 'showinstatusbar', prefName: 'showinstatusbar'},
    {id: 'parseblocks', prefName: 'parseblocks'},
    {id: 'indent', prefName: 'styleIndent'},
    {id: 'accessibility', prefName: 'styleAccessibility'},
    {id: 'sidebarwidth', prefName: 'styleWiderSidebar'},
    {id: 'minfontsize', prefName: 'styleMinFontsize'},
    {id: 'setunlimitedlinks', prefName: 'setunlimitedlinks'},
    {id: 'boringcommentregexp', prefName: 'boringcommentcontents'},
    {id: 'highlightuserscolor', prefName: 'huppercolor'}
    // {id: 'HUP-hupper-password', prefName: 'getPassword'},
    // {id: 'HUP-hupper-username', prefName: 'username'}
];

function getPrefNameForElem(elem) {
    var prefName = '';

    switch (elem.id) {
        case "enabletrollfilter":
        prefName = 'filtertrolls';
        break;
        case "trolls":
        prefName = 'trolls';
        break;
        case "trollcolor":
        prefName = 'trollcolor';
        break;
        case "trollfiltermethod":
        prefName = 'trollfiltermethod';
        break;
        case "trollfilterHideanswers":
        prefName = 'hidetrollanswers';
        break;
        case "huppers":
        prefName = 'huppers';
        break;
        case "enablenewcommentchange":
        prefName = 'extensions.hupper.replacenewcommenttext';
        break;
        case "newcommenttext":
        prefName = 'extensions.hupper.newcommenttext';
        break;
        case "extracommentlinks":
        prefName = 'extensions.hupper.extracommentlinks';
        break;
        case "hilightforumlinesonhover":
        prefName = 'extensions.hupper.hilightforumlinesonhover';
        break;
        case "insertpermalink":
        prefName = 'extensions.hupper.insertpermalink';
        break;
        case "insertnewtexttonode":
        prefName = 'extensions.hupper.insertnewtexttonode';
        break;
        case "fadeparentcomment":
        prefName = 'extensions.hupper.fadeparentcomment';
        break;
        case "showquicknavbox":
        prefName = 'extensions.hupper.showqnavbox';
        break;
        case "hidetaxonomy":
        prefName = 'extensions.hupper.hidetaxonomy';
        break;
        case "showinstatusbar":
        prefName = 'extensions.hupper.showinstatusbar';
        break;
        case "parseblocks":
        prefName = 'extensions.hupper.parseblocks';
        break;
        case "indent":
        prefName = 'extensions.hupper.style_indent';
        break;
        case "accessibility":
        prefName = 'extensions.hupper.style_accessibility';
        break;
        case "sidebarwidth":
        prefName = 'extensions.hupper.style_wider_sidebar';
        break;
        case "minfontsize":
        prefName = 'extensions.hupper.style_min_fontsize';
        break;
        case "highlightusers":
        prefName = "extensions.hupper.highlightusers";
        break;
        case "highlightuserscolor":
        prefName = "extensions.hupper.huppercolor";
        break;
        case "boringcommentregexp":
        prefName = "extensions.hupper.boringcommentcontents";
        break;
        case "setunlimitedlinks":
        prefName = "extensions.hupper.setunlimitedlinks";
        break;
    }
    return prefName;
}
function getFormElements() {
    var elements = document.getElementById('hupperOptsForm').elements;
    return Array.prototype.slice.call(elements);
}
function save_options() {
    var elements = getFormElements(),
        toSet = 0,
        set = 0;


    elements.forEach(function (elem) {
        var elemId = elem.id,
            nodeName = elem.nodeName.toUpperCase(),
            value,
            pref;
        if (nodeName === 'INPUT' || nodeName === 'SELECT' || nodeName === 'TEXTAREA') {
            pref = prefItems.filter(function (item) {
                return item.id === elemId;
            })[0];

            if (elem.type && elem.type.toUpperCase() === 'CHECKBOX') {
                value = elem.checked;
            } else {
                value = elem.value;
            }
            toSet += 1;

            Prefs.set(pref.prefName, value, function (response) {
                if (response.success) {
                    set += 1;
                    if (toSet === set) {
                        // Update status to let user know options were saved.
                        var st = document.getElementById('status');
                        st.innerHTML = 'Options Saved.';
                        st.style.display = 'block';
                        setTimeout(function() {
                            st.innerHTML = '';
                            st.style.display = '';
                        }, 1000);
                    }
                }
            });
        }
    });

}

// Restores select box state to saved value from localStorage.
function restore_options() {
    document.getElementById('hupperOptsForm').addEventListener('submit', function(e) {
        e.preventDefault();
        save_options();
    }, false);

    Prefs.get('trolls', function (response) {
        var field, trolls, tree, isEmpty;
        field = document.getElementById('trolls');

        trolls = response.pref.value.split(',').map(function (troll) {
            return {name: {text: troll, editable: true}};
        });

        tree = new TreeView('trollsTree', trolls);

        function updateField() {
            field.value = trolls.map(function (troll) {
                return troll.name.text;
            }).filter(function (troll) {
                return troll !== '';
            }).join(',');
        }

        isEmpty = function (rowIndex) {
            return trolls[rowIndex].name.text === '';
        };
        tree.on('setCellText', function (o) {
            trolls[o.rowIndex][o.colName].text = o.value;
            var len = trolls.length;
            if (isEmpty(len - 1)) {
                while (isEmpty(len - 2) && isEmpty(len - 1)) {
                    tree.removeLastRow();
                    len = trolls.length;
                }
            } else {
                tree.addEmptyRow();
            }
            updateField();
        });
        tree.on('removeRow', function (index) {
            var item = trolls.splice(index, 1);
            item = null;
        });
        tree.on('emptyRowAdded', function () {
            trolls[trolls.length] = {
                name: {
                    text: '',
                    editable: true
                }
            };
        });
        tree.addEmptyRow();
        field.type = 'hidden';
    });
    Prefs.get('highlightusers', function (response) {
        var field, highlightUsers, tree, updateField, isEmpty;

        field = document.getElementById('highlightusers');
        highlightUsers = response.pref.value.split(',').map(function (user) {
            item = user.split(':');
            return {name: {text: item[0], editable: true}, color: {text: item[1], editable: true}};
        });

        tree = new TreeView('highlightusersTree', highlightUsers);

        updateField = function () {
            var output = [];
            highlightUsers.forEach(function (user) {
                if (user.name.text !== '' || user.color.text !== '') {
                    output.push(user.name.text + ':' + user.color.text);
                }
            });
            field.value = output.join(',');
        };
        isEmpty = function (rowIndex) {
            var row = highlightUsers[rowIndex];
            return row.name.text === '' && row.color.text === '';
        };
        tree.on('setCellText', function (o) {
            highlightUsers[o.rowIndex][o.colName].text = o.value;
            var len = highlightUsers.length;
            if (isEmpty(len - 1)) {
                while (isEmpty(len - 2) && isEmpty(len - 1)) {
                    tree.removeLastRow();
                    len = highlightUsers.length;
                }
            } else {
                tree.addEmptyRow();
            }
            updateField();
        });
        tree.on('removeRow', function (index) {
            var item = highlightUsers.splice(index, 1);
            item = null;
        });
        tree.on('emptyRowAdded', function () {
            highlightUsers[highlightUsers.length] = {
                name: {
                    text: '',
                    editable: true
                },

                color: {
                    text: '',
                    editable: true
                }
            };
        });
        tree.addEmptyRow();
        field.type = 'hidden';
        // document.getElementById('highlightusersTree').appendChild(table);
    });

    var elements = getFormElements();

    elements.forEach(function (elem) {
        var elemId = elem.id,
            nodeName = elem.nodeName.toUpperCase(),
            pref;
        if (nodeName === 'INPUT' || nodeName === 'SELECT' || nodeName === 'TEXTAREA') {
            pref = prefItems.filter(function (item) {
                return item.id === elemId;
            })[0];

            Prefs.get(pref.prefName, function (response) {
                if (response.success) {
                    var value = response.pref.value;
                    if (elem.type && elem.type.toUpperCase() === 'CHECKBOX') {
                        elem.checked = value;
                    } else {
                        elem.value = value;
                    }
                }
            });
        }
    });
}

window.addEventListener('load', restore_options, false);
