import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';

import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;

  constructor(public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private admobFree: AdMobFree) {
    platform.ready().then(() => {

      statusBar.styleDefault();
      splashScreen.hide();

      this.initBannerAd();

    });
  }

  initBannerAd() : void {

    let bannerAdID: string;

    if(this.platform.is('android')) {
      bannerAdID = "ca-app-pub-9429036015049220/4211841510";
    } else if (this.platform.is('ios')) {
      bannerAdID = 'ca-app-pub-9429036015049220/5834794812';
    }

    const bannerConfig: AdMobFreeBannerConfig = {
      id: bannerAdID,
      isTesting: true, // DEV
      autoShow: false
    };
    this.admobFree.banner.config(bannerConfig);
    this.admobFree.banner.prepare().then(() => {
      this.admobFree.banner.show();
    }).catch((e) => console.log(e));

  }

}
