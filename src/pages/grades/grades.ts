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

}
