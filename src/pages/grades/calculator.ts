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

    // Defaults
    this.subject = params.data.subject;
    this.semester = 'fall';
    this.exempt = false;
    this.orderOfOps = ['sem', 'exam', 'second', 'first']; // Order of Operations
    this.resetValues();

  }

  /**
   * Cleans/Parses value
   * @param {string} num - number to clean
   * @returns {Number} value
   */
  clean(num) {
    num = "0" + num;
    return parseFloat(num.replace(/\D/g, ''));
  }

  /**
   * Updates Input boxes. Uses queue of operations/updates to calculate
   * the rest of the other values (sem/exam/1st/2nd) based on the most
   * recent input.
   * @param {string} section - box most recently updated
   */
  update(section: string) {

    // Updated order of inputs
    this.orderOfOps.splice(this.orderOfOps.indexOf(section), 1);
    this.orderOfOps.push(section);

    this.firstweeks = this.clean(this.firstweeks);
    this.secondweeks = this.clean(this.secondweeks);
    this.exam = this.clean(this.exam);
    this.sem = this.clean(this.sem);

    // Choose appropriate calculation
    let lastOp = this.orderOfOps[0];
    if (lastOp == 'sem') {
      if (!this.exempt) {
        this.sem = ((this.firstweeks * 3 + this.secondweeks * 3) + this.exam) / 7;
      } else {
        this.sem = (this.firstweeks + this.secondweeks) / 2;
      }
    } else if (lastOp == 'exam') {
      if (!this.exempt) {
        this.exam = this.sem * 7 - (this.firstweeks * 3 + this.secondweeks * 3);
      } else {
        this.sem = ((this.firstweeks * 3 + this.secondweeks * 3) + this.exam) / 7;
      }
    } else if (lastOp == 'second') {
      if (!this.exempt) {
        this.secondweeks = (this.sem * 7 - this.exam - this.firstweeks * 3) / 3;
      } else {
        this.secondweeks = this.sem * 2 - this.firstweeks;
      }
    } else {
      if (!this.exempt) {
        this.firstweeks = (this.sem * 7 - this.exam - this.secondweeks * 3) / 3;
      } else {
        this.firstweeks = this.sem * 2 - this.secondweeks;
      }
    }

    this.sem.toFixed(2);
    this.exam.toFixed(2);
    this.firstweeks.toFixed(2);
    this.secondweeks.toFixed(2);

  }

  /**
   * Resets values to defaults
   */
  resetValues() {
    if (this.semester == 'fall') {
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
