//Global Functions and Stuff

var SVR_ADDRESS = "https://cfisdapi.herokuapp.com";

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

function postFromAPI(method, data){
	return fetch(SVR_ADDRESS + "/" + method, { method:"POST", body:data });
}

function getFromAPI(method){
	return fetch(SVR_ADDRESS + "/" + method);
}

function AppAlert(title, text){
	navigator.notification.alert(text, function(){ return false; }, title, 'Dismiss');
}
