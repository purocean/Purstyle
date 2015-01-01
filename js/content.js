Page = {
    styleIdPrefix: '___purstyle',
    styleClass: '___purstyle',
    availables: [],

    apply: function(){
        chrome.runtime.sendMessage({method: "getAllStyles"}, function(result){
            Page.updateStyles(result);
        });
    },

    matchUrl: function(match, url){
        // only http and https allowed
        if(url.indexOf("http") != 0){
            return false;
        }

        if(match == ''){
            return true;
        }else{
            if(match[0] != "^") {
                match = "^" + match;
            }
            if(match[match.length - 1] != "$") {
                match += "$";
            }
            var re = new RegExp(match);
            return re.test(url);
        }

        return false;
    },

    updateStyles: function(data){
        this.removeStyles();
        var count = 0;
        var i = 0;
        for(var x in data){
            if(Page.matchUrl(data[x].match, location.href)){
                var Estyle = document.createElement("style");
                Estyle.setAttribute("id", Page.styleIdPrefix + data[x].id);
                Estyle.setAttribute("class", Page.styleClass);
                Estyle.setAttribute("type", "text/css");
                Estyle.appendChild(document.createTextNode(data[x].code));

                if(Boolean(data[x].enabled)){
                    if(document.head){
                        document.head.appendChild(Estyle);
                    }else{
                        document.documentElement.appendChild(Estyle);
                    }
                    ++count;
                }

                Page.availables[i] = data[x];
                ++i;
            }

        }

        if(count > 0) chrome.runtime.sendMessage({method: "setBadgeText", text: count.toString()}, function(flag){});
    },

    changeEnabled: function(id, enabled){
        for(var x in this.availables){
            if(this.availables[x].id == id){
                this.availables[x].enabled = enabled;
                break;
            }
        }
    },

    removeStyles: function(){
        var es = document.querySelectorAll('.' + this.styleClass);
        if(es.length > 0) for(var x in es){
            console.log(es[x])
            es[x].remove();
        }
    }
};

Page.apply();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.method){
        case "getAvailables":
            sendResponse(Page.availables);
            break;
        case "enableStyle":
            Page.changeEnabled(request.id, true);
            Page.updateStyles(Page.availables);
            sendResponse(Page.availables);
            break;
        case "disableStyle":
            Page.changeEnabled(request.id, false);
            Page.updateStyles(Page.availables);
            sendResponse(Page.availables);
            break;
    }
    return true;
});
