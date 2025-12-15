import { Component } from '@angular/core';
import {SeriesConfigurationBarComponent} from '../series-configuration-bar/series-configuration-bar.component';
import {Router, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-data-explorer',
  imports: [
    SeriesConfigurationBarComponent,
    RouterOutlet
  ],
  templateUrl: './data-explorer.component.html',
  styleUrl: './data-explorer.component.css'
})
export class DataExplorer {

  constructor(private router: Router) {}

  getCurrentURL(){
    return this.router.url;
  }

}
