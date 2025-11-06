import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { DataExplorer } from './data-explorer/data-explorer.component';
import {MetricChartComponent} from './metric-chart/metric-chart.component';

export const routes: Routes = [
  {
    path: 'HomePage',
    component: HomePageComponent
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
        component: MetricChartComponent
      },
      {
        path: '',
        redirectTo: 'MetricChart',
        pathMatch: 'full'
      }
    ]
  }
  ];
