chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
    function cb(a) {
        sendResponse({success: true});
    }

    if (request.style && sender.tab) {

        if (request.isUrl) {
            chrome.tabs.insertCSS(sender.tab.id, {file: request.style}, cb);
        } else {
            chrome.tabs.insertCSS(sender.tab.id, {code: request.style}, cb);
        }
    } else if (request.pref) {
        if (typeof request.pref.value !== 'undefined') {
            Prefs.set(request.pref.name, request.pref.value);
        }
        Prefs.get(request.pref.name, function (response) {
            sendResponse({
                success: true,
                pref: {
                    name: request.pref.name,
                    value: Prefs.get(response.pref.name)
                }
            });
        });
    } else {
        sendResponse({success: false});
    }
});
var onContextClick = function (type) {
    return function (e) {
        chrome.tabs.getSelected(null, function (tab) {
            chrome.tabs.sendRequest(tab.id, {
                type: type,
                ev: e
            }, function () {
                // console.log(cb)
            });
        });
    };
};
var contextConf = {
    title: 'troll',
    contexts: ['link'],
    targetUrlPatterns: [
        'http://www.hup.hu/user/*',
        'https://www.hup.hu/user/*',
        'http://hup.hu/user/*',
        'https://hup.hu/user/*'
    ]
};
['troll', 'untroll', 'highlight', 'unhighlight'].forEach(function (title) {
    var conf = {
        title: title,
        contexts: contextConf.contexts,
        targetUrlPatterns: contextConf.targetUrlPatterns,
        onclick: onContextClick(title)
    };
    chrome.contextMenus.create(conf);
});

