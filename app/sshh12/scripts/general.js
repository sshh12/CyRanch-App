//Global Functions and Stuff

var SVR_ADDRESS = "http://sshh12.com:8338/";
//var SVR_ADDRESS = "http://10.0.0.2:8338/";

function createDocElement(name, bodytext) {
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

function removeExtraChars(string){
	return string.toLowerCase().replace(",", "").replace(" ", "");
}

function parseXSS(string){
	return string.replace(/;/g, "&semi;").replace(/=/g, "&equals;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/&/g, "&amp;").replace(/!/g, "&excl;").replace(/\$/g, "&dollar;");
}

function getFromURL(URL) {
	var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", URL, false);
  xmlHttp.send( null );
	return xmlHttp.responseText;
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
  return getFromURL(SVR_ADDRESS + method);
}

function nalert(title, text){
	navigator.notification.alert(text, function(){ return false; }, title, 'Dismiss');
}
