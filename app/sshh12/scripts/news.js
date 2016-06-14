function NormalCardBox(header, date, iconURL, imageURL, text, onclick){
	this.header = parseXSS(header);
	this.date = new Date(date);
	this.text = parseXSS(text);
	this.onclick = onclick;
	this.iconURL = iconURL;
	this.imageURL = imageURL;

	this.getHTML = function(){
		return '<div class="card" onClick="' +
						this.onclick + '"><div class="item item-avatar headercolor"><img src="' +
						this.iconURL + '" /><h2>' +
						this.header + '</h2><p>' +
						this.date.toDateString() + '</p></div><div class="item item-body"><img class="full-image" src="' +
						this.imageURL + '"/><p>' +
						this.text + '</p></div></div>';
	};
}

function NoImageCardBox(header, date, iconURL, onclick, text){
	this.header = parseXSS(header);
	this.date = new Date(date);
	this.text = parseXSS(text);
	this.onclick = onclick;
	this.iconURL = iconURL;

	this.getHTML = function(){
		return '<div class="card" onClick=""><div class="item item-avatar headercolor"><img src="' +
						this.iconURL + '" /><h2>' +
						this.header + '</h2><p>' +
						this.date.toDateString() + '</p></div><div class="item item-body"><p>' +
						this.text + '</p></div></div>';
	};
}

var settings = [localStorage.getItem("ViewCyRanchNews"), localStorage.getItem("ViewAppNews"), localStorage.getItem("ViewCFISDNews")];
var current_cards = [];

function addCards(cards){
  var html = "";
  for(var i in cards){
    current_cards.push(cards[i]);
  }
  current_cards.sort(
    function(a, b){
      return b.date.getTime() - a.date.getTime();
    }
  );
  for (var c in current_cards) {
		html += current_cards[c].getHTML();
	}
  document.getElementById("cardlist").innerHTML = html;
	document.getElementById("cardlist").style.display = 'block';
  document.getElementById("loading_box").style.display = 'none';
}

function refreshAllContent(){
  current_cards = [];
	addCards([]);
  setNews();
	document.getElementById("cardlist").style.display = 'none';
  document.getElementById("loading_box").style.display = 'block';
}

function parserCyRanchNews(text, source, icon){
	var cards = [];
	CyRanchNewsPage = createDocElement("CyRanchNewsPage", text);
	for (var i = 0; i < 12; i++) { // CyRanchNews1
		cards.push(new NormalCardBox(source,
														CyRanchNewsPage.getElementsByClassName("categorypreviewbox")[i].lastChild.previousSibling.textContent,
														icon,
														CyRanchNewsPage.getElementsByClassName("categorypreviewbox")[i].firstChild.firstChild.getAttribute("src"),
														CyRanchNewsPage.getElementsByClassName("categorypreviewbox")[i].firstChild.nextSibling.firstChild.textContent,
														'supersonic.app.openURL(\''+CyRanchNewsPage.getElementsByClassName("categorypreviewbox")[i].firstChild.getAttribute("href")+'\');'));
	}
	return cards;
}

function parserJSON(text, source, icon){
	var cards = [];
	var news = JSON.parse(text);
	for (var i in news) { //CyRanchApp
		cards.push(new NormalCardBox(source, news[i].date, icon, news[i].image, news[i].text, ''));
	}
	return cards;
}

function parserCFISDNews(text, source, icon){
	var cards = [];
	CFISDNews = createDocElement("CFISDNewsBody", text);
	for (i = 0; i < CFISDNews.getElementsByClassName("index-item").length; i++) { //CFISDNews
		cards.push(new NoImageCardBox(source,
															 CFISDNews.getElementsByClassName("index-item")[i].getElementsByClassName("item-date")[0].textContent,
															 icon,
															 'supersonic.app.openURL(\'http://cfisd.net/' + CFISDNews.getElementsByClassName("index-item")[i].getElementsByTagName('a')[0].getAttribute('href')+'\');',
															 CFISDNews.getElementsByClassName("index-item")[i].firstChild.nextSibling.firstChild.nextSibling.textContent));
	}
	return cards;
}

function fetchNews(apimethod, parser, source, icon){
	timeout(6000, getFromAPI(apimethod)).then(
		function(responce){
			responce.text().then(
				function(text){
					addCards(parser(text, source, icon));
				}
			);
		}
	).catch(function(error){
		AppAlert("Error", "Unable to Connect to Server 😭");
	});
}

function setNews(){

  if(settings[0] == 'true'){
		fetchNews('cyranchnews1', parserCyRanchNews, "CyRanchNews.com", "/icons/CyRanchMustangs.png");
		fetchNews('cyranchnews2', parserCyRanchNews, "CyRanchNews.com", "/icons/CyRanchMustangs.png");
  }

  if(settings[1] == 'true'){
		fetchNews('appnews', parserJSON, "The Cy-Ranch App", "/icons/Developer.png");
  }

  if(settings[2] == 'true'){
		fetchNews('cfisdnews', parserCFISDNews, "CFISD.net", "/icons/CFISD.png");
	}

}

function onVisibilityChangeIndex() {
    if(document.visibilityState == 'visible'){
		var newSettings = [localStorage.getItem("ViewCyRanchNews"), localStorage.getItem("ViewAppNews"), localStorage.getItem("ViewCFISDNews")];
		for(var s in settings){
			if(settings[s] != newSettings[s]){
				settings = newSettings;
				refreshAllContent();
				break;
			}
		}
	}
}
