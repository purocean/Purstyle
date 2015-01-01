Popup = {
    Eavailables: $('#availables'),

    init: function(){
        this.bindEvent();

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {method: 'getAvailables'}, function(data){
                Popup.updateAvailables(data);
            });
        });
    },

    updateAvailables: function(data){
        var tpl = '<li><label for="a-{id}"><input id="a-{id}" name="a-{id}" data-id="{id}" type="checkbox" {checked}/> {name}</label></li>'

        var html = '';
        if(data.length < 1){
            html = '<em>当前没有可用样式</em>'
        }else{
            for(var x in data){
                if(Boolean(data[x].enabled)){
                    data[x].checked = 'checked ';
                }else{
                    data[x].checked = '';
                }
                data[x].name = Common.htmlEncode(data[x].name);
                data[x].description = Common.htmlEncode(data[x].description);
                html += Common.formatStr(tpl, data[x]);
            }
        }

        this.Eavailables.html(html);
    },

    bindEvent: function(){
        this.Eavailables.on('change', 'input', function(){
            var id = $(this).data('id');
            if($(this).get(0).checked){
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                    chrome.tabs.sendMessage(tabs[0].id, {method: 'enableStyle', id: id}, function(flag){
                        Popup.updateAvailables(data);
                    });
                });
            }else{
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                    chrome.tabs.sendMessage(tabs[0].id, {method: 'disableStyle', id: id}, function(flag){
                        Popup.updateAvailables(data);
                    });
                });
            }
        });
    }
};

Popup.init();
