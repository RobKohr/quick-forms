exports.req = null;//set to express req 
var nl = "\n    ";
exports.open = function(path, name, label, options){
    var out = '';
    if(!label)
	label = pretty(name);
    id_part = 'id="form_' + name + '"';
    extras = '';
    if((options)&&(options.enctype)){
	extras+=' enctype="multipart/form-data"';
    }
    out += '<form '+id_part+' method="post"'+extras+'>';
    out += exports.hidden('form', name);
    out += exports.fieldsetStart(name);
    return out;
}

exports.close = function(){
    var out = '';
    out+= '</fieldset></form>';
    return out;
}

exports.hidden = function(params, value){
    params = paramsToObj(params, value);
    params.type = 'hidden';
    var input = makeInput(params);
    return input;
}

exports.fieldsetStart = function(params){
    params = paramsToObj(params);
    var out = nl+'<fieldset>';
    out += nl+'<legend>'+pretty(params.name)+'</legend>';
    return out;
}

exports.input = function(params){
    params = paramsToObj(params);
    if(!params.type)
	params.type = 'text';

    //if using form validator and exports.req set, re-fill in form values
    if((!params.value)
       &&(exports.req)
       &&(exports.req.param)
       &&(exports.req.param(params.name))
       &&(params.type != 'password')
      ){
	params.value = exports.req.param(params.name);
    }
    params.input = makeInput(params);
    return wrapInput(params);
}

var basic = function(params, type){
    params = paramsToObj(params);
    params.type = type;
    return exports.input(params);
}

exports.file = function(params){
    return basic(params, 'file');    
}


exports.password = function(params){
    params = paramsToObj(params);
    params.type = 'password';
    return exports.input(params);
}

exports.email = function(params){
    params = paramsToObj(params);
    params.type = 'email';
    return exports.input(params);
}

exports.submit = function(params){
    params = paramsToObj(params);
    params.nowrap = true;
    params.type = 'submit';
    params.value = params.name;
    return exports.input(params);
}


function wrapInput(params){
    var out = '';
    if(params.nowrap)
	return params.input;
    if(!params.label)
	params.label = pretty(params.name);
    if(!params.id)
	params.id = 'form_'+name;
    var label='<label for="'+params.id+'">'+params.label+'</label>';
    out+=nl+'<p>' + label + params.input + '</p>';
    return out;
}

function makeInput(params){
    var out = nl+'<input';
    var inputFields = ['type', 'value', 'name', 'id'];
    if(!params.id)
	params.id = 'form_' + params.name
    for(var key in params){
	if(inputFields.indexOf(key)==-1)
	    continue;
	var val = params[key];
	out+= ' '+key+'="'+val+'"';
    }
    out+=' />';
    return out;
}

function paramsToObj(params, value){
    if(typeof(params)=='string'){
	params = {name:params};
    }
    if(value){
	params.value = value;
    }
    return params;
}


function pretty(str){
    if(!str)
	return '';
    var out = ucwords(str.replace('_', ' '));
    return out;
}

function ucwords (str) {
    return (str + '').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
        return $1.toUpperCase();
    });
}
