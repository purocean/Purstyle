chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch (request.method) {
        case 'saveStyle':
            StyleStorage.saveStyle(request.data, function(){
                sendResponse(true);
            }, function(){
                sendResponse(false);
            });
            break;

        case 'getAllStyles':
            StyleStorage.getAllStyles(function(data){
                sendResponse(data);
            }, function(){
                sendResponse(false);
            });
            break;

        case 'getStyle':
            StyleStorage.getStyle(request.id, function(data){
                sendResponse(data);
            }, function(){
                sendResponse(false);
            });
            break;

        case 'delStyle':
            StyleStorage.delStyle(request.id, function(data){
                sendResponse(true);
            }, function(){
                sendResponse(false);
            });
            break;

        case 'setBadgeText':
            Badge.setText(sender.tab.id, request.text);
            break;

        alert(2)
    }

    return true;
});

Badge = {
    setText: function(tabId, text){
        chrome.browserAction.setBadgeText({text: text, tabId: tabId});
    },
};
