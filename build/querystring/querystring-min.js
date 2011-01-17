/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.2.0
build: nightly
*/
YUI.add("querystring-parse",function(e){var b=e.namespace("QueryString"),d=function(f){return function g(l,n){var h,m,k,j,i;if(arguments.length!==2){l=l.split(f);return g(b.unescape(l.shift()),b.unescape(l.join(f)));}l=l.replace(/^\s+|\s+$/g,"");if(e.Lang.isString(n)){n=n.replace(/^\s+|\s+$/g,"");if(!isNaN(n)){m=+n;if(n===m.toString(10)){n=m;}}}h=/(.*)\[([^\]]*)\]$/.exec(l);if(!h){i={};if(l){i[l]=n;}return i;}j=h[2];k=h[1];if(!j){return g(k,[n]);}i={};i[j]=n;return g(k,i);};},c=function(g,f){return((!g)?f:(e.Lang.isArray(g))?g.concat(f):(!e.Lang.isObject(g)||!e.Lang.isObject(f))?[g].concat(f):a(g,f));},a=function(h,f){for(var g in f){if(g&&f.hasOwnProperty(g)){h[g]=c(h[g],f[g]);}}return h;};b.parse=function(g,h,f){return e.Array.reduce(e.Array.map(g.split(h||"&"),d(f||"=")),{},c);};b.unescape=function(f){return decodeURIComponent(f.replace(/\+/g," "));};},"3.2.0",{requires:["collection"]});YUI.add("querystring-stringify",function(d){var c=d.namespace("QueryString"),b=[],a=d.Lang;c.escape=encodeURIComponent;c.stringify=function(k,o,e){var g,j,m,h,f,t,r=o&&o.sep?o.sep:"&",p=o&&o.eq?o.eq:"=",q=o&&o.arrayKey?o.arrayKey:false;if(a.isNull(k)||a.isUndefined(k)||a.isFunction(k)){return e?c.escape(e)+p:"";}if(a.isBoolean(k)||Object.prototype.toString.call(k)==="[object Boolean]"){k=+k;}if(a.isNumber(k)||a.isString(k)){return c.escape(e)+p+c.escape(k);}if(a.isArray(k)){t=[];e=q?e+"[]":e;h=k.length;for(m=0;m<h;m++){t.push(c.stringify(k[m],o,e));}return t.join(r);}for(m=b.length-1;m>=0;--m){if(b[m]===k){throw new Error("QueryString.stringify. Cyclical reference");}}b.push(k);t=[];g=e?e+"[":"";j=e?"]":"";for(m in k){if(k.hasOwnProperty(m)){f=g+m+j;t.push(c.stringify(k[m],o,f));}}b.pop();t=t.join(r);if(!t&&e){return e+"=";}return t;};},"3.2.0");YUI.add("querystring",function(a){},"3.2.0",{use:["querystring-parse","querystring-stringify"]});