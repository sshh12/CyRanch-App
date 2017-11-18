import { Component } from '@angular/core';

import { NewsPage } from '../news/news';
import { GradesPage } from '../grades/grades';
import { BellsPage } from '../bells/bells';
import { TeachersPage } from '../teachers/teachers';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = NewsPage;
  tab2Root = GradesPage;
  tab3Root = BellsPage;
  tab4Root = TeachersPage;

  constructor() {

  }
}
