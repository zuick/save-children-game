module.exports = function (string, params){
  var replaced = string;
  replaced = replaced.replace(/\·\{(.*?)\}\·/gmi,function(match,capture,index,all){
    var replace;
    try {
      replace = contextEval(params,capture);
      replace = JSON.stringify(replace);
      if(typeof replace === 'string'){
        replace = replace.replace(/(^\"|\"$)/g,'').replace(/(\\n|\\r)/g,'\n').replace(/\\t/g,'\t');
      }
      return replace;
    } catch(error){
      return match;
    }
  });
  replaced = replaced.replace(/\{([a-z0-9\$\_]+(?:\.[a-z0-9\-\_]+)*)\}/gmi,function(match,capture,index,all){
    var replace;
    try {
      capture = '["'+capture.split('.').join('"]["')+'"]';
      replace = eval('params'+capture);
      replace = JSON.stringify(replace);
      if(typeof replace === 'string'){
        replace = replace.replace(/(^\"|\"$)/g,'').replace(/(\\n|\\r)/g,'\n').replace(/\\t/g,'\t');
      }
      return replace;
    } catch(error){
      return match;
    }
  });
  return replaced;
}

function contextEval($__context,$__evaluation){
  for(var i=0,k=Object.keys($__context),l=k.length;i<l;i++){
    eval("var "+k[i]+" = $__context['"+k[i]+"'];");
  }
  return eval($__evaluation);
}
