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

import './app/services/home-page.service.spec';
import './app/services/coordinates.service.spec';
import './app/home-page/home-page.component.spec';
import './app/data-explorer/data-explorer.component.spec';
import './app/data-explorer-sidebar/data-explorer-sidebar.component.spec';
import './app/chart-container/chart-container.component.spec';
