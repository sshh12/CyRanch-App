import { Component } from '@angular/core';

import { NewsPage } from '../news/news';
import { GradesPage } from '../grades/grades';
import { BellsPage } from '../bells/bells';
import { SitesPage } from '../sites/sites';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  // Just 4 tabs.
  tab1Root = NewsPage;
  tab2Root = GradesPage;
  tab3Root = BellsPage;
  tab4Root = SitesPage;

  constructor() {

  }

}
