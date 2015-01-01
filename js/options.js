Styles = {
    EstylesUl: $('#styles'),
    detail: {
        Eform        : $('#detail-form'),
        Edelete      : $('#detail-delete'),

        Eid          : $('#detail-id'),
        Ename        : $('#detail-name'),
        Edescription : $('#detail-description'),
        Ematch       : $('#detail-match'),
        Ecode        : $('#detail-code'),
        Eenabled     : $('#detail-enabled'),
    },

    bindEvent: function(){
        this.detail.Eform.on('paste cut focus blur change', function(){
            Styles.detail.Ename.val($.trim(Styles.detail.Ename.val()));
            Styles.detail.Edescription.val($.trim(Styles.detail.Edescription.val()));
            Styles.detail.Ematch.val($.trim(Styles.detail.Ematch.val()));
            Styles.detail.Ecode.val($.trim(Styles.detail.Ecode.val()));
        });

        this.EstylesUl.on('click', 'li', function(){
            Styles.showStyle($(this).data('id'));
            Styles.EstylesUl.children('li').removeClass('selected');
            $(this).addClass('selected');
        });

        this.detail.Eform.submit(function(){
            Styles.saveStyle({
                id          : Styles.detail.Eid.val(),
                name        : $.trim(Styles.detail.Ename.val()),
                description : $.trim(Styles.detail.Edescription.val()),
                match       : $.trim(Styles.detail.Ematch.val()),
                code        : $.trim(Styles.detail.Ecode.val()),
                enabled     : Number(Styles.detail.Eenabled.get(0).checked),
            });
            return false;
        });

        this.detail.Edelete.click(function(){
            Styles.delStyle(Styles.detail.Eid.val());
            return false;
        });
    },

    saveStyle: function(data){
        chrome.runtime.sendMessage({method: "saveStyle", data: data}, function(flag){
            if(flag){
                alert('保存成功！')
                if(data.id == 0){
                    Styles.showLists();
                    Styles.showStyle('new');
                }
            }else{
                alert('save style error');
            }
        });
    },

    showStyle: function(id){
        var show = function(data){
            Styles.detail.Eid.val(data.id);
            Styles.detail.Ename.val(data.name);
            Styles.detail.Edescription.val(data.description);
            Styles.detail.Ematch.val(data.match);
            Styles.detail.Ecode.val(data.code);
            Styles.detail.Eenabled.get(0).checked = Boolean(data.enabled);
        }


        if(id != 'new'){
            chrome.runtime.sendMessage({method: "getStyle", id: id}, function(result){
                if(result !== false){
                    show(result);
                }else{
                    alert('get style error');
                }
            });

            this.detail.Edelete.show();
        }else{
            show({
                id: 0,
                name: '',
                description: '',
                match: '',
                code: '',
                enabled: true,
            });

            this.detail.Edelete.hide();
        }

    },

    showLists: function(){
        chrome.runtime.sendMessage({method: "getAllStyles"}, function(result){
            if(result !== false){
                var listTpl = '<li data-id="{id}">{name}</li>';
                var html = '<li data-id="new" class="selected">新样式</li>';

                for(var x in result){
                    result[x].name = Common.htmlEncode(result[x].name);
                    result[x].description = Common.htmlEncode(result[x].description);
                    html += Common.formatStr(listTpl, result[x]);
                }

                Styles.EstylesUl.html(html);
            }else{
                alert('get all profile error');
            }
        });
    },

    delStyle: function(id){
        if(confirm('确定要删除此条？')) chrome.runtime.sendMessage({method: "delStyle", id: id}, function(result){
            if(result){
                alert('删除成功！');
                Styles.showLists();
                Styles.showStyle('new');
            }else{
                alert('delete style error');
            }
        });
    },
};

$(document).ready(function(){
    Styles.bindEvent();
    Styles.showLists();
});
