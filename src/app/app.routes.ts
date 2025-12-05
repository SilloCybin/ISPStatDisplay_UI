import { Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { DataExplorer } from './components/data-explorer/data-explorer.component';
import {ChartContainerComponent} from './components/chart-container/chart-container.component';

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
        path: 'Chart',
        component: ChartContainerComponent
      },
      {
        path: '',
        redirectTo: 'Chart',
        pathMatch: 'full'
      }
    ]
  }
  ];
