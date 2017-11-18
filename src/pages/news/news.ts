import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Http } from '@angular/http';

@Component({
  selector: 'page-news',
  templateUrl: 'news.html'
})
export class NewsPage {

  newsType: string;

  constructor(public navCtrl: NavController, private http: Http) {

    this.newsType = "all";

    this.http.get('https://cfisdapi.herokuapp.com/ping').subscribe(
      data => {
          alert(JSON.stringify(data));
      }
    );

  }

}
