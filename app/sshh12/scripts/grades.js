var ErrorMessage = '<div class="card"><div class="item item-text-wrap">Looks like there\'s something wrong with your username or password. You can try to fix this by going to <b>Options -> Grades -> Type in username and password -> Tap Save</b>.</div></div>';
var ErrorMessageConnection = '<div class="card"><div class="item item-text-wrap" style="text-align:center">Unable to Connect 😞</div></div>';

function showStats(subject, name, grade) {
    getFromAPI("homeaccess/statistics/" + encodeToURL(subject) + "/" + encodeToURL(name) + "/" + grade).then(
        function(responce) {
            responce.json().then(
                function(json) {
                    AppAlert(name, "Average: " + Math.round(json.average, -2) +
                                   "\n%Tile: " + Math.round(json.percentile, -2) +
                                   "\n# Unique: " + json.totalcount);
                }
            );
        }
    );
}

function toggleVisibility(name) {
    var elements = document.getElementsByClassName(name);
    for (var i in elements) {
        if (elements[i].style.display == 'block') {
            elements[i].style.display = 'none';
        } else {
            elements[i].style.display = 'block';
        }
    }
}

function letterToColor(lettr) {
    if (lettr == 'A') {
        return "balanced";
    } else if (lettr == 'B') {
        return "energized";
    } else if (lettr == 'C') {
        return "assertive";
    } else if (lettr == 'D') {
        return "royal";
    } else if (lettr == 'U') {
        return "calm";
    } else {
        return "dark";
    }
}

function ClassGradeItem(subject, percent, lettr, ident) {

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

    this.badge = letterToColor(this.lettr);

    this.getHTML = function() {
        return "<a class=\"item\"><i ontouchstart=\"toggleVisibility('" + this.ident + "');\" style='text-align: left' class='icon super-chevron-down'></i>&nbsp&nbsp<b style=\"font-size:110%\" ontouchstart=\"toggleVisibility('" + this.ident + "');\">" + this.subject +
            "</b><span ontouchstart=\"showStats('" + this.subject + "','" + this.subject + " AVG" + "', '" + this.percent.replace("%", "") + "')\" class=\"badge badge-" + this.badge +
            "\">" + this.percent + "</span></a>";
    };
}

function AssignmentGradeItem(subject, name, percent, lettr, gradetype, ident) {

    if (isUndefined(percent) || percent.length < 2) {
        this.percent = "None";
        this.lettr = 'U';
    } else {
        this.percent = percent;
        this.lettr = lettr;
    }

    this.gradetype = gradetype.split(" ")[0];
    this.name = name;
    this.subject = subject;
    this.ident = ident;

    this.badge = letterToColor(this.lettr);

    this.getHTML = function() {
        return "<a style=\"display: none; font-size: 14px; color: #9c9c9c;\" class=\"item " + this.ident + "\">&nbsp;" + this.name +
            "&nbsp<sup>(" + this.gradetype + ")</sup><span style=\"font-size: 15px;\" ontouchstart=\"showStats('" + this.subject + "','" + this.name + "', '" + this.percent.replace("%", "") + "')\" class=\"badge badge-" + this.badge +
            "\">" + this.percent + "</span></a>";
    };

}

function CategoryGradeItem(category, weight, percent, lettr, ident) {

    if (isUndefined(percent) || percent.length < 2) {
        this.percent = "None";
        this.lettr = 'U';
    } else {
        this.percent = percent;
        this.lettr = lettr;
    }

    this.category = category;
    this.ident = ident;
    this.weight = weight;

    this.badge = letterToColor(this.lettr);

    this.getHTML = function() {
        return "<a style=\"display: none; font-size: 14px; color: #6a6a6a; font-style: italic;\" class=\"item " + this.ident + "\">&nbsp;All " + this.category +
            "&nbsp<sup>(Weight " + this.weight + ")</sup><span style=\"font-size: 15px;\" class=\"badge badge-" + this.badge +
            "\">" + this.percent + "</span></a>";
    };

}

function ReportCardItem(json) {

    this.classname = json.name;
    this.averages = json.averages;
    this.teacher = json.teacher;
    this.exams = json.exams;
    this.sem = json.semesters;

    this.getRowHTML = function(content) {
        var contentHTML = "";
        for (var m in content) {
            var avg = content[m].average;
            var lettr = content[m].letter;
            if (avg <= 0) {
                avg = "-";
                lettr = "U";
            }
            contentHTML += "<div class=\"col\"><button class=\"button button-block button-" + letterToColor(lettr) + "\">" + avg + "</button></div>";
        }
        return contentHTML;
    };

    this.getHTML = function() {

        var avgHTML = this.getRowHTML(this.averages);
        var examHTML = this.getRowHTML(this.exams);
        var semHTML = this.getRowHTML(this.sem);

        return "<a class=\"item\" href=\"#\"><b>" + this.classname + "</b> " + this.teacher +
            "<br><br><span class='sep'>Six Weeks</span><div class=\"row\">" + avgHTML +
            "</div><span class='sep'>Finals</span><div class=\"row\">" + examHTML +
            "</div><span class='sep'>Semesters</span><div class=\"row\">" + semHTML + "</div></a>";
    };

}

function setFromClassworkJson(json) {

    var showhtml;

    if (json.status === 'success') {

        localStorage.setItem('classwork', JSON.stringify(json));

        delete json.status;

        var i = 0;
        showhtml = "<div class=\"list\">";
        showhtml += "<div class=\"item item-divider\">Current Classwork</div>";

        var classworkKeys = Object.keys(json);
        classworkKeys.sort(
            function(a, b) {
                return json[a].name.toLowerCase() > json[b].name.toLowerCase() ? 1 : -1;
            }
        );

        for (var c in classworkKeys) {

            var subject = json[classworkKeys[c]];

            showhtml += new ClassGradeItem(subject.name, subject.overallavg, subject.letter, "GROUP_" + i).getHTML();

            if (Object.keys(subject.assignments).length >= 1) {
                var assignmentKeys = Object.keys(subject.assignments);
                assignmentKeys.sort(
                    function(a, b) {
                        return new Date(subject.assignments[b].datedue).getTime() - new Date(subject.assignments[a].datedue).getTime();
                    }
                );

                for (var s in assignmentKeys) {
                    var assignment = subject.assignments[assignmentKeys[s]];
                    showhtml += new AssignmentGradeItem(subject.name, assignmentKeys[s], assignment.grade, assignment.letter, assignment.gradetype, "GROUP_" + i).getHTML();
                }

            }

            for (var category in subject.categories) {
                var cat = subject.categories[category];
                showhtml += new CategoryGradeItem(category, cat.weight, cat.grade, cat.letter, "GROUP_" + i).getHTML();
            }

            i++;
        }

        showhtml += "<div class=\"item item-divider\">Report Card</div>" +
            "<div id=\"reportcard\"><a class=\"item item-icon-right\" onClick=\"updateReportCard()\" href=\"#\">Download<i class=\"icon super-ios-cloud-download\"></i></a></div>";

    } else if (json.status === 'login_failed') {
        AppAlert("Error", "Login Failed");
        showhtml = "";
    } else if (json.status === 'connection_failed') {
        AppAlert("Error", "Unable to connect to HomeAccessCenter");
        showhtml = "";
    }

    document.getElementById("main").innerHTML = showhtml;
    document.getElementById("main").style.display = 'block';
    document.getElementById("loading_box").style.display = 'none';
    clearInterval(interval);
}

function setFromReportCardJSON(json) {
    if (json.status === 'success') {

        delete json.status;

        var classkeys = Object.keys(json);
        classkeys.sort(
            function(a, b) {
                return json[a].name.localeCompare(json[b].name);
            }
        );

        var newHTML = "";
        for (var i in classkeys) {
            newHTML += new ReportCardItem(json[classkeys[i]]).getHTML();
        }
        document.getElementById('reportcard').innerHTML = newHTML;

    }
}

var counter, interval;

function startCounter() {
    counter = 0;
    interval = setInterval(
        function() {
            counter += .25;
            if (counter >= 100) {
                clearInterval(interval);
                document.getElementById('status').innerHTML = "Something Went Wrong...";
            } else {
                document.getElementById('status').innerHTML = counter.toFixed(2) + "%";
            }
        }, 50
    );
}

function updateReportCard() {

    var username = localStorage.getItem("username").toLowerCase();
    var password = localStorage.getItem("password");

    document.getElementById("main").style.display = 'none';
    document.getElementById("loading_box").style.display = 'block';

    var formData = new FormData();
    formData.append("password", encodeToURL(password));
    formData.append("concent", "true");
    timeout(20000, postFromAPI("homeaccess/reportcard/" + username, formData)).then(
        function(responce) {
            responce.json().then(
                function(json) {
                    clearInterval(interval);
                    setFromReportCardJSON(json);
                    document.getElementById("main").style.display = 'block';
                    document.getElementById("loading_box").style.display = 'none';
                }
            );
        }
    ).catch(function(error) {
        clearInterval(interval);
        AppAlert("Error", "Unable to Download Report Card 😞");
        document.getElementById("main").style.display = 'block';
        document.getElementById("loading_box").style.display = 'none';
    });

    startCounter();
}

function updateGrades() {

    var legal = localStorage.getItem("legal") == "true";
    var data = localStorage.getItem('classwork');
    var username = localStorage.getItem("username").toLowerCase();
    var password = localStorage.getItem("password");

    if (password.length > 4 && username.substring(0, 1) == 's' && username.length === 7 && username.substring(1, 7).match(/^[0-9]+$/) !== null) {

        if (!legal) {

            var options = {
                message: "To provide assignment averages, percentiles, and other features, the app requires that you accept the policies outlined in the legal section of the app.",
                buttonLabels: ["Yup (I accept)", "No!"]
            };

            supersonic.ui.dialog.confirm("Legal", options).then(function(index) {
                if (index == 0) {
                    localStorage.setItem("legal", "true");
                    updateGrades();
                } else {
                    AppAlert("Error", "You must accept to access your grades.");
                }
            });

        } else {

            if (data.length < 10) { //Need to Update Data

                document.getElementById("main").style.display = 'none';
                document.getElementById("loading_box").style.display = 'block';

                var formData = new FormData();
                formData.append("password", encodeToURL(password));
                formData.append("concent", "true");
                timeout(20000, postFromAPI("homeaccess/classwork/" + username, formData)).then(
                    function(responce) {
                        responce.json().then(
                            function(json) {
                                setFromClassworkJson(json);
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

                startCounter();

            } else {
                setFromClassworkJson(JSON.parse(data)); //Use Old
            }
        }

    } else { //User Input is Incorrect
      document.getElementById("main").innerHTML = ErrorMessage;
    }
}

function onVisibilityChange() {
    if (document.visibilityState == 'visible') {
        updateGrades();
    }
}
