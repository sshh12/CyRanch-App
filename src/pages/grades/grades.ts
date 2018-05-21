import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular';

import { Http, Headers, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { Globals } from '../../app/globals';

import { CalculatorPage } from '../grades/calculator';

// -Grade Objects-
class AssignmentGrade {
  date: string;
  datedue: string;
  grade: string;
  gradetype: string;
  letter: string;
}

class SubjectGrade {
  name: string;
  honors: boolean;
  letter: string;
  overallavg: string;
  assignments: AssignmentGrade[];
}

export class SubjectReportCard {
  name: string;
  exams: any[];
  averages: any[];
  semesters: any[];
  teacher: string;
  room: string;
}
// ---------------

@Component({
  selector: 'page-grades',
  templateUrl: 'grades.html'
})
export class GradesPage {

  gradeType: string;
  loading: boolean;
  classList: object;

  currentGrades: SubjectGrade[];
  reportCardGrades: SubjectReportCard[];
  lastUpdated: Date;

  transcript: any = {};
  gpa: number;
  percentile: number;

  constructor(public navCtrl: NavController,
              public events: Events,
              private http: Http,
              private storage: Storage,
              public alertCtrl: AlertController,
              public toastCtrl: ToastController) {

    // Defaults
    this.gradeType = "current";
    this.loading = false;
    this.currentGrades = [];

    // Handle current grade data
    this.events.subscribe('grades:current', grades => {

      console.log(grades);

      if (grades.status == 'success') {

        this.lastUpdated = grades._updatedDate;

        this.currentGrades = [];

        this.storage.set('grades:current', grades);

        let current: SubjectGrade[] = grades.grades;

        for (let subject of current) {

          // Sort by date and assign
          let grades: AssignmentGrade[] = subject.assignments;
          grades.sort((a: AssignmentGrade, b: AssignmentGrade) => {
            return (new Date(b.datedue)).getTime() - (new Date(a.datedue)).getTime();
          })
          subject.assignments = grades;

        }

        this.currentGrades = current;

      } else {

        // Error dialog
        this.showServerDialog(grades.status);

      }

      this.loading = false;

    });

    // Handle reportcard grade data
    this.events.subscribe('grades:reportcard', reportcard => {

      console.log(reportcard);

      if (reportcard.status == 'success') {

        this.storage.set('grades:reportcard', reportcard);

        this.reportCardGrades = reportcard.reportcard;

      } else {

        this.showServerDialog(reportcard.status);

      }

      this.loading = false;

    });


    // Handle transcript data
    this.events.subscribe('grades:transcript', transcript => {

      console.log(transcript);

      if (transcript.status == 'success') {

        this.storage.set('grades:transcript', transcript);

        this.gpa = transcript.gpa.value;
        this.percentile = Math.ceil(transcript.gpa.rank / transcript.gpa.class_size * 100);

        this.transcript = transcript;

      } else {

        // Error dialog
        this.showServerDialog(transcript.status);

      }

      this.loading = false;

    });

    // -Fetch grades (if exist) from memory-
    this.storage.get('grades:current').then((grades) => {
      if (grades) {
        this.events.publish('grades:current', grades);
      }
    });

    this.storage.get('grades:reportcard').then((reportcard) => {
      if (reportcard) {
        this.events.publish('grades:reportcard', reportcard);
      }
    });

    this.storage.get('grades:transcript').then((transcript) => {
      if (transcript) {
        this.events.publish('grades:transcript', transcript);
      }
    });
    // -------------------------------------

    // Hardcoded class -> subject classifier
    this.classList = {
      "socialstudies": ["hist", "gov", "macro eco", "street law", "human geog", "geog", "wd area", "economics"],
      "art": ["treble", "clarinet", " orch", "art", "band", "animation", "theater", "bnd ", "orchest", "aud vid", "chrl ", "music", "choir", "a/v", "av pro", "voc ens", "symph", "th. pro", " strings"],
      "english": ["journl ", "journal", "eng ", "creative write", "english", "debate"],
      "science": ["med term", "envir", "forensics", "chemsitry", "phys ", "chemistry", "phy/chem", "web tech", "tch sys", "livestock", "electr", "vet med", "wldlif fish eco", "prof comm", "sci", "robot", "physics", "antmy", "physlgy", "biology", "sociology", "animal", "psychology", "chem ", "bio ", "medical", "prin ag fd nt r", "food tech", "com prog"],
      "math": ["geom", "cal-", "bank financ", "calc", "geometry", "pre cal", "algebra", "statistics", "alg ", "accounting"],
      "language": ["span iv", "spanish", "french", "latin", "german"],
      "sports": ["ath ", "athletics", "phys ed", "athlet", "cheerleading", "dance", "sports"]
    };

  }

  /**
   * Displays dialog
   * @param {string} status - status to display
   */
  showServerDialog(status: string) {

    if (status == 'login_failed') {

      this.toastCtrl.create({
        message: 'Your login didn\'t work 😞',
        position: 'top',
        duration: 3000
      }).present();

    } else if(status == 'connection_failed'){

      this.toastCtrl.create({
        message: 'Unable to connect to HomeAccessCenter 😞',
        position: 'top',
        duration: 3000
      }).present();

    } else if(status == 'server_error'){

      this.toastCtrl.create({
        message: 'The server encoutered an error 😞',
        position: 'top',
        duration: 3000
      }).present();

    } else {

      this.toastCtrl.create({
        message: 'Oops something\'s wrong... 😞',
        position: 'top',
        duration: 3000
      }).present();

    }

  }

  /**
   * Loads Grades
   * @param {string} gradeType - type of grade to download
   * @param {Function?} callback - to run after grades are downloaded
   */
  loadGrades(gradeType: string, callback?) {

    this.storage.get('grades:username').then((username) => {
      this.storage.get('grades:password').then((password) => {

        this.loading = true;

        if (!this.validCreds(username, password)) {
          this.toastCtrl.create({
            message: 'Invalid username or password',
            position: 'top',
            duration: 3000
          }).present();
          this.loading = false;
          if (callback) {
            callback();
          }
          return;
        }

        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        username = username.toLowerCase(); // Sxxxxxx -> sxxxxxx

        this.http.post(Globals.SERVER + '/api/' + gradeType + '/' + username, JSON.stringify({ password: password }), options).subscribe(data => {

          if (callback) {
            callback();
          }
          let json = data.json();
          json._updatedDate = new Date();
          this.events.publish('grades:' + gradeType, json);

        },
          error => {
            this.loading = false;
            this.toastCtrl.create({
              message: 'A network error occured 😢',
              position: 'top',
              duration: 3000
            }).present();
            if (callback) {
              callback();
            }
          }
        );

      });
    });

  }

  /**
   * Refreshes grades
   * @param {Refresher?} refresher - disable spinny thing when complete
   */
  refreshCurrent(refresher?) {
    if (refresher) {
      this.loadGrades(this.gradeType, () => refresher.complete());
    } else {
      this.loadGrades(this.gradeType);
    }
  }

  /**
   * Opens the assignments for a class
   * @param {SubjectGrade} subject - the class to view
   */
  openClassGrades(subject: SubjectGrade) {
    this.navCtrl.push(AssignmentsPage, { subject: subject });
  }

  /**
   * Opens legal page
   * @param {Fab} fab - the fab button
   */
  openLegal(fab) {
    fab.close();
    this.navCtrl.push(LegalPage);
  }

  /**
   * Finds matching color
   * @param {string} letter - letter grade
   * @returns {string} color/style
   */
  getColor(letter: string): string {
    if (letter == 'A') {
      return 'great';
    } else if (letter == 'B') {
      return 'ok';
    } else if (letter == 'C') {
      return 'poor';
    } else if (letter == 'Z') {
      return 'zero';
    } else if (letter == 'U' || letter === '') {
      return 'none';
    } else {
      return 'bad';
    }
  }

  /**
   * Finds matching color
   * @param {Number} percentile - user's percentile
   * @returns {string} color/style
   */
  getColorRank(percentile: number): string {
    if (percentile <= 10) {
      return 'great';
    } else if (percentile <= 40) {
      return 'ok';
    } else if (percentile <= 60) {
      return 'poor';
    } else {
      return 'bad';
    }
  }

  /**
   * Gets class type
   * @param {string} name - the class's name
   * @returns {string} color/style
   */
  getClassType(name: string): string {
    name = name.toLowerCase();
    for (let classType of Object.keys(this.classList)) {
      let kwords = this.classList[classType];
      for (let word of kwords) {
        if (name.includes(word)) {
          return classType;
        }
      }
    }
    return "other";
  }

  /**
   * Fixes percent string
   * @param {string} percent - original string
   * @returns {string} fixed string
   */
  fixPercent(percent: string): string {
    if (!percent || percent == '' || percent == '0') {
      return '-';
    }
    return percent;
  }

  /**
   * Gets the icon for a class
   * @param {SubjectGrade} subject - a class name
   * @returns {string} icon name
   */
  getIcon(subject: SubjectGrade) {
    let classType = this.getClassType(subject.name);
    if (classType == "socialstudies") {
      return "people";
    } else if (classType == "art") {
      return "brush";
    } else if (classType == "english") {
      return "bookmarks";
    } else if (classType == "science") {
      return "flask";
    } else if (classType == "math") {
      return "calculator";
    } else if (classType == "language") {
      return "globe";
    } else if (classType == "sports") {
      return "american-football";
    } else {
      return "create";
    }
  }

  /**
   * Displays opt-in dialog
   * @param {string} username - HAC username
   * @param {string} password - HAC password
   */
  showConfirmLegal(username, password) {

    let confirm = this.alertCtrl.create({
      title: 'Legal',
      message: 'To provide statistical features and contribute to personal data analysis, the app requires that you accept the policies outlined in the legal section of the app (black icon in the top right menu) and confirm that you are more than 13 years old.',
      buttons: [
        {
          text: 'No!',
          handler: () => {
            this.storage.set('grades:legal', false);
            this.toastCtrl.create({
              message: 'Cannot retrieve grades',
              position: 'top',
              duration: 3000
            }).present();
          }
        },
        {
          text: 'Yup (I accept)',
          handler: () => {
            this.storage.set('grades:legal', true).then(() => {
              this.storage.set('grades:username', username).then(() => {
                this.storage.set('grades:password', password).then(() => {
                  // Download everything initally
                  this.loadGrades('current');
                  this.loadGrades('reportcard');
                  this.loadGrades('transcript');
                });
              });
            });
          }
        }
      ]
    });
    confirm.present();

  }

  /**
   * Validates user/pass
   * @param {string} sid - HAC username
   * @param {string} password - HAC password
   * @returns {boolean} is valid
   */
  validCreds(sid: string, password: string): boolean {
    return password.length > 4 && sid.length == 7;
  }

  /**
   * Login dialog
   * @param {Fab} fab - the fab button
   */
  showLogin(fab) {

    fab.close();

    let prompt = this.alertCtrl.create({
      title: 'Login',
      inputs: [
        {
          name: 'sid',
          placeholder: 's000000'
        }, {
          name: 'password',
          placeholder: 'password',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            // ):
          }
        },
        {
          text: 'Go',
          handler: data => {

            this.storage.get('grades:legal').then((accepted) => {
              if (accepted) {
                this.storage.set('grades:username', data.sid).then(() => {
                  this.storage.set('grades:password', data.password).then(() => {
                    // Download everything initally
                    this.loadGrades('current');
                    this.loadGrades('reportcard');
                    this.loadGrades('transcript');
                  });
                });
              } else {
                this.showConfirmLegal(data.sid, data.password);
              }
            });

          }
        }
      ]
    });
    prompt.present();

  }

  /**
   * Logout and delete local data.
   * @param {Fab} fab - the fab button
   */
  logout(fab) {

    fab.close();

    // Clearing all data by setting back to default
    this.storage.set('grades:username', '');
    this.storage.set('grades:password', '');
    this.storage.set('grades:legal', false);
    this.storage.set('grades:current', {});
    this.storage.set('grades:reportcard', {});
    this.storage.set('grades:transcript', {});

    this.currentGrades = [];
    this.reportCardGrades = [];
    this.gpa = -1;
    this.percentile = -1;
    this.transcript = {};
    this.loading = false;

  }

  /**
   * Handles swipe
   */
  swipeTab(swipe) {
    if (swipe.direction == 2) {
      if (this.gradeType == 'current') {
        this.gradeType = 'reportcard';
      } else {
        this.navCtrl.parent.select(2);
      }
    } else if (swipe.direction == 4) {
      if (this.gradeType == 'reportcard') {
        this.gradeType = 'current';
      } else {
        this.navCtrl.parent.select(0);
      }
    }
  }

  /**
   * Handles grade calculator button.
   * Click Icon -> Choose Class -> CalculatorPage
   */
  calculate() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Choose a class');

    let first: boolean = true;

    for (let subject of this.reportCardGrades) {
      alert.addInput({
        type: 'radio',
        label: subject.name,
        value: subject.name,
        checked: first
      });
      first = false;
    }

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        for (let subject of this.reportCardGrades) {
          if (subject.name == data) {
            this.navCtrl.push(CalculatorPage, { subject: subject });
            break;
          }
        }
      }
    });
    alert.present();
  }

  /**
   * Formats time since X
   * Thanks: https://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site
   * @param {Date} date - original date
   * @returns {string} the time till date formated
   */
  timeAgo(date: Date): string {

    let time = (Date.now() - date.getTime());

    var time_formats = [
      [60, 'seconds', 1],                           // 60
      [120, '1 minute ago', '1 minute from now'],   // 60*2
      [3600, 'minutes', 60],                        // 60*60, 60
      [7200, '1 hour ago', '1 hour from now'],      // 60*60*2
      [86400, 'hours', 3600],                       // 60*60*24, 60*60
      [172800, 'Yesterday', 'Tomorrow'],            // 60*60*24*2
      [604800, 'days', 86400],                      // 60*60*24*7, 60*60*24
      [1209600, 'Last week', 'Next week'],          // 60*60*24*7*4*2
      [2419200, 'weeks', 604800],                   // 60*60*24*7*4, 60*60*24*7
      [4838400, 'Last month', 'Next month'],        // 60*60*24*7*4*2
      [29030400, 'months', 2419200],                // 60*60*24*7*4*12, 60*60*24*7*4
      [58060800, 'Last year', 'Next year'],         // 60*60*24*7*4*12*2
      [2903040000, 'years', 29030400],              // 60*60*24*7*4*12*100, 60*60*24*7*4*12
      [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
      [58060800000, 'centuries', 2903040000]        // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
    ];

    let seconds = time / 1000,
        token = 'ago',
        list_choice = 1;

    if (seconds == 0) {
      return 'Just now'
    } else if (seconds < 0) {
      seconds = Math.abs(seconds);
      token = 'from now';
      list_choice = 2;
    }

    var i = 0,
        format;

    while (format = time_formats[i++]) {
      if (seconds < format[0]) {
        if (typeof format[2] == 'string')
          return format[list_choice];
        else
          return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
      }
    }

    return "";

  }

}

@Component({
  templateUrl: 'assignments.html'
})
export class AssignmentsPage {

  subject: SubjectGrade;

  constructor(public navCtrl: NavController, params: NavParams) {
    this.subject = params.data.subject;
  }

  /**
   * Finds matching color
   * @param {string} letter - letter grade
   * @returns {string} color/style
   */
  getColor(letter: string): string {
    if (letter == 'A') {
      return 'great';
    } else if (letter == 'B') {
      return 'ok';
    } else if (letter == 'C') {
      return 'poor';
    } else if (letter == 'Z') {
      return 'zero';
    } else if (letter == 'U') {
      return 'none';
    } else {
      return 'bad';
    }
  }

}

@Component({
  templateUrl: 'legal.html'
})
export class LegalPage {
}
