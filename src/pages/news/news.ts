import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Events } from 'ionic-angular';

import { Http } from '@angular/http';
import { ToastController } from 'ionic-angular';

import { Globals } from '../../app/globals';

class Article {
  date: string;
  image: string;
  link: string;
  organization: string;
  text: string;
  type: number;
}

@Component({
  selector: 'page-news',
  templateUrl: 'news.html'
})
export class NewsPage {

  newsType: string;
  allNews: Article[];

  constructor(public navCtrl: NavController,
              public events: Events,
              private http: Http,
              public toastCtrl: ToastController) {

    // Defaults
    this.newsType = "all";
    this.allNews = [];

    // Handle incoming news download
    this.events.subscribe('news:downloaded', news => {

      let articles: Article[] = news.news.all;
      articles.sort((a: Article, b: Article) => {
        return (new Date(b.date)).getTime() - (new Date(a.date)).getTime();
      })
      this.allNews = articles;

    });

    this.loadNews();

  }

  /**
   * Opens article in new window
   * @param {Article} article - article to open
   */
  openArticle(article: Article) {
    window.open(article.link, '_system');
  }

  /**
   * Loads news
   * @param {Function?} callback - callback once news loaded
   */
  loadNews(callback?) {

    this.http.get(Globals.SERVER + '/api/news/cyranch/all').subscribe(
      data => {
        this.events.publish('news:downloaded', data.json());

        if (callback) {
          callback();
        }

      },
      error => {
        this.toastCtrl.create({
          message: 'Network error 😢',
          position: 'top',
          duration: 3000
        }).present();
      }
    );

  }

  /**
   * Refreshes news
   * @param {Refresher} refresher - refresher (spinny thing)
   */
  refresh(refresher) {
    this.loadNews(() => refresher.complete());
  }

  /**
   * Handles swipe
   */
  swipeTab(swipe) {
    if (swipe.direction == 2) {
      this.navCtrl.parent.select(1);
    }
  }

}
