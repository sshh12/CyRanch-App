import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { HTTP } from '@ionic-native/http';

@Component({
  selector: 'page-news',
  templateUrl: 'news.html'
})
export class NewsPage {

  newsType: string;

  constructor(public navCtrl: NavController, private http: HTTP) {

    this.newsType = "all";

    this.http.get('https://cfisdapi.herokuapp.com/ping', {}, {}).then(data => {
      alert(data.data);
    })

  }

}
