//Global Functions and Stuff

var SVR_ADDRESS = "https://cfisdapi.herokuapp.com/";

//https://github.com/github/fetch/blob/master/fetch.js for IOS
!function(a){"use strict";function c(a){if("string"!=typeof a&&(a=String(a)),/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(a))throw new TypeError("Invalid character in header field name");return a.toLowerCase()}function d(a){return"string"!=typeof a&&(a=String(a)),a}function e(a){var c={next:function(){var b=a.shift();return{done:void 0===b,value:b}}};return b.iterable&&(c[Symbol.iterator]=function(){return c}),c}function f(a){this.map={},a instanceof f?a.forEach(function(a,b){this.append(b,a)},this):a&&Object.getOwnPropertyNames(a).forEach(function(b){this.append(b,a[b])},this)}function g(a){return a.bodyUsed?Promise.reject(new TypeError("Already read")):void(a.bodyUsed=!0)}function h(a){return new Promise(function(b,c){a.onload=function(){b(a.result)},a.onerror=function(){c(a.error)}})}function i(a){var b=new FileReader;return b.readAsArrayBuffer(a),h(b)}function j(a){var b=new FileReader;return b.readAsText(a),h(b)}function k(){return this.bodyUsed=!1,this._initBody=function(a){if(this._bodyInit=a,"string"==typeof a)this._bodyText=a;else if(b.blob&&Blob.prototype.isPrototypeOf(a))this._bodyBlob=a;else if(b.formData&&FormData.prototype.isPrototypeOf(a))this._bodyFormData=a;else if(b.searchParams&&URLSearchParams.prototype.isPrototypeOf(a))this._bodyText=a.toString();else if(a){if(!b.arrayBuffer||!ArrayBuffer.prototype.isPrototypeOf(a))throw new Error("unsupported BodyInit type")}else this._bodyText="";this.headers.get("content-type")||("string"==typeof a?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):b.searchParams&&URLSearchParams.prototype.isPrototypeOf(a)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},b.blob?(this.blob=function(){var a=g(this);if(a)return a;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyFormData)throw new Error("could not read FormData body as blob");return Promise.resolve(new Blob([this._bodyText]))},this.arrayBuffer=function(){return this.blob().then(i)},this.text=function(){var a=g(this);if(a)return a;if(this._bodyBlob)return j(this._bodyBlob);if(this._bodyFormData)throw new Error("could not read FormData body as text");return Promise.resolve(this._bodyText)}):this.text=function(){var a=g(this);return a?a:Promise.resolve(this._bodyText)},b.formData&&(this.formData=function(){return this.text().then(o)}),this.json=function(){return this.text().then(JSON.parse)},this}function m(a){var b=a.toUpperCase();return l.indexOf(b)>-1?b:a}function n(a,b){b=b||{};var c=b.body;if(n.prototype.isPrototypeOf(a)){if(a.bodyUsed)throw new TypeError("Already read");this.url=a.url,this.credentials=a.credentials,b.headers||(this.headers=new f(a.headers)),this.method=a.method,this.mode=a.mode,c||(c=a._bodyInit,a.bodyUsed=!0)}else this.url=a;if(this.credentials=b.credentials||this.credentials||"omit",!b.headers&&this.headers||(this.headers=new f(b.headers)),this.method=m(b.method||this.method||"GET"),this.mode=b.mode||this.mode||null,this.referrer=null,("GET"===this.method||"HEAD"===this.method)&&c)throw new TypeError("Body not allowed for GET or HEAD requests");this._initBody(c)}function o(a){var b=new FormData;return a.trim().split("&").forEach(function(a){if(a){var c=a.split("="),d=c.shift().replace(/\+/g," "),e=c.join("=").replace(/\+/g," ");b.append(decodeURIComponent(d),decodeURIComponent(e))}}),b}function p(a){var b=new f,c=(a.getAllResponseHeaders()||"").trim().split("\n");return c.forEach(function(a){var c=a.trim().split(":"),d=c.shift().trim(),e=c.join(":").trim();b.append(d,e)}),b}function q(a,b){b||(b={}),this.type="default",this.status=b.status,this.ok=this.status>=200&&this.status<300,this.statusText=b.statusText,this.headers=b.headers instanceof f?b.headers:new f(b.headers),this.url=b.url||"",this._initBody(a)}if(!a.fetch){var b={searchParams:"URLSearchParams"in a,iterable:"Symbol"in a&&"iterator"in Symbol,blob:"FileReader"in a&&"Blob"in a&&function(){try{return new Blob,!0}catch(a){return!1}}(),formData:"FormData"in a,arrayBuffer:"ArrayBuffer"in a};f.prototype.append=function(a,b){a=c(a),b=d(b);var e=this.map[a];e||(e=[],this.map[a]=e),e.push(b)},f.prototype.delete=function(a){delete this.map[c(a)]},f.prototype.get=function(a){var b=this.map[c(a)];return b?b[0]:null},f.prototype.getAll=function(a){return this.map[c(a)]||[]},f.prototype.has=function(a){return this.map.hasOwnProperty(c(a))},f.prototype.set=function(a,b){this.map[c(a)]=[d(b)]},f.prototype.forEach=function(a,b){Object.getOwnPropertyNames(this.map).forEach(function(c){this.map[c].forEach(function(d){a.call(b,d,c,this)},this)},this)},f.prototype.keys=function(){var a=[];return this.forEach(function(b,c){a.push(c)}),e(a)},f.prototype.values=function(){var a=[];return this.forEach(function(b){a.push(b)}),e(a)},f.prototype.entries=function(){var a=[];return this.forEach(function(b,c){a.push([c,b])}),e(a)},b.iterable&&(f.prototype[Symbol.iterator]=f.prototype.entries);var l=["DELETE","GET","HEAD","OPTIONS","POST","PUT"];n.prototype.clone=function(){return new n(this)},k.call(n.prototype),k.call(q.prototype),q.prototype.clone=function(){return new q(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new f(this.headers),url:this.url})},q.error=function(){var a=new q(null,{status:0,statusText:""});return a.type="error",a};var r=[301,302,303,307,308];q.redirect=function(a,b){if(r.indexOf(b)===-1)throw new RangeError("Invalid status code");return new q(null,{status:b,headers:{location:a}})},a.Headers=f,a.Request=n,a.Response=q,a.fetch=function(a,c){return new Promise(function(d,e){function h(){return"responseURL"in g?g.responseURL:/^X-Request-URL:/im.test(g.getAllResponseHeaders())?g.getResponseHeader("X-Request-URL"):void 0}var f;f=n.prototype.isPrototypeOf(a)&&!c?a:new n(a,c);var g=new XMLHttpRequest;g.onload=function(){var a={status:g.status,statusText:g.statusText,headers:p(g),url:h()},b="response"in g?g.response:g.responseText;d(new q(b,a))},g.onerror=function(){e(new TypeError("Network request failed"))},g.ontimeout=function(){e(new TypeError("Network request failed"))},g.open(f.method,f.url,!0),"include"===f.credentials&&(g.withCredentials=!0),"responseType"in g&&b.blob&&(g.responseType="blob"),f.headers.forEach(function(a,b){g.setRequestHeader(b,a)}),g.send("undefined"==typeof f._bodyInit?null:f._bodyInit)})},a.fetch.polyfill=!0}}("undefined"!=typeof self?self:this);

function createDocElement(name, bodytext) { //Magical HTML Parser Object
	var page = document.implementation.createHTMLDocument(name);
	var pagebody = page.createElement("body");
	pagebody.innerHTML = bodytext;
	return pagebody;
}

function isUndefined(value) {
    return typeof value === 'undefined';
}

function encodeToURL(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
    return '%' + c.charCodeAt(0).toString(16);
  });
}

function reduceString(string){
	return string.toLowerCase().replace(",", "").replace(" ", "");
}

function parseXSS(string){
	return string.replace(/;/g, "&semi;")
		.replace(/=/g, "&equals;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/&/g, "&amp;")
		.replace(/!/g, "&excl;")
		.replace(/\$/g, "&dollar;");
}

function timeout(ms, promise) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      reject(new Error("Connection Timed Out"))
    }, ms)
    promise.then(resolve, reject)
  })
}

function getFromAPI(method){
	return fetch(SVR_ADDRESS + method);
}

function getFromSite(method){
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", SVR_ADDRESS + method, false);
	xmlHttp.send( null );
	return xmlHttp.responseText;
}

function AppAlert(title, text){
	navigator.notification.alert(text, function(){ return false; }, title, 'Dismiss');
}
