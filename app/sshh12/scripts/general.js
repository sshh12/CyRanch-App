var SVR_ADDRESS = "http://sshh12.com:8338/";

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

function removeExtraChars(s){
	s = s.toLowerCase();
	s = s.replace(",", "");
	s = s.replace(" ", "");
	return s;
}

function parseXSS(s){
	return s.replace(/;/g, "&semi;").replace(/=/g, "&equals;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/&/g, "&amp;").replace(/!/g, "&excl;").replace(/\$/g, "&dollar;");
}

function getFromURL(url) {
	var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", url, false);
  xmlHttp.send( null );
	return xmlHttp.responseText;
}

function getFromSite(method){
  return getFromURL(SVR_ADDRESS + method);
}

function nalert(title, text){
	navigator.notification.alert(text, function(){ return false; }, title, 'Dismiss');
}
