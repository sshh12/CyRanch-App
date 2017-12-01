import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { SubjectReportCard } from '../grades/grades';

@Component({
  templateUrl: 'calculator.html'
})
export class CalculatorPage {

  subject: SubjectReportCard;
  semester: string;
  firstweeks: any;
  secondweeks: any;
  exam: any;
  sem: any;
  exempt: boolean;

  orderOfOps: string[];

  constructor(public navCtrl: NavController, params: NavParams) {
    this.subject = params.data.subject;
    this.semester = 'fall';
    this.exempt = false;
    this.orderOfOps = ['sem', 'exam', 'second', 'first'];
    this.resetValues();
  }

  clean(num) {
    num = "0" + num;
    return parseFloat(num.replace(/\D/g,''));
  }

  update(section: string) {

    this.orderOfOps.splice(this.orderOfOps.indexOf(section), 1);
    this.orderOfOps.push(section);

    this.firstweeks = this.clean(this.firstweeks);
    this.secondweeks = this.clean(this.secondweeks);
    this.exam = this.clean(this.exam);
    this.sem = this.clean(this.sem);

    let lastOp = this.orderOfOps[0];
    if(lastOp == 'sem') {
      if(!this.exempt){
        this.sem = ((this.firstweeks * 2 + this.secondweeks * 2) + this.exam) / 5;
      } else {
        this.sem = (this.firstweeks + this.secondweeks) / 2;
      }
    } else if(lastOp == 'exam') {
      if(!this.exempt){
        this.exam = this.sem * 5 - (this.firstweeks * 2 + this.secondweeks * 2);
      } else {
        this.sem = ((this.firstweeks * 2 + this.secondweeks * 2) + this.exam) / 5;
      }
    } else if(lastOp == 'second') {
      if(!this.exempt){
        this.secondweeks = (this.sem * 5 - this.exam - this.firstweeks * 2) / 2;
      } else {
        this.secondweeks = this.sem * 2 - this.firstweeks;
      }
    } else {
      if(!this.exempt){
        this.firstweeks = (this.sem * 5 - this.exam - this.secondweeks * 2) / 2;
      } else {
        this.firstweeks = this.sem * 2 - this.secondweeks;
      }
    }
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
    this.firstweeks = this.clean(this.firstweeks);
    this.secondweeks = this.clean(this.secondweeks);
    this.exam = this.clean(this.exam);
    this.sem = this.clean(this.sem);
  }

}
