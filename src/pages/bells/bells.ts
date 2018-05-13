import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications';

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
  notifications: boolean;

  constructor(public navCtrl: NavController,
              private storage: Storage,
              private notif: LocalNotifications) {

    // All schedules hardcoded
    this.schedules = {

      normal: {
        periods: [
          { name: '1st', start: '7:20', end: '8:13' },
          { name: '2nd', start: '8:19', end: '9:15' },
          { name: '3rd', start: '9:21', end: '10:14' },
          { name: 'LUNCH_BLOCK' },
          { name: '6th', start: '12:48', end: '13:41' },
          { name: '7th', start: '13:47', end: '14:40' },
          { name: 'Tutorials', start: '14:50', end: '15:15' }
        ],
        lunches: {
          a: [
            { name: 'A Lunch', start: '10:14', end: '10:44' },
            { name: '4th', start: '10:50', end: '11:43' },
            { name: '5th', start: '11:49', end: '12:42' }
          ],
          b: [
            { name: '4th', start: '10:20', end: '11:13' },
            { name: 'B Lunch', start: '11:13', end: '11:43' },
            { name: '5th', start: '11:49', end: '12:42' }
          ],
          c: [
            { name: '4th', start: '10:20', end: '11:13' },
            { name: '5th', start: '11:19', end: '12:12' },
            { name: 'C Lunch', start: '12:12', end: '12:42' }
          ]
        }
      },

      extended: {
        periods: [
          { name: '1st', start: '7:20', end: '8:07' },
          { name: '2nd', start: '8:13', end: '9:03' },
          { name: 'Assembly', start: '9:03', end: '9:33' },
          { name: '3rd', start: '9:39', end: '10:26' },
          { name: 'LUNCH_BLOCK' },
          { name: '6th', start: '13:00', end: '13:47' },
          { name: '7th', start: '13:53', end: '14:40' },
          { name: 'Tutorials', start: '14:50', end: '15:15' }
        ],
        lunches: {
          a: [
            { name: 'A Lunch', start: '10:26', end: '10:56' },
            { name: '4th', start: '11:02', end: '11:55' },
            { name: '5th', start: '12:01', end: '12:54' }
          ],
          b: [
            { name: '4th', start: '10:32', end: '11:25' },
            { name: 'B Lunch', start: '11:25', end: '11:55' },
            { name: '5th', start: '12:01', end: '12:54' }
          ],
          c: [
            { name: '4th', start: '10:32', end: '11:25' },
            { name: '5th', start: '11:31', end: '12:24' },
            { name: 'C Lunch', start: '12:24', end: '12:54' }
          ]
        }
      },

      pep: {
        periods: [
          { name: '1st', start: '7:20', end: '8:06' },
          { name: '2nd', start: '8:12', end: '9:01' },
          { name: '3rd', start: '9:07', end: '9:53' },
          { name: 'LUNCH_BLOCK' },
          { name: '6th', start: '12:28', end: '13:13' },
          { name: '7th/Pep Rally', start: '13:19', end: '14:40' },
          { name: 'Tutorials', start: '14:50', end: '15:15' }
        ],
        lunches: {
          a: [
            { name: 'A Lunch', start: '9:53', end: '10:23' },
            { name: '4th', start: '10:29', end: '11:22' },
            { name: '5th', start: '11:28', end: '12:22' }
          ],
          b: [
            { name: '4th', start: '9:59', end: '10:52' },
            { name: 'B Lunch', start: '10:52', end: '11:22' },
            { name: '5th', start: '11:28', end: '12:22' }
          ],
          c: [
            { name: '4th', start: '9:59', end: '10:52' },
            { name: '5th', start: '10:58', end: '11:52' },
            { name: 'C Lunch', start: '11:52', end: '12:22' }
          ]
        }
      }

    }

    // Defaults
    this.dayType = 'normal';
    this.lunchType = 'a';
    this.notifications = false;

    this.storage.get('bells:day').then((day) => {
      if (day) {
        this.dayType = day;
      } else {
        this.storage.set('bells:day', this.dayType);
      }
    });

    this.storage.get('bells:lunch').then((lunch) => {
      if (lunch) {
        this.lunchType = lunch;
      } else {
        this.storage.set('bells:lunch', this.lunchType);
      }
    });

    this.storage.get('bells:notifications').then((enabled) => {
      if (enabled) {
        this.notifications = true;
      }
    })

    this.now = new Date();

    // Timer to continously update time left
    this.interval = setInterval(() => {

      this.now = new Date();

      if (this.notifications) {

        let { period, timeLeft } = this.getCurrentClassInfo();

        if (period) {
          this.notif.schedule({
            id: 0,
            title: period.name,
            text: `${timeLeft} mins remaining`,
            badge: timeLeft
          });
        }

      }

    }, 5000);

  }

  /**
   * Formats date
   * @param {Date} time - input date
   */
  formatTime(time: Date): string {
    let suffix = 'am';
    let mins = '' + time.getMinutes();
    if (time.getHours() == 12) {
      suffix = 'pm';
    }
    if (time.getHours() > 12) {
      time.setHours(time.getHours() - 12);
      suffix = 'pm';
    }
    while (mins.length < 2) {
      mins = '0' + mins;
    }
    return `${time.getHours()}:${mins} ${suffix}`;
  }

  /**
   * Formats time period
   * @param {Period} period - input period
   */
  formatSubText(period): string {

    let start: Date = new Date(2000, 0, 0, ...period.start.split(':'));
    let end: Date = new Date(2000, 0, 0, ...period.end.split(':'));

    let duration = Math.floor((end.getTime() - start.getTime()) / 1000 / 60);

    return `${this.formatTime(start)} - ${this.formatTime(end)} (${duration} mins)`;

  }

  /**
   * Checks if currently in period
   * @param {Period} period - input period
   * @returns {boolean} If is current period
   */
  isCurrentPeriod(period): boolean {

    let start: Date = new Date(2000, 0, 0, ...period.start.split(':'));
    let end: Date = new Date(2000, 0, 0, ...period.end.split(':'));
    let now: Date = new Date(2000, 0, 0, this.now.getHours(), this.now.getMinutes());

    if (start <= now && now <= end) {
      return true;
    }

    return false;

  }

  /**
   * Time remaining in period
   * @param {Period} period - current period
   * @returns {Number} time left
   */
  getTimeRemaining(period): number {

    let end: Date = new Date(2000, 0, 0, ...period.end.split(':'));
    let now: Date = new Date(2000, 0, 0, this.now.getHours(), this.now.getMinutes());

    return Math.floor((end.getTime() - now.getTime()) / 1000 / 60);

  }

  /**
   * Get matching color for time remaining
   * @param {Period} period - current period
   * @returns {string} color/style
   */
  getRemainingColor(period): string {

    let timeLeft = this.getTimeRemaining(period);

    if (timeLeft < 1) {
      return 'danger';
    } else if (timeLeft <= 5) {
      return 'ok';
    } else {
      return 'great';
    }

  }

  /**
   * Saves day/lunch settings
   */
  updateDefaults() {
    this.storage.set('bells:day', this.dayType);
    this.storage.set('bells:lunch', this.lunchType);
  }

  /**
   * Toggles notifications
   */
  toggleNotifications() {
    this.notifications = !this.notifications;
    this.storage.set('bells:notifications', this.notifications);
  }

  /**
   * Retrieves info about the current time and period
   * @returns {Object} current time info
   */
  getCurrentClassInfo() {

    let currentPeriod = null;

    for (let period of this.schedules[this.dayType].periods) {
      if (period.name != 'LUNCH_BLOCK' && this.isCurrentPeriod(period)) {
        currentPeriod = period;
        break;
      }
    }

    if (!currentPeriod) {
      for (let period of this.schedules[this.dayType].lunches[this.lunchType]) {
        if (this.isCurrentPeriod(period)) {
          currentPeriod = period;
          break;
        }
      }
    }

    if (!currentPeriod) {
      return { period: false, timeLeft: -1 };
    } else {
      return { period: currentPeriod, timeLeft: this.getTimeRemaining(currentPeriod) };
    }

  }

  /**
   * Handles swipe
   */
  swipeTab(swipe) {
    if (swipe.direction == 2) {
      this.navCtrl.parent.select(3);
    } else if (swipe.direction == 4) {
      this.navCtrl.parent.select(1);
    }
  }

  /**
   * Opens url in new window
   * @param {string} url - target url
   */
  openWebsite(url) {
    window.open(url, '_system');
  }

}
