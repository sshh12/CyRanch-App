var ErrorMessage = '<div class="card"><div class="item item-text-wrap">Looks like there\'s something wrong with your username or password. You can try to fix this by going to <b>Options -> Grades -> Type in username and password -> Tap Save</b>.</div></div>';
var ErrorMessageConnection = '<div class="card"><div class="item item-text-wrap" style="text-align:center">Unable to Connect 😞</div></div>';

function showStats(subject, name, grade) {
    getFromAPI("homeaccess/stats/" + encodeToURL(subject) + "/" + encodeToURL(name) + "/" + grade).then(
        function(responce) {
            responce.json().then(
                function(json) {
                    AppAlert(name, "Average: " + Math.round(json.Average, -2) + "\n%Tile: " + Math.round(json.PercentBelow, -2));
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
        return "<a class=\"item\"><i style='text-align: left' class='icon super-chevron-down'></i>&nbsp<b ontouchstart=\"toggleVisibility('" + this.ident + "');\">" + this.subject +
            "</b><span ontouchstart=\"showStats('" + this.subject + "','" + this.subject + " AVG" + "', '" + this.percent.replace("%", "") + "')\" class=\"badge badge-" + this.badge +
            "\">" + this.percent + "</span></a>";
    };
}

function AssignmentGradeItem(subject, name, percent, lettr, ident) {

    if (isUndefined(percent) || percent.length < 2) {
        this.percent = "None";
        this.lettr = 'U';
    } else {
        this.percent = percent;
        this.lettr = lettr;
    }

    this.name = name;
    this.subject = subject;
    this.ident = ident;

    this.badge = letterToColor(this.lettr);

    this.getHTML = function() {
        return "<a style=\"display: none; font-size: 14px; color: #9c9c9c;\" class=\"item " + this.ident + "\">&nbsp;" + this.name +
            "<span style=\"font-size: 15px;\" ontouchstart=\"showStats('" + this.subject + "','" + this.name + "', '" + this.percent.replace("%", "") + "')\" class=\"badge badge-" + this.badge +
            "\">" + this.percent + "</span></a>";
    };

}

function ReportCardItem(classname, averages) {

    this.classname = classname;
    this.averages = averages;

    this.getHTML = function() {
        var avgHTML = "";
        for (var m in this.averages) {
            var avg = this.averages[m].average;
            var lettr = this.averages[m].letter;
            if (avg.length < 1) {
                avg = "?";
                lettr = "U";
            }
            avgHTML += "<div class=\"col\"><button class=\"button button-block button-" + letterToColor(lettr) + "\">" + avg + "</button></div>";
        }
        return "<a class=\"item\" href=\"#\"><b>" + this.classname + "</b><div class=\"row\">" + avgHTML + "</div></a>";
    };

}

function setFromClassworkJson(json) {
    var i = 0;
    var showhtml = "<div class=\"list\">";
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
                showhtml += new AssignmentGradeItem(subject.name, assignmentKeys[s], assignment.grade, assignment.letter, "GROUP_" + i).getHTML();
            }

        }
        i++;
    }


    showhtml += "<div class=\"item item-divider\">Report Card</div>" +
        "<div id=\"reportcard\"><a class=\"item item-icon-right\" onClick=\"updateReportCard()\" href=\"#\">Download<i class=\"icon super-ios-cloud-download\"></i></a></div>";

    document.getElementById("main").innerHTML = showhtml;
    document.getElementById("main").style.display = 'block';
    document.getElementById("loading_box").style.display = 'none';
    clearInterval(interval);
}

function setFromReportCardJSON(json) {
    var newHTML = "";
    for (var classid in json) {
        newHTML += new ReportCardItem(json[classid].name, json[classid].averages).getHTML();
    }
    document.getElementById('reportcard').innerHTML = newHTML;
}

var counter;
var interval;

function startCounter() {
    counter = 0;
    interval = setInterval(
        function() {
            counter += 0.5;
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

    var username = localStorage.getItem("username").toLowerCase();
    var password = localStorage.getItem("password");

    if (password.length > 4 && username.substring(0, 1) == 's' && username.length === 7 && username.substring(1, 7).match(/^[0-9]+$/) !== null) {

        var data = localStorage.getItem('classwork');

        if (data.length < 10) { //Need to Update Data

            document.getElementById("main").style.display = 'none';
            document.getElementById("loading_box").style.display = 'block';

            var formData = new FormData();
            formData.append("password", encodeToURL(password));
            timeout(20000, postFromAPI("homeaccess/classwork/" + username, formData)).then(
                function(responce) {
                    responce.json().then(
                        function(json) {
                            localStorage.setItem('classwork', JSON.stringify(json));
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
    } else { //User Input is Incorrect
        document.getElementById("main").innerHTML = ErrorMessage;
    }

}

function onVisibilityChange() {
    if (document.visibilityState == 'visible') {
        updateGrades();
    }
}
