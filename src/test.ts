import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserTestingModule,
  platformBrowserTesting
} from '@angular/platform-browser/testing';

getTestBed().initTestEnvironment(
  BrowserTestingModule,
  platformBrowserTesting()
);

import './app/services/homepage/home-page.service.spec';
import './app/services/coordinates/coordinates.service.spec';
import './app/components/home-page/homepage.component.spec';
import './app/components/data-explorer/data-explorer.component.spec';
import './app/components/series-configuration-bar/series-configuration-bar.component.spec';
import './app/components/charts/charts.component.spec';
