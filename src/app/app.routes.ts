import {Routes} from '@angular/router';
import {HomepageComponent} from './components/home-page/homepage.component';
import {DataExplorer} from './components/data-explorer/data-explorer.component';
import {ChartContainerComponent} from './components/chart-container/chart-container.component';
import {AuthGuard} from './guards/auth.guard';
import {LoginComponent} from './components/login/login.component';
import {SignupComponent} from './components/signup/signup.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'homepage',
    component: HomepageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dataExplorer',
    component: DataExplorer,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'chart',
        component: ChartContainerComponent
      },
      {
        path: '',
        redirectTo: 'chart',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'homepage'
  },
  ];
