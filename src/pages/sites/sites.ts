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

  constructor(public navCtrl: NavController,
    public events: Events,
    private http: Http,
    private storage: Storage,
    public toastCtrl: ToastController) {

    this.allTeachers = {};
    this.curTeachers = {};
    this.letters = [];

    this.events.subscribe('faculty:downloaded', teachers => {

      this.storage.set('faculty:list', teachers);

      this.allTeachers = teachers;
      this.curTeachers = teachers;

    });

    for (let i = 65; i <= 90; i++) {
      this.letters.push(String.fromCharCode(i));
    }

    this.storage.get('faculty:list').then((teachers) => {
      if (teachers) {
        console.log("Using cached teachers...");
        this.events.publish('faculty:downloaded', teachers);
      } else {
        this.loadTeachers();
      }
    });

  }

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

  openWebsite(url) {
    window.open(url, '_system');
  }

  emailTeacher(teacher) {
    window.open("mailto://" + teacher.email);
  }

  cleanWebsite(teacher) {
    return teacher.website.replace("https://", "")
      .replace("http://www.", "")
      .replace("/a/cfisd.net/", "/../");
  }

  onSearch(input) {

    this.curTeachers = JSON.parse(JSON.stringify(this.allTeachers));

    let term = input.target.value;

    for (let letter of this.letters) {
      if (this.curTeachers[letter] && term && term.trim() !== '') {
        this.curTeachers[letter] = this.curTeachers[letter].filter((teacher) => {
          return teacher.name.toLowerCase().replace(' ', '').replace(',', '').includes(term.toLowerCase());
        });
      }
    }

  }

  onCancel() {
    this.curTeachers = this.allTeachers;
  }

}
