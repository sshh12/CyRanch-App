import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Events } from 'ionic-angular';

import { Http } from '@angular/http';

import { Globals } from '../../app/globals';

@Component({
  selector: 'page-teachers',
  templateUrl: 'teachers.html'
})
export class TeachersPage {

  allTeachers: object;
  curTeachers: object;
  letters: string[];

  constructor(public navCtrl: NavController, public events: Events, private http: Http) {

    this.allTeachers = {};
    this.curTeachers = {};
    this.letters = [];

    this.events.subscribe('faculty:downloaded', teachers => {

      this.allTeachers = teachers;
      this.curTeachers = teachers;

    });

    for(let i = 65; i <= 90; i++){
      this.letters.push(String.fromCharCode(i));
    }

    this.loadTeachers();

  }

  loadTeachers() {

    this.http.get(Globals.SERVER + '/api/faculty/list').subscribe(
      data => {
          this.events.publish('faculty:downloaded', data.json());
      },
      error => {
        alert(error);
      }
    );

  }

  viewTeacher(teacher) {
    window.open(teacher.website, '_system', 'location=yes');
  }

  emailTeacher(teacher) {
    window.open("mailto://" + teacher.email);
  }

  cleanWebsite(teacher) {
    return teacher.website.replace("https://", "")
                          .replace("http://www.", "")
                          .replace("/a/cfisd.net/", "/../");
  }

  onSearch(input){

    this.curTeachers = JSON.parse(JSON.stringify(this.allTeachers));

    let term = input.target.value;

    for(let letter of this.letters){
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
