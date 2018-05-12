import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Events } from 'ionic-angular';

import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { ToastController } from 'ionic-angular';

import { Globals } from '../../app/globals';

@Component({
  selector: 'page-sites',
  templateUrl: 'sites.html'
})
export class SitesPage {

  allTeachers: object;
  curTeachers: object;
  letters: string[];
  showGeneral: boolean = true;

  constructor(public navCtrl: NavController,
              public events: Events,
              private http: Http,
              private storage: Storage,
              public toastCtrl: ToastController) {

    this.allTeachers = {};
    this.curTeachers = {};
    this.letters = [];

    // Handle download of faculty info
    this.events.subscribe('faculty:downloaded', teachers => {

      this.storage.set('faculty:list', teachers);

      this.allTeachers = teachers;
      this.curTeachers = teachers;

    });

    // [A, B, C, ..., Z]
    for (let i = 65; i <= 90; i++) {
      this.letters.push(String.fromCharCode(i));
    }

    // Try for cached teachers - if not found, download them
    this.storage.get('faculty:list').then((teachers) => {
      if (teachers) {
        console.log("Using cached teachers...");
        this.events.publish('faculty:downloaded', teachers);
      } else {
        this.loadTeachers();
      }
    });

  }

  /**
   * Downloads teacher info from server
   */
  loadTeachers() {

    this.http.get(Globals.SERVER + '/api/faculty/list').subscribe(
      data => {
        this.events.publish('faculty:downloaded', data.json());
      },
      error => {
        this.toastCtrl.create({
          message: 'Couldn\'t find any teachers 😞',
          position: 'top',
          duration: 3000
        }).present();
      }
    );

  }

  /**
   * Opens url in new window
   * @param {String} url - target url
   */
  openWebsite(url) {
    window.open(url, '_system');
  }

  /**
   * Prompts users email app w/teachers email
   * @param {Teacher} teacher - teacher to email
   */
  emailTeacher(teacher) {
    window.open("mailto://" + teacher.email);
  }

  /**
   * Removes non-critical chars from teachers website url
   * @param {Teacher} teacher - teacher
   * @returns {String} cleaned website url
   */
  cleanWebsite(teacher) {
    return teacher.website.replace("https://", "")
      .replace("http://www.", "")
      .replace("/a/cfisd.net/", "/../");
  }

  /**
   * Handles user's search query
   * @param {String} input - search query
   */
  onSearch(input) {

    // Ez Object Copy (current teachers is simply a filtered version of all teachers)
    this.curTeachers = JSON.parse(JSON.stringify(this.allTeachers));

    let term = input.target.value;

    // No query
    if(!term || term.length == 0) {
      this.showGeneral = true;
      return;
    }

    // Hide non-teacher stuff if the user is trying to find teachers
    this.showGeneral = false;

    for (let letter of this.letters) {
      if (this.curTeachers[letter] && term && term.trim() !== '') {
        this.curTeachers[letter] = this.curTeachers[letter].filter((teacher) => { // Filter only relevent teachers
          return teacher.name.toLowerCase().replace(' ', '').replace(',', '').includes(term.toLowerCase());
        });
      }
    }

  }

  /**
   * Handles user clearing search
   */
  onCancel() {
    this.curTeachers = this.allTeachers;
    this.showGeneral = true;
  }

}
