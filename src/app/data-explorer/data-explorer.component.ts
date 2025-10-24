import { Component } from '@angular/core';
import {DataExplorerSidebar} from '../data-explorer-sidebar/data-explorer-sidebar';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-data-explorer',
  imports: [
    DataExplorerSidebar,
    RouterOutlet
  ],
  templateUrl: './data-explorer.component.html',
  styleUrl: './data-explorer.component.css'
})
export class DataExplorer {

  constructor() {}

}
