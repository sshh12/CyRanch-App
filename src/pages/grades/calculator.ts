import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { SubjectReportCard } from '../grades/grades';

@Component({
  templateUrl: 'calculator.html'
})
export class CalculatorPage {

  subject: SubjectReportCard;
  semester: string;
  firstweeks: Number;
  secondweeks: Number;
  exam: Number;
  sem: Number;

  constructor(public navCtrl: NavController, params: NavParams) {
    this.subject = params.data.subject;
    this.semester = 'fall';
    this.resetValues();
  }

  resetValues() {
    if(this.semester == 'fall') {
      this.firstweeks = this.subject.averages[0].average;
      this.secondweeks = this.subject.averages[1].average;
      this.exam = this.subject.exams[0].average;
      this.sem = this.subject.semesters[0].average;
    } else {
      this.firstweeks = this.subject.averages[2].average;
      this.secondweeks = this.subject.averages[3].average;
      this.exam = this.subject.exams[1].average;
      this.sem = this.subject.semesters[1].average;
    }
  }

}
