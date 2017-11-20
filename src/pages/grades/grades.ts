import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular';

import { Http, Headers, RequestOptions } from '@angular/http';

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

  constructor(public navCtrl: NavController, public events: Events, private http: Http) {

    this.gradeType = "current";

    this.events.subscribe('grades:current', grades => {

      if(grades.status == 'success'){

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

    });

    this.loadCurrentGrades();

  }

  loadCurrentGrades(callback?){

    let headers = new Headers({'Content-Type' : 'application/json'});
    let options = new RequestOptions({ headers: headers });

    this.http.post(Globals.SERVER + '/api/classwork/s000000', JSON.stringify({password: '123456'}), options).subscribe(
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
