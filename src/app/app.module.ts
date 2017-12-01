import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { MyApp } from './app.component';

import { NewsPage } from '../pages/news/news';
import { GradesPage } from '../pages/grades/grades';
import { AssignmentsPage } from '../pages/grades/grades';
import { CalculatorPage } from '../pages/grades/calculator';
import { LegalPage } from '../pages/grades/grades';
import { BellsPage } from '../pages/bells/bells';
import { TeachersPage } from '../pages/teachers/teachers';

@NgModule({
  declarations: [
    MyApp,
    NewsPage,
    GradesPage,
    AssignmentsPage,
    CalculatorPage,
    LegalPage,
    BellsPage,
    TeachersPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    NewsPage,
    GradesPage,
    AssignmentsPage,
    CalculatorPage,
    LegalPage,
    BellsPage,
    TeachersPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    LocalNotifications,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
