var ErrorMessage = '<div class="card"><div class="item item-text-wrap">Looks like there\'s something wrong with your username or password. You can try to fix this by going to <b>Options -> Grades -> Type in username and password -> Tap Save</b>.</div></div>';
var ErrorMessageConnection = '<div class="card"><div class="item item-text-wrap" style="text-align:center">Unable to Connect 😞</div></div>';

function resetLocalData() {
    localStorage.setItem('username', "");
    localStorage.setItem('password', "");
    localStorage.setItem('grades', "");
}

function showStats(subject, name, grade) {
    getFromAPI("homeaccess/stats/" + encodeToURL(subject) + "/" + encodeToURL(name) + "/" + grade).then(
        function(responce) {
            responce.json().then(
                function(json) {
                    AppAlert(name, "Average: " + Math.round(json.Average, -2) + "\n%Tile: " + Math.round(json.PercentBelow, -2));
                }
            )
        }
    );
}

function toggle_visibility(name) {
    var elements = document.getElementsByClassName(name);
    for (var i in elements) {
        if (elements[i].style.display == 'block') {
            elements[i].style.display = 'none';
        } else {
            elements[i].style.display = 'block';
        }
    }
}

function ClassGradeItem(subject, percent, lettr, ident){

  if (isUndefined(percent)) {
      this.percent = "None";
      this.lettr = 'U';
  } else if (percent.includes("opped as of")) {
      this.percent = "Dropped";
      this.lettr = 'U';
  } else {
    this.percent = percent;
    this.lettr = lettr;
  }

  this.ident = ident;
  this.subject = subject;

  if (this.lettr == 'A') {
      this.badge = "balanced";
  } else if (this.lettr == 'B') {
      this.badge = "energized";
  } else if (this.lettr == 'C') {
      this.badge = "assertive";
  } else if (this.lettr == 'D') {
      this.badge = "royal";
  } else if (this.lettr == 'U') {
      this.badge = "calm";
  } else {
      this.badge = "dark";
  }

  this.getHTML = function(){
    return "<a class=\"item\"><i style='text-align: left' class='icon super-chevron-down'></i>&nbsp<b ontouchstart=\"toggle_visibility('" + this.ident + "');\">" + this.subject +
           "</b><span ontouchstart=\"showStats('" + this.subject + "','" + this.subject + " AVG" + "', '" + this.percent.replace("%", "") + "')\" class=\"badge badge-" + this.badge +
           "\">" + this.percent + "</span></a>";
	};
}

function AssignmentGradeItem(subject, name, percent, lettr, ident){

  if (isUndefined(percent)) {
      this.percent = "None";
      this.lettr = 'U';
  } else {
    this.percent = percent;
    this.lettr = lettr;
  }

  this.name = name;
  this.subject = subject;
  this.ident = ident;

  if (this.lettr == 'A') {
      this.badge = "balanced";
  } else if (this.lettr == 'B') {
      this.badge = "energized";
  } else if (this.lettr == 'C') {
      this.badge = "assertive";
  } else if (this.lettr == 'D') {
      this.badge = "royal";
  } else if (this.lettr == 'U') {
      this.badge = "calm";
  } else {
      this.badge = "dark";
  }

  this.getHTML = function(){
    return "<a style=\"display: none; font-size: 14px; color: #9c9c9c;\" class=\"item " + this.ident + "\">&nbsp;" + this.name +
           "<span style=\"font-size: 15px;\" ontouchstart=\"showStats('" + this.subject + "','" + this.name + "', '" + this.percent.replace("%", "") + "')\" class=\"badge badge-" + this.badge +
           "\">" + this.percent + "</span></a>";
	};

}

var counter;
var interval;

function updateGrades() {

    var username = localStorage.getItem("username");
    var password = localStorage.getItem("password");

    if (isUndefined(username) || isUndefined(password) || username === null || password === null) {
        resetLocalData();
        document.getElementById("main").innerHTML = ErrorMessage;
    } else {
        username = username.toLowerCase();
        if (password.length > 4 && username.substring(0, 1) == 's' && username.length === 7 && username.substring(1, 7).match(/^[0-9]+$/) !== null) {
            var data = localStorage.getItem('grades');
            if (isUndefined(data) || data === null || data.length < 20) { //Need to Update Data

                document.getElementById("main").style.display = 'none';
                document.getElementById("loading_box").style.display = 'block';

                var formData = new FormData();
                formData.append("password", encodeToURL(password));

                timeout(20000, postFromAPI("homeaccess/" + username, formData)).then(
                    function(responce) {
                        responce.json().then(
                            function(json) {

                                localStorage.setItem('grades', JSON.stringify(json));
                                var i = 0;
                                var showhtml = "<div class=\"list\">";
                                showhtml += "<div class=\"item item-divider\">This 6 Weeks</div>";

                                var cgradesKeys = Object.keys(json.CGrades);
                                cgradesKeys.sort(
                                    function(a, b) {
                                        return json.CGrades[a]["Name"].toLowerCase() > json.CGrades[b]["Name"].toLowerCase() ? 1 : -1;
                                    }
                                )

                                for (var c in cgradesKeys) {

                                    var subject = json.CGrades[cgradesKeys[c]];

                                    showhtml += new ClassGradeItem(subject.Name, subject.OverallAverage, subject.OverallLetterAverage, "GROUP_" + i).getHTML();

                                    if (Object.keys(subject.Assignments).length >= 1) {

                                        var assignmentKeys = Object.keys(subject.Assignments);
                                        assignmentKeys.sort(
                                            function(a, b) {
                                                return new Date(subject.Assignments[b].DateDue).getTime() - new Date(subject.Assignments[a].DateDue).getTime();
                                            }
                                        )

                                        for (var s in assignmentKeys) {
                                            var assignment = subject.Assignments[assignmentKeys[s]];
                                            showhtml += new AssignmentGradeItem(subject.Name, assignmentKeys[s], assignment.Percent, assignment.Letter, "GROUP_" + i).getHTML();
                                        }

                                    }
                                    i++;
                                }

                                clearInterval(interval);
                                document.getElementById("main").innerHTML = showhtml;
                                document.getElementById("main").style.display = 'block';
                                document.getElementById("loading_box").style.display = 'none';
                            }
                        );
                    }
                ).catch(function(error) {
                    clearInterval(interval);
                    AppAlert("Error", "Unable to Download Grades 😞");
                    document.getElementById("main").innerHTML = ErrorMessageConnection;
                    document.getElementById("main").style.display = 'block';
                    document.getElementById("loading_box").style.display = 'none';
                });

                counter = 0;
                interval = setInterval(
                    function() {
                        counter += 0.25;
                        if (counter >= 100) {
                            clearInterval(interval);
                            document.getElementById('status').innerHTML = "Something Went Wrong...";
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
    if (document.visibilityState == 'visible') {
        updateGrades();
    }
}
