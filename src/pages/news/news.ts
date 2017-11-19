import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Events } from 'ionic-angular';

import { Http } from '@angular/http';

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

  constructor(public navCtrl: NavController, public events: Events, private http: Http) {

    this.newsType = "all";
    this.allNews = [];

    this.events.subscribe('news:downloaded', news => {

      let articles: Article[] = news.news.all;
      articles.sort((a: Article, b: Article) => {
        return (new Date(b.date)).getTime() - (new Date(a.date)).getTime();
      })
      this.allNews = articles;

    });

    this.http.get('http://192.168.1.65:5000/api/news/all').subscribe(
      data => {
          this.events.publish('news:downloaded', data.json());
      },
      error => {
        alert(error);
      }
    );

  }

  openArticle(article: Article){
    window.open(article.link, '_system', 'location=yes');
  }

}
