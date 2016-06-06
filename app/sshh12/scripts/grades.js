var ErrorMessage = '<div class="card"><div class="item item-text-wrap">Looks like there\'s something wrong with your username or password or you have not yet set it up. You can fix this by going to <b>Settings -> Grades -> Type in username and password -> Tap Save</b>.</div></div>';

function resetLocalData(){
	localStorage.setItem('username', "");
	localStorage.setItem('password', "");
	localStorage.setItem('grades', "");
}

function refreshContent(){
	localStorage.setItem('grades', '');
	updateGrades();
}

function toggle_visibility(cn) {
	var els = document.getElementsByClassName(cn);
	for(var i = 0; i < els.length; i++){
		if(els[i].style.display == 'block'){
			els[i].style.display = 'none';
		}
		else {
			els[i].style.display = 'block';
		}
	}
}

function getListItemHTML(name, per, lettr, c){
	var s = "<a class=\"item\" onClick=\"toggle_visibility('"+ c +"');\"><b>" + name;
	if(isUndefined(per)){
		per = "None";
		lettr = 'U';
	}
	if(lettr == 'A'){
		s += "</b><span class=\"badge badge-balanced\">";
	}
	else if(lettr == 'B'){
		s += "</b><span class=\"badge badge-energized\">";
	}
	else if(lettr == 'C'){
		s += "</b><span class=\"badge badge-assertive\">";
	}
	else if(lettr == 'D'){
		s += "</b><span class=\"badge badge-royal\">";
	}
	else if(lettr == 'U'){
	  s += "</b><span class=\"badge badge-calm\">";
	} else {
		s += "</b><span class=\"badge badge-dark\">";
	}
	s += per +"</span></a>";
	return s;
}

function getListMiniHTML(name, per, lettr, c){

	if(isUndefined(per)){
		per = "None";
		lettr = 'U';
	}

	var k = "<a style=\"display: none; font-size: 14px; color: #9c9c9c;\" class=\"item "+ c +"\">&nbsp;&nbsp;" + name;

	if(lettr == 'A'){
		k += "<span style=\"font-size: 15px;\" class=\"badge badge-balanced\">";
	}
	else if(lettr == 'B'){
		k += "<span style=\"font-size: 15px;\" class=\"badge badge-energized\">";
	}
	else if(lettr == 'C'){
		k += "<span style=\"font-size: 15px;\" class=\"badge badge-assertive\">";
	}
	else if(lettr == 'D'){
		k += "<span style=\"font-size: 15px;\" class=\"badge badge-royal\">";
	}
	else if(lettr == 'U'){
	  k += "<span style=\"font-size: 15px;\" class=\"badge badge-calm\">";
	} else {
		k += "<span style=\"font-size: 15px;\" class=\"badge badge-dark\">";
	}
	k += per +"</span></a>";
	return k;
}

var counter;
var interval;

function updateGrades(){

	var username = localStorage.getItem("username");
	var password = localStorage.getItem("password");

	if(isUndefined(username) || isUndefined(password) || username == null || password == null){
		resetLocalData();
		document.getElementById("main").innerHTML = ErrorMessage;
	} else {
		username = username.toLowerCase();
		if(password.length > 4 && username.substring(0,1) == 's' && username.length == 7 && username.substring(1, 7).match(/^[0-9]+$/) != null){
			var data = localStorage.getItem('grades');
			if(true || isUndefined(data) || data == null || data.length < 20){ //Need to Update Data

				document.getElementById("main").style.display = 'none';
				document.getElementById("loading_box").style.display = 'block';

        timeout(15000, getFromAPI("grades/" + username + "/" + encodeToURL(password))).then(
          function(responce){
            responce.json().then(
              function(json){
                localStorage.setItem('grades', JSON.stringify(data));

                var i = 0;
          			var showhtml = "<div class=\"list\">";
          			showhtml += "<div class=\"item item-divider\">This 6 Weeks</div>";
          			for(var c in json.CGrades){
          				showhtml += getListItemHTML(json.CGrades[c].Name, json.CGrades[c].OverallAverage, json.CGrades[c].OverallLetterAverage, "CLASSAKA" + i);
          				for(var s in json.CGrades[c].Assignments){
          					showhtml += getListMiniHTML(s, json.CGrades[c].Assignments[s].Percent, json.CGrades[c].Assignments[s].Letter, "CLASSAKA" + i);
          				}
          				i++;
          			}
								clearInterval(interval)
                document.getElementById("main").innerHTML = showhtml;
                document.getElementById("main").style.display = 'block';
                document.getElementById("loading_box").style.display = 'none';
              }
            )
          }
        ).catch(function(error){
          AppAlert("Error", "Unable to Connect to Server 😞");
          document.getElementById("main").innerHTML = ErrorMessage;
          document.getElementById("main").style.display = 'block';
          document.getElementById("loading_box").style.display = 'none';
        });

				counter = 0;
				interval = setInterval(
					function() {
				    counter += 5000.0 / 16000;
				    if(counter >= 100) {
				        clearInterval(interval);
				    } else {
				        document.getElementById('status').innerHTML = counter.toFixed(2) + "%";
				    }
					}, 50
				);

			}
		} else { //User Input is Incorrect
			document.getElementById("main").innerHTML = ErrorMessage;
		}
	}
}

function onVisibilityChange() {
  if(document.visibilityState == 'visible'){
		updateGrades();
	}
}
