import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular';

import { Http, Headers, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { Globals } from '../../app/globals';

import { CalculatorPage } from '../grades/calculator';

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

  transcript: any = {};
  gpa: number;
  percentile: number;

  constructor(public navCtrl: NavController,
              public events: Events,
              private http: Http,
              private storage: Storage,
              public alertCtrl: AlertController,
              public toastCtrl: ToastController) {

    this.gradeType = "current";
    this.loading = false;
    this.currentGrades = [];

    this.events.subscribe('grades:current', grades => {

      console.log(grades);

      if (grades.status == 'success') {

        this.currentGrades = [];

        this.storage.set('grades:current', grades);

        let current: SubjectGrade[] = grades.grades;

        for (let subject of current) {

          let grades: AssignmentGrade[] = subject.assignments;
          grades.sort((a: AssignmentGrade, b: AssignmentGrade) => {
            return (new Date(b.datedue)).getTime() - (new Date(a.datedue)).getTime();
          })
          subject.assignments = grades;

        }

        this.currentGrades = current;

      } else {

        this.showServerDialog(grades.status);

      }

      this.loading = false;

    });

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

    this.events.subscribe('grades:transcript', transcript => {

      console.log(transcript);

      if (transcript.status == 'success') {

        this.storage.set('grades:transcript', transcript);

        this.gpa = transcript.gpa.value;
        this.percentile = Math.ceil(transcript.gpa.rank / transcript.gpa.class_size * 100);

        this.transcript = transcript;

      } else {

        this.showServerDialog(transcript.status);

      }

      this.loading = false;

    });

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
          this.events.publish('grades:' + gradeType, data.json());

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

  refreshCurrent(refresher?) {
    if (refresher) {
      this.loadGrades(this.gradeType, () => refresher.complete());
    } else {
      this.loadGrades(this.gradeType);
    }
  }

  openClassGrades(subject: SubjectGrade) {
    this.navCtrl.push(AssignmentsPage, { subject: subject });
  }

  openLegal(fab) {
    fab.close();
    this.navCtrl.push(LegalPage);
  }

  getColor(letter: string): string {
    if (letter == 'A') {
      return 'great';
    } else if (letter == 'B') {
      return 'ok';
    } else if (letter == 'C') {
      return 'poor';
    } else if (letter == 'U' || letter === '') {
      return 'none';
    } else {
      return 'bad';
    }
  }

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

  fixPercent(percent: string): string {
    if (!percent || percent == '' || percent == '0') {
      return '-';
    }
    return percent;
  }

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

  showConfirmLegal(username, password) {

    let confirm = this.alertCtrl.create({
      title: 'Legal',
      message: 'To provide assignment averages, percentiles, and other features, the app requires that you accept the policies outlined in the legal section of the app (black icon in the top right).',
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

  validCreds(sid: string, password: string): boolean {
    return password.length > 4 && sid.length == 7;
  }

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
            //
          }
        },
        {
          text: 'Go',
          handler: data => {

            this.storage.get('grades:legal').then((accepted) => {
              if (accepted) {
                this.storage.set('grades:username', data.sid).then(() => {
                  this.storage.set('grades:password', data.password).then(() => {
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

  logout(fab) {

    fab.close();

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

}

@Component({
  templateUrl: 'assignments.html'
})
export class AssignmentsPage {

  subject: SubjectGrade;

  constructor(public navCtrl: NavController, params: NavParams) {
    this.subject = params.data.subject;
  }

  getColor(letter: string): string {
    if (letter == 'A') {
      return 'great';
    } else if (letter == 'B') {
      return 'ok';
    } else if (letter == 'C') {
      return 'poor';
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
