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

  constructor(public navCtrl: NavController,
              public events: Events,
              private http: Http,
              private storage: Storage,
              public alertCtrl: AlertController) {

    this.gradeType = "current";
    this.loading = false;

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

      }

      this.loading = false;

    });

    this.storage.get('grades:data').then((grades) => {
      if(grades){
        this.events.publish('grades:current', grades);
      }
    });

  }

  loadCurrentGrades(callback?){

    this.loading = true;

    this.storage.get('grades:username').then((username) => {
      this.storage.get('grades:password').then((password) => {

        let headers = new Headers({'Content-Type' : 'application/json'});
        let options = new RequestOptions({ headers: headers });

        this.http.post(Globals.SERVER + '/api/classwork/' + username, JSON.stringify({password: password}), options).subscribe(
          data => {

              if(callback){
                callback();
              }

              this.events.publish('grades:current', data.json());

          },
          error => {
            alert(error);
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
