import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-bells',
  templateUrl: 'bells.html'
})
export class BellsPage {

  dayType: string;
  lunchType: string;
  schedules: object;
  now: Date;
  interval: any;

  constructor(public navCtrl: NavController, private storage: Storage) {

    this.schedules = {

      normal:{
        periods:[
          {name: '1st', start: '7:20', end: '8:13'},
          {name: '2nd', start: '8:19', end: '9:15'},
          {name: '3rd', start: '9:21', end: '10:14'},
          {name: 'LUNCH_BLOCK'},
          {name: '6th', start: '12:48', end: '13:41'},
          {name: '7th', start: '13:47', end: '14:40'},
          {name: 'Tutorials', start: '14:50', end: '16:30'}
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
            {name: '5th', start: '11:19', end: '12:12'},
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

    this.storage.get('bells:day').then((day) => {
      if(day){
        this.dayType = day;
      } else {
        this.storage.set('bells:day', this.dayType);
      }
    })

    this.storage.get('bells:lunch').then((lunch) => {
      if(lunch){
        this.lunchType = lunch;
      } else {
        this.storage.set('bells:lunch', this.lunchType);
      }
    })

    this.now = new Date();

    this.interval = setInterval(() => {
      this.now = new Date();
    }, 5000);

  }

  formatSubText(period) : string {

    let start: Date = new Date(2000, 0, 0, ...period.start.split(':'));
    let end: Date = new Date(2000, 0, 0, ...period.end.split(':'));

    let startSuffix = 'am';
    let endSuffix = 'am';
    let startMins = '' + start.getMinutes();
    let endMins = '' + end.getMinutes();

    let duration = Math.floor((end.getTime() - start.getTime()) / 1000 / 60);

    if(start.getHours() == 12){
      startSuffix = 'pm';
    }

    if(end.getHours() == 12){
      endSuffix = 'pm';
    }

    if(start.getHours() > 12) {
      start.setHours(start.getHours() - 12);
      startSuffix = 'pm';
    }

    if(end.getHours() > 12) {
      end.setHours(end.getHours() - 12);
      endSuffix = 'pm';
    }

    while(startMins.length < 2){
      startMins = '0' + startMins;
    }

    while(endMins.length < 2){
      endMins = '0' + endMins;
    }

    return `${start.getHours()}:${startMins} ${startSuffix} - ${end.getHours()}:${endMins} ${endSuffix} (${duration} mins)`;

  }

  isCurrentPeriod(period) : boolean {

    let start: Date = new Date(2000, 0, 0, ...period.start.split(':'));
    let end: Date = new Date(2000, 0, 0, ...period.end.split(':'));
    let now: Date = new Date(2000, 0, 0, this.now.getHours(), this.now.getMinutes());

    if(start <= now && now <= end){
      return true;
    }

    return false;

  }

  getTimeRemaining(period) : number {

    let end: Date = new Date(2000, 0, 0, ...period.end.split(':'));
    let now: Date = new Date(2000, 0, 0, this.now.getHours(), this.now.getMinutes());

    return Math.floor((end.getTime() - now.getTime()) / 1000 / 60);

  }

  getRemainingColor(period) : string {

    let timeLeft = this.getTimeRemaining(period);

    if(timeLeft < 1){
      return 'danger';
    } else if(timeLeft <= 5){
      return 'ok';
    } else {
      return 'great';
    }

  }

  updateDefaults() {
    this.storage.set('bells:day', this.dayType);
    this.storage.set('bells:lunch', this.lunchType);
  }

}
