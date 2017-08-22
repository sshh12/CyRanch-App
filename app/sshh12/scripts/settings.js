function getDeviceInfo(){
	return "Platfrom: " + device.platform +
				 "\nID: " + device.uuid +
				 "\nCordova: " + device.cordova +
				 "\nServer: " + window.SVR_ADDRESS;
}

function resetStorage(){
	localStorage.setItem('faculty_json', '');

	localStorage.setItem('username', '');
	document.getElementById('username').value = '';
	localStorage.setItem('password', '');
	document.getElementById('password').value = '';
}

document.getElementById("username").value = localStorage.getItem("username");
document.getElementById("password").value = localStorage.getItem("password");

function setNewsSources(){
	var news = JSON.parse(localStorage.getItem("newsoptions"));
	var newsHTML = "";
	for(var n in news){
		newsHTML += "<a class=\"item item-avatar item-toggle\" href=\"#\"><img src=\"" + news[n] + "\"><h2>" + n +"</h2><p>Official</p><label class=\"toggle toggle-assertive\"><input type=\"checkbox\" onClick=\"removeNewsSource('" + n + "')\"><div class=\"track\"><div class=\"handle\"></div></div></label></a>";
	}
	document.getElementById('news').innerHTML = newsHTML;
}

function removeNewsSource(name){
	var news = JSON.parse(localStorage.getItem("newsoptions"));
	delete news[name];
	localStorage.setItem("newsoptions", JSON.stringify(news));
	setNewsSources();
}

function addNewsSourceFromSelect(){
	var value = document.getElementById('newNewsSources').value;
	document.getElementById('newNewsSources').value = 'none';

	var news = JSON.parse(localStorage.getItem("newsoptions"));
	news[value] = allNewsSources[value];
	localStorage.setItem("newsoptions", JSON.stringify(news));

	setNewsSources();
}

var allNewsSources;
timeout(10000, getFromAPI("news/list")).then(
	function(response){
		response.json().then(
			function(json){
				allNewsSources = json;
				var selectHTML = "<option value='none'>...</option>";
				for(var org in json){
					selectHTML += "<option value=\"" + org +"\">" + org + "</option>";
				}
				document.getElementById('newNewsSources').innerHTML = selectHTML;
			}
		);
	}
).catch(function(error){
	//AppAlert("Error", "Unable to get other new sources! 😞");
});

setNewsSources();

supersonic.app.splashscreen.hide();
