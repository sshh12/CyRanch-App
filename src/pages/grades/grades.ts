import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Events } from 'ionic-angular';

import { Http, Headers, RequestOptions } from '@angular/http';

class AssignmentGrade {

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

      console.log(grades);

      if(grades.status == 'success'){

        let current: SubjectGrade[] = grades.grades;

        this.currentGrades = current;

      }

    });


    let headers = new Headers({'Content-Type' : 'application/json'});
    let options = new RequestOptions({ headers: headers });

    this.http.post('http://192.168.1.65:5000/api/classwork/s000000', JSON.stringify({password: '123456'}), options).subscribe(
      data => {
          this.events.publish('grades:current', data.json());
      },
      error => {
        alert(error);
      }
    );

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

  openClassGrades(){

    this.navCtrl.push(AssignmentsPage);

  }

}

@Component({
  templateUrl: 'assignments.html'
})
export class AssignmentsPage {

  constructor(public navCtrl: NavController) {

  }

}
