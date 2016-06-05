if(isUndefined(localStorage.getItem("ViewCyRanchNews")) || isUndefined(localStorage.getItem("ViewAppNews")) || isUndefined(localStorage.getItem("ViewCFISDNews"))){
	localStorage.setItem('ViewCyRanchNews', 'true');
	localStorage.setItem('ViewAppNews', 'true');
	localStorage.setItem('ViewCFISDNews', 'false');
}

function Card(html, date){
  this.html = html;
  this.date = new Date(date);
}

function NormalCardBox(header, date, iconURL, imageURL, text, onclick){
	this.header = parseXSS(header);
	this.date = new Date(date);
	this.text = parseXSS(text);
	this.onclick = parseXSS(onclick);
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
	this.onclick = parseXSS(onclick);
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
}

function refreshAllContent(){
  document.getElementById("cardlist").style.display = 'none';
  document.getElementById("loading_box").style.display = 'block';
  current_cards = [];
  setNews();
  document.getElementById("cardlist").style.display = 'block';
  document.getElementById("loading_box").style.display = 'none';
}

function getCardsForCyRanchNews1(text){
	var cards = [];
	CyRanchNewsPage1 = createDocElement("CyRanchNewsPage1Body", text);
	for (var i = 0; i < 12; i++) { // CyRanchNews1
		cards.push(new NormalCardBox("CyRanchNews.com",
														CyRanchNewsPage1.getElementsByClassName("categorypreviewbox")[i].lastChild.previousSibling.textContent,
														"/icons/CyRanchMustangs.png",
														CyRanchNewsPage1.getElementsByClassName("categorypreviewbox")[i].firstChild.firstChild.getAttribute("src"),
														CyRanchNewsPage1.getElementsByClassName("categorypreviewbox")[i].firstChild.nextSibling.firstChild.textContent,
														'supersonic.app.openURL(\''+CyRanchNewsPage1.getElementsByClassName("categorypreviewbox")[i].firstChild.getAttribute("href")+'\');'));
	}
	return cards;
}

function getCardsForCyRanchNews2(text){
	var cards = [];
	CyRanchNewsPage2 = createDocElement("CyRanchNewsPage2Body", text);
	for (var i = 0; i < 12; i++) { // CyRanchNews2
		cards.push(new NormalCardBox("CyRanchNews.com",
														CyRanchNewsPage2.getElementsByClassName("categorypreviewbox")[i].lastChild.previousSibling.textContent,
														"/icons/CyRanchMustangs.png",
														CyRanchNewsPage2.getElementsByClassName("categorypreviewbox")[i].firstChild.firstChild.getAttribute("src"),
														CyRanchNewsPage2.getElementsByClassName("categorypreviewbox")[i].firstChild.nextSibling.firstChild.textContent,
														'supersonic.app.openURL(\''+CyRanchNewsPage2.getElementsByClassName("categorypreviewbox")[i].firstChild.getAttribute("href")+'\');'));
	}
	return cards;
}

function getCardsForAppNews(text){
	var cards = [];
	var news = JSON.parse(text);
	for (var i in news) { //CyRanchApp
		cards.push(new NormalCardBox("The Cy-Ranch App",
																 news[i].date,
															   "/icons/Developer.png",
															   news[i].image,
															   news[i].text,
															 	 ''));
	}
	return cards;
}

function getCardsForCFISDNews(text){
	var cards = [];
	CFISDNews = createDocElement("CFISDNewsBody", text);
	for (i = 0; i < CFISDNews.getElementsByClassName("index-item").length; i++) { //CFISDNews
		cards.push(new NoImageCardBox("CFISD.net",
															 CFISDNews.getElementsByClassName("index-item")[i].getElementsByClassName("item-date")[0].textContent,
															 "/icons/CFISD.png",
															 'supersonic.app.openURL(\'http://cfisd.net/' + CFISDNews.getElementsByClassName("index-item")[i].getElementsByTagName('a')[0].getAttribute('href')+'\');',
															 CFISDNews.getElementsByClassName("index-item")[i].firstChild.nextSibling.firstChild.nextSibling.textContent));
	}
	return cards;
}

function fetchNews(apimethod, func){
	timeout(5000, getFromAPI(apimethod)).then(
		function(responce){
			responce.text().then(
				function(text){
					addCards(func(text));
				}
			);
		}
	).catch(function(error){
		alert(error);
	});
}

function setNews(){

  if(settings[0] == 'true'){
		fetchNews('cyranchnews1', getCardsForCyRanchNews1);
		fetchNews('cyranchnews2', getCardsForCyRanchNews2);
  }

  if(settings[1] == 'true'){
		fetchNews('appnews', getCardsForAppNews);
  }

  if(settings[2] == 'true'){
		fetchNews('cfisdnews', getCardsForCFISDNews);
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
