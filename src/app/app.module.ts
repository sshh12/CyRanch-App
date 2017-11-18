import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';

import { NewsPage } from '../pages/news/news';
import { GradesPage } from '../pages/grades/grades';
import { AssignmentsPage } from '../pages/grades/grades';
import { BellsPage } from '../pages/bells/bells';
import { TeachersPage } from '../pages/teachers/teachers';

import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HTTP } from '@ionic-native/http';

@NgModule({
  declarations: [
    MyApp,
    NewsPage,
    GradesPage,
    AssignmentsPage,
    BellsPage,
    TeachersPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    NewsPage,
    GradesPage,
    AssignmentsPage,
    BellsPage,
    TeachersPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HTTP,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
