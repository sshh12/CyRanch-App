function ArticleCardBox(header, date, iconURL, imageURL, text, link) {
    this.header = parseXSS(header);
    this.date = new Date(date);
    this.text = parseXSS(text);
    this.onclick = 'supersonic.app.openURL(\'' + link + '\')';
    this.iconURL = iconURL;
    this.imageURL = imageURL;

    this.getHTML = function() {
        return '<div class="card" onClick="' +
            this.onclick + '"><div class="item item-avatar headercolor"><img src="' +
            this.iconURL + '" /><h2>' +
            this.header + '</h2><p>' +
            this.date.toDateString() + '</p></div><div class="item item-body"><img class="full-image" src="' +
            this.imageURL + '"/><p>' +
            this.text + '</p></div></div>';
    };
}

function TextCardBox(header, date, iconURL, text, link) {
    this.header = parseXSS(header);
    this.date = new Date(date);
    this.text = parseXSS(text);
    this.onclick = 'supersonic.app.openURL(\'' + link + '\')';
    this.iconURL = iconURL;

    this.getHTML = function() {
        return '<div class="card" onClick="' +
            this.onclick + '"><div class="item item-avatar headercolor"><img src="' +
            this.iconURL + '" /><h2>' +
            this.header + '</h2><p>' +
            this.date.toDateString() + '</p></div><div class="item item-body"><p>' +
            this.text + '</p></div></div>';
    };
}

var current_cards = [];
var newslength = 0;

function addCards(cards) {
    var html = "";
    for (var i in cards) {
        current_cards.push(cards[i]);
    }
    current_cards.sort(
        function(a, b) {
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


function refreshAllContent() {
    current_cards = [];
    addCards([]);
    setNews();
    document.getElementById("cardlist").style.display = 'none';
    document.getElementById("loading_box").style.display = 'block';
}

function JSONToCards(json) {
    var cards = [];
    for (var i in json) {
        if(json[i].type === 1){
          cards.push(new ArticleCardBox(json[i].organization, json[i].date, json[i].icon, json[i].image, json[i].text, json[i].link));
        } else if(json[i].type === 2) {
          cards.push(new TextCardBox(json[i].organization, json[i].date, json[i].icon, json[i].text, json[i].link));
        }
    }
    return cards;
}

function fetchCurrentNews(source) {
    timeout(20000, getFromAPI("news/" + encodeToURL(source))).then(
        function(response) {
            response.json().then(
                function(json) {
                    addCards(JSONToCards(json));
                }
            );
        }
    ).catch(function(error) {
        //AppAlert("Error", "Unable to Connect to Server 😭");
    });
}

function setNews() {
    newslength = localStorage.getItem("newsoptions").length;
    var newsSources = JSON.parse(localStorage.getItem("newsoptions"));

    for (var n in newsSources) {
        fetchCurrentNews(n);
    }

}

function onVisibilityChangeIndex() {
    if (document.visibilityState == 'visible') {
        if (localStorage.getItem("newsoptions").length != newslength) {
            refreshAllContent();
        }
    }
}
