import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-news',
  templateUrl: 'news.html'
})
export class NewsPage {

  newsType: string = "all";

  constructor(public navCtrl: NavController) {

  }

}
