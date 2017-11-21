import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular';

import { Http, Headers, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';

import { Globals } from '../../app/globals';

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

@Component({
  selector: 'page-grades',
  templateUrl: 'grades.html'
})
export class GradesPage {

  gradeType: string;
  currentGrades: SubjectGrade[];
  loading: boolean;
  classList: object;

  constructor(public navCtrl: NavController,
              public events: Events,
              private http: Http,
              private storage: Storage,
              public alertCtrl: AlertController) {

    this.gradeType = "current";
    this.loading = false;
    this.currentGrades = [];

    this.events.subscribe('grades:current', grades => {

      if(grades.status == 'success'){

        console.log(grades);

        this.storage.set('grades:data', grades);

        let current: SubjectGrade[] = grades.grades;

        for(let subject of current){

          let grades: AssignmentGrade[] = subject.assignments;
          grades.sort((a: AssignmentGrade, b: AssignmentGrade) => {
            return (new Date(b.datedue)).getTime() - (new Date(a.datedue)).getTime();
          })
          subject.assignments = grades;

        }

        this.currentGrades = current;

      } else if(grades.status == 'login_failed'){

        let alert = this.alertCtrl.create({
          title: 'Oops!',
          subTitle: 'Your login didn\'t work 😞',
          buttons: ['ok']
        });
        alert.present();

      }

      this.loading = false;

    });

    this.storage.get('grades:data').then((grades) => {
      if(grades){
        this.events.publish('grades:current', grades);
      }
    });

    this.classList = {
      "socialstudies": ["hist","gov","macro eco","street law","human geog","geog","wd area","economics"],
      "art": ["treble", "clarinet", " orch","art","band","animation","theater","bnd ","orchest","aud vid","chrl ","music","choir","a/v","av pro","voc ens","symph", "th. pro", " strings"],
      "english": ["journl ","journal","eng ","creative write", "english","debate"],
      "science": ["med term", "envir", "forensics", "chemsitry","phys ", "chemistry","phy/chem","web tech","tch sys","livestock","electr","vet med","wldlif fish eco","prof comm","sci","robot","physics","antmy","physlgy","biology","sociology","animal","psychology", "chem ","bio ","medical","prin ag fd nt r","food tech","com prog"],
      "math": ["geom","cal-","bank financ","calc","geometry","pre cal","algebra","statistics","alg ","accounting"],
      "language": ["span iv","spanish","french","latin","german"],
      "sports": ["ath ","athletics","phys ed","athlet","cheerleading","dance","sports"]
    }

  }

  loadCurrentGrades(callback?){

    this.loading = true;

    this.storage.get('grades:username').then((username) => {
      this.storage.get('grades:password').then((password) => {

        let headers = new Headers({'Content-Type' : 'application/json'});
        let options = new RequestOptions({ headers: headers });

        this.http.post(Globals.SERVER + '/api/classwork/' + username, JSON.stringify({password: password}), options).subscribe(data => {

              console.log(data);

              if(callback){
                callback();
              }

              this.events.publish('grades:current', data.json());

          },
          error => {
            this.loading = false;
            if(callback){
              callback();
            }
          }
        );

      });
    });

  }

  refreshCurrent(refresher){
    this.loadCurrentGrades(() => refresher.complete());
  }

  openClassGrades(subject: SubjectGrade){
    this.navCtrl.push(AssignmentsPage, {subject: subject});
  }

  openLegal() {
    this.navCtrl.push(LegalPage);
  }

  getColor(letter: string) : string {
    if(letter == 'A'){
      return 'great';
    } else if(letter == 'B'){
      return 'ok';
    } else if(letter == 'C'){
      return 'poor';
    } else if(letter == 'U'){
      return 'none';
    } else {
      return 'bad';
    }
  }

  getClassType(name: string) : string {
    name = name.toLowerCase();
    for(let classType of Object.keys(this.classList)){
      let kwords = this.classList[classType];
      for(let word of kwords){
        if(name.includes(word)){
          return classType;
        }
      }
    }
    return "other";
  }

  getIcon(subject: SubjectGrade){
    let classType = this.getClassType(subject.name);
    if(classType == "socialstudies"){
      return "people";
    } else if(classType == "art"){
      return "brush";
    } else if(classType == "english"){
      return "bookmarks";
    } else if(classType == "science"){
      return "flask";
    } else if(classType == "math"){
      return "calculator";
    } else if(classType == "language"){
      return "globe";
    } else if(classType == "sports"){
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
          }
        },
        {
          text: 'Yup (I accept)',
          handler: () => {
            this.storage.set('grades:legal', true).then(() => {
              this.storage.set('grades:username', username).then(() => {
                this.storage.set('grades:password', password).then(() => {
                  this.loadCurrentGrades();
                });
              });
            });
          }
        }
      ]
    });
    confirm.present();

  }

  showLogin() {

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
              if(accepted){
                this.storage.set('grades:username', data.sid).then(() => {
                  this.storage.set('grades:password', data.password).then(() => {
                    this.loadCurrentGrades();
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

  logout() {

    this.storage.set('grades:username', '');
    this.storage.set('grades:password', '');
    this.storage.set('grades:legal', false);
    this.storage.set('grades:data', {});

    this.currentGrades = [];
    this.loading = false;

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

  getColor(letter: string) : string {
    if(letter == 'A'){
      return 'great';
    } else if(letter == 'B'){
      return 'ok';
    } else if(letter == 'C'){
      return 'poor';
    } else if(letter == 'U'){
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
