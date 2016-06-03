if(isUndefined(localStorage.getItem("CyRanchNews")) || isUndefined(localStorage.getItem("cyranchapp")) || isUndefined(localStorage.getItem("CFISDNews"))){
	localStorage.setItem('CyRanchNews', 'true');
	localStorage.setItem('cyranchapp', 'true');
	localStorage.setItem('CFISDNews', 'false');
}

function createNormalBox(header, date, iconurl, imageurl, text, onclick){
	header = parseXSS(header);
	date = parseXSS(date);
	text = parseXSS(text);
	onclick = parseXSS(onclick);
	return '<div class="card" onClick="'+onclick+'"><div class="item item-avatar headercolor"><img src="'+iconurl+'" /><h2>'+header+'</h2><p>'+date+'</p></div><div class="item item-body"><img class="full-image" src="'+imageurl+'"/><p>'+text+'</p></div></div>';
}

function createNoPictureBox(header, date, iconurl, onclick, text){
	header = parseXSS(header);
	date = parseXSS(date);
	text = parseXSS(text);
	onclick = parseXSS(onclick);
	return '<div class="card" onClick=""><div class="item item-avatar headercolor"><img src="'+iconurl+'" /><h2>'+header+'</h2><p>'+date+'</p></div><div class="item item-body"><p>'+text+'</p></div></div>';
}

function Card(html, date){
  this.html = html;
  this.date = new Date(date);
}

var settings = [localStorage.getItem("CyRanchNews"), localStorage.getItem("cyranchapp"), localStorage.getItem("CFISDNews")];
var current_cards = [];

function addCards(cards){
  var html = "";
  for(var i in cards){
    current_cards.push(cards[i]);
  }
  current_cards.sort(
    function(a, b){
      return b.date.getTime() - a.date.getTime()
    }
  );
  for (var c in current_cards) {
		html += current_cards[c].html;
	}
  document.getElementById("cardlist").innerHTML = html;
	//document.getElementById("cardlist").firstChild.textContent = ''; //I don't even know...
}

function refreshAllContent(){
  document.getElementById("cardlist").style.display = 'none';
  document.getElementById("loading_box").style.display = 'block';
  current_cards = [];
  setNews();
  document.getElementById("cardlist").style.display = 'block';
  document.getElementById("loading_box").style.display = 'none';
}

function setNews(){

  if(settings[0] == 'true'){
    timeout(5000, getFromAPI("cyranchnews1")).then(
      function(responce){
        responce.text().then(
          function(text){
            var cards = [];
            CyRanchNewsPage1 = createDocElement("CyRanchNewsPage1Body", text);
            for (var i = 0; i < 12; i++) { // CyRanchNews1
              var b = createNormalBox("CyRanchNews.com",
                                      CyRanchNewsPage1.getElementsByClassName("categorypreviewbox")[i].lastChild.previousSibling.textContent,
                                      "/icons/CyRanchMustangs.png",
                                      CyRanchNewsPage1.getElementsByClassName("categorypreviewbox")[i].firstChild.firstChild.getAttribute("src"),
                                      CyRanchNewsPage1.getElementsByClassName("categorypreviewbox")[i].firstChild.nextSibling.firstChild.textContent,
                                      'supersonic.app.openURL(\''+CyRanchNewsPage1.getElementsByClassName("categorypreviewbox")[i].firstChild.getAttribute("href")+'\');');
              cards.push(new Card(b, CyRanchNewsPage1.getElementsByClassName("categorypreviewbox")[i].lastChild.previousSibling.textContent));
        		}
            addCards(cards);
          }
        )
      }
    ).catch(function(error){
      alert(error);
    })

    timeout(5000, getFromAPI("cyranchnews2")).then(
      function(responce){
        responce.text().then(
          function(text){
            var cards = [];
            CyRanchNewsPage2 = createDocElement("CyRanchNewsPage2Body", text);
            for (var i = 0; i < 12; i++) { // CyRanchNews1
              var b = createNormalBox("CyRanchNews.com",
                                      CyRanchNewsPage2.getElementsByClassName("categorypreviewbox")[i].lastChild.previousSibling.textContent,
                                      "/icons/CyRanchMustangs.png",
                                      CyRanchNewsPage2.getElementsByClassName("categorypreviewbox")[i].firstChild.firstChild.getAttribute("src"),
                                      CyRanchNewsPage2.getElementsByClassName("categorypreviewbox")[i].firstChild.nextSibling.firstChild.textContent,
                                      'supersonic.app.openURL(\''+CyRanchNewsPage2.getElementsByClassName("categorypreviewbox")[i].firstChild.getAttribute("href")+'\');');
              cards.push(new Card(b, CyRanchNewsPage2.getElementsByClassName("categorypreviewbox")[i].lastChild.previousSibling.textContent));
        		}
            addCards(cards);
          }
        )
      }
    ).catch(function(error){
      alert(error);
    })
  }

  if(settings[1] == 'true'){
    timeout(5000, getFromAPI("appnews")).then(
      function(responce){
        responce.text().then(
          function(text){
            var cards = [];
            CyRanchAppNews = createDocElement("CyRanchAppNewsBody", text);
            for (var i = 0; i < CyRanchAppNews.getElementsByTagName("CyRanchNews").length; i++) { //CyRanchApp
              var b = createNormalBox("The Cy-Ranch App",
                                      CyRanchAppNews.getElementsByTagName("CyRanchNews")[i].getElementsByTagName("date")[0].textContent,
                                       "/icons/Developer.png",
                                       CyRanchAppNews.getElementsByTagName("CyRanchNews")[i].getElementsByTagName("pic")[0].getAttribute('link'),
                                       CyRanchAppNews.getElementsByTagName("CyRanchNews")[i].getElementsByTagName("title")[0].textContent,
                                       '');
              cards.push(new Card(b, CyRanchAppNews.getElementsByTagName("CyRanchNews")[i].getElementsByTagName("date")[0].textContent));
        		}
            addCards(cards);
          }
        )
      }
    ).catch(function(error){
      alert(error);
    })
  }

  if(settings[2] == 'true'){
    timeout(5000, getFromAPI("cfisdnews")).then(
      function(responce){
        responce.text().then(
          function(text){
            var cards = [];
            CFISDNews = createDocElement("CFISDNewsBody", text);
            for (i = 0; i < CFISDNews.getElementsByClassName("index-item").length; i++) { //CFISDNews
              var b = createNoPictureBox("CFISD.net",
                                         CFISDNews.getElementsByClassName("index-item")[i].getElementsByClassName("item-date")[0].textContent,
                                         "/icons/CFISD.png",
                                         'supersonic.app.openURL(\'http://cfisd.net/' + CFISDNews.getElementsByClassName("index-item")[i].getElementsByTagName('a')[0].getAttribute('href')+'\');',
                                         CFISDNews.getElementsByClassName("index-item")[i].firstChild.nextSibling.firstChild.nextSibling.textContent);
              cards.push(new Card(b, CFISDNews.getElementsByClassName("index-item")[i].getElementsByClassName("item-date")[0].textContent));
        		}
            addCards(cards);
          }
        )
      }
    ).catch(function(error){
      alert(error);
    })
  }
}

function onVisibilityChangeIndex() {
    if(document.visibilityState == 'visible'){
		var newSettings = [localStorage.getItem("CyRanchNews"),localStorage.getItem("cyranchapp"),localStorage.getItem("CFISDNews")];
		if(settings[0] != newSettings[0] || settings[1] != newSettings[1] || settings[2] != newSettings[2]){
      settings = newSettings;
			setNews();
		}
	}
}
