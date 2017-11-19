import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-bells',
  templateUrl: 'bells.html'
})
export class BellsPage {

  dayType: string;
  lunchType: string;
  schedules: object;
  today: Date;

  constructor(public navCtrl: NavController) {

    this.schedules = {

      normal:{
        periods:[
          {name: '1st', start: '7:20', end: '8:13'},
          {name: '2nd', start: '8:19', end: '9:15'},
          {name: '3rd', start: '9:21', end: '10:14'},
          {name: '6th', start: '12:48', end: '12:41'},
          {name: '7th', start: '13:47', end: '14:40'},
          {name: 'Tutorials', start: '14:50', end: '15:15'}
        ],
        lunches:{
          a: [
            {name: 'A Lunch', start: '10:14', end: '10:44'},
            {name: '4th', start: '10:50', end: '11:43'},
            {name: '5th', start: '11:49', end: '12:42'}
          ],
          b: [
            {name: '4th', start: '10:20', end: '11:13'},
            {name: 'B Lunch', start: '11:13', end: '11:43'},
            {name: '5th', start: '11:49', end: '12:42'}
          ],
          c: [
            {name: '4th', start: '10:20', end: '11:13'},
            {name: '5th', start: '11:13', end: '12:12'},
            {name: 'C Lunch', start: '12:12', end: '12:42'}
          ]
        }
      },

      extended:{
        periods:[
          {name: '1st', start: '7:20', end: '8:13'}
        ],
        lunchs:{
          a: [

          ],
          b: [

          ],
          c: [

          ]
        }
      },

      pep:{
        periods:[
          {name: '1st', start: '7:20', end: '8:13'}
        ],
        lunchs:{
          a: [

          ],
          b: [

          ],
          c: [

          ]
        }
      }

    }

    this.dayType = 'normal';
    this.lunchType = 'a';

    this.today = new Date();

  }

}
