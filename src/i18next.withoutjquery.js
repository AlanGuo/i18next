var extend = function(a,b){
    for(var p in b){
        a[p] = b[p];
    }

    return a;
}

function parse(ele, key, options) {
    if (key.length === 0) return;

    var attr = 'text';

    if (key.indexOf('[') === 0) {
        var parts = key.split(']');
        key = parts[1];
        attr = parts[0].substr(1, parts[0].length-1);
    }

    if (key.indexOf(';') === key.length-1) {
        key = key.substr(0, key.length-2);
    }

    var optionsToUse;
    if (attr === 'html') {
        optionsToUse = o.defaultValueFromContent ? extend({ defaultValue: ele.innerHTML }, options) : options;
        ele.innerHTML = translate(key, optionsToUse);
    } else if (attr === 'text') {
        optionsToUse = o.defaultValueFromContent ? extend({ defaultValue: ele.innerText.trim() || ele.textContent.trim() }, options) : options;
        if('innerText' in ele)
            ele.innerText = translate(key, optionsToUse);
        else 
            ele.textContent = translate(key, optionsToUse);
    } else if (attr === 'prepend') {
        optionsToUse = o.defaultValueFromContent ? extend({ defaultValue: ele.innerHTML }, options) : options;
        ele.innerHTML = translate(key, optionsToUse) + ele.innerHTML;
    } else if (attr === 'append') {
        optionsToUse = o.defaultValueFromContent ? extend({ defaultValue: ele.innerHTML }, options) : options;
        ele.innerHTML += translate(key, optionsToUse);
    } else if (attr.indexOf("data-") === 0) {
        var dataAttr = attr.substr(("data-").length);
        optionsToUse = o.defaultValueFromContent ? extend({ defaultValue: ele.dataset[dataAttr] }, options) : options;
        var translated = translate(key, optionsToUse);
        //we change into the data cache
        ele.dataset[dataAttr] = translated;
        //we change into the dom
        ele.setAttribute(attr, translated);
    } else {
        optionsToUse = o.defaultValueFromContent ? extend({ defaultValue: ele.getAttribute(attr) }, options) : options;
        ele.setAttribute(attr, translate(key, optionsToUse));
    }
}

function localize(ele,options){
    var key = ele.getAttribute(o.selectorAttr);
    if(key === null) key = undefined;
    if (!key && typeof key !== 'undefined' && key !== false) key = ele.innerText.trim() || ele.textContent.trim() || ele.value;
    if (!key) return;

    var target = ele
      , targetSelector = ele.dataset["i18n-target"];
    if (targetSelector) {
        target = ele.querySelectorAll(targetSelector) || ele;
    }

    if (!options && o.useDataAttrOptions === true) {
        options = ele.dataset["i18n-options"];
    }
    options = options || {};

    if (key.indexOf(';') >= 0) {
        var keys = key.split(';');

        for(var i=0;i<keys.length;i++){
            if(keys[i] !== ''){
                parse(target, keys[i], options);
            }
        }

    } else {
        parse(target, key, options);
    }

    if (o.useDataAttrOptions === true) ele.dataset["i18n-options"] = options;
}

function localizeElem(elem,options){
    // localize element itself
    localize(elem, options);

    // localize childs
    var children =  elem.querySelectorAll('[' + o.selectorAttr + ']');
    for(var i=0,len=children.length;i<len;i++){
        localize(children[i], options);
    }
    
}

//localize without jquery
function localizeElems(elems,options){
    //localize element itself
    if(elems.length){
        for(var i=0,len=elems.length;i<len;i++){
            localizeElem(elems[i]);
        }
    }
    else{
        localizeElem(elems);
    }
}

//extend api
i18n.localizeElems = localizeElems;

o.setJqueryExt = false;