import { Component, signal } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatTabLink, MatTabNav, MatTabNavPanel} from '@angular/material/tabs';

@Component({
  selector: 'app-root',
  imports: [MatTabLink, MatTabNav, MatTabNavPanel, RouterLinkActive, RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('SpeedDataVisualizer');
}
