Common = {
    formatStr: function(tpl, obj){
        var reg = /{([^{}]+)}/gm;
        return tpl.replace(reg, function(match, name){
          return obj[name];
        });
    },

    htmlEncode: function(str){
        var div = document.createElement("div");
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    },
};
