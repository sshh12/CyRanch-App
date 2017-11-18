import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-grades',
  templateUrl: 'grades.html'
})
export class GradesPage {

  gradeType: string;

  constructor(public navCtrl: NavController) {

    this.gradeType = "current";

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
