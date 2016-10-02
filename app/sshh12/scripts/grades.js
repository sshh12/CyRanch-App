var ErrorMessage = '<div class="card"><div class="item item-text-wrap">Looks like there\'s something wrong with your username or password. You can try to fix this by going to <b>Options -> Grades -> Type in username and password -> Tap Save</b>.</div></div>';
var ErrorMessageConnection = '<div class="card"><div class="item item-text-wrap" style="text-align:center">Unable to Connect 😞</div></div>';

function resetLocalData() {
    localStorage.setItem('username', "");
    localStorage.setItem('password', "");
    localStorage.setItem('grades', "");
}

        function(responce) {
            responce.json().then(
                function(json) {
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

function getListItemHTML(subject, per, lettr, c) {
    if (per.includes("opped as of")) {
        per = "Dropped";
        lettr = 'U';
    }

    var s = "<a class=\"item\"><i style='text-align: left' ontouchstart=\"toggle_visibility('" + c + "');\" class='icon super-chevron-down'></i>&nbsp<b>" + subject +

    if (isUndefined(per)) {
        per = "None";
        lettr = 'U';
    }
    if (lettr == 'A') {
        s += "class=\"badge badge-balanced\">";
    } else if (lettr == 'B') {
        s += "class=\"badge badge-energized\">";
    } else if (lettr == 'C') {
        s += "class=\"badge badge-assertive\">";
    } else if (lettr == 'D') {
        s += "class=\"badge badge-royal\">";
    } else if (lettr == 'U') {
        s += "class=\"badge badge-calm\">";
    } else {
        s += "class=\"badge badge-dark\">";
    }
    s += per + "</span></a>";
    return s;
}

function getListMiniHTML(subject, name, per, lettr, c) {

    if (isUndefined(per)) {
        per = "None";
        lettr = 'U';
    }


    var k = "<a style=\"display: none; font-size: 14px; color: #9c9c9c;\" class=\"item " + c + "\">&nbsp;" + name +

    if (lettr == 'A') {
        k += "class=\"badge badge-balanced\">";
    } else if (lettr == 'B') {
        k += "class=\"badge badge-energized\">";
    } else if (lettr == 'C') {
        k += "class=\"badge badge-assertive\">";
    } else if (lettr == 'D') {
        k += "class=\"badge badge-royal\">";
    } else if (lettr == 'U') {
        k += "class=\"badge badge-calm\">";
    } else {
        k += "class=\"badge badge-dark\">";
    }
    k += per + "</span></a>";
    return k;
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

                                    showhtml += getListItemHTML(subject.Name, subject.OverallAverage, subject.OverallLetterAverage, "GROUP_" + i);


                                    var assignmentKeys = Object.keys(subject.Assignments);
                                    assignmentKeys.sort(
                                        function(a, b) {
                                            return new Date(subject.Assignments[b].DateDue).getTime() - new Date(subject.Assignments[a].DateDue).getTime();
                                        }
                                    )

                                    for (var s in assignmentKeys) {
                                        var assignment = subject.Assignments[assignmentKeys[s]];
                                        showhtml += getListMiniHTML(subject.Name, assignmentKeys[s], assignment.Percent, assignment.Letter, "GROUP_" + i);
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
                        counter += 0.3;
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
