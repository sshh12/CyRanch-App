var language = localStorage.getItem("language");
if(isUndefined(language) || language == null  || language == ""){
	setLanguage("en");
}

function setLanguage(lang){
	window.language = lang;
	localStorage.setItem("language", lang);
	//alert(lang);
};

/*var english = {
	"<option value=\"en\">":"<option value=\"en\" selected=\"selected\">",
	"Notifications":"Notifications"
};

var spanish = {
	"<option value=\"es\">":"<option value=\"es\" selected=\"selected\">",
	"Notifications":"Notificaciones"
};

var french = {
	"<option value=\"fr\">":"<option value=\"fr\" selected=\"selected\">",
	"Notifications":"Des Notifications"
};

var swag = {
	"<option value=\"swag\">":"<option value=\"swag\" selected=\"selected\">",
	"Notifications":"Update Me"
};

var index_of_langs = {
	"en":english,
	"es":spanish,
	"fr":french,
	"swag":swag
};

function runLang(html){
	return html
	var lang = localStorage.getItem("language");
	var dictionary = index_of_langs[lang];

	var change_body = false;
	if(html == 'false'){
		html = document.body.innerHTML;
		change_body = true;
	}

	for(var w in dictionary){
		html = html.replace(w, dictionary[w]);
		html = html.replace(spanish[w], dictionary[w]);
		html = html.replace(french[w], dictionary[w]);
		html = html.replace(swag[w], dictionary[w]);
	}

	if(change_body){
		document.body.innerHTML = html;
	}

	return html;
}
*/
