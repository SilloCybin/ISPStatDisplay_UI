import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { DataExplorer } from './data-explorer/data-explorer.component';
import {MetricChart} from './metric-chart/metric-chart';

export const routes: Routes = [
  {
    path: 'HomePage',
    component: HomePage
  },
  {
    path: '',
    redirectTo: 'HomePage',
    pathMatch: 'full'
  },
  {
    path: 'DataExplorer',
    component: DataExplorer,
    children: [
      {
        path: 'MetricChart',
        component: MetricChart
      },
      {
        path: '',
        redirectTo: 'MetricChart',
        pathMatch: 'full'
      }
    ]
  }
  ];
