import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { DataExplorer } from './data-explorer/data-explorer.component';
import {ChartContainerComponent} from './chart-container/chart-container.component';

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
        component: ChartContainerComponent
      },
      {
        path: '',
        redirectTo: 'MetricChart',
        pathMatch: 'full'
      }
    ]
  }
  ];
