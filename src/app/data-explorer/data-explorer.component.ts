import { Component } from '@angular/core';
import {DataExplorerSidebarComponent} from '../data-explorer-sidebar/data-explorer-sidebar.component';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-data-explorer',
  imports: [
    DataExplorerSidebarComponent,
    RouterOutlet
  ],
  templateUrl: './data-explorer.component.html',
  styleUrl: './data-explorer.component.css'
})
export class DataExplorer {

  constructor() {}

}
