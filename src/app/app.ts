import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatTabLink, MatTabNav, MatTabNavPanel} from '@angular/material/tabs';
import {MatIcon} from '@angular/material/icon';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatIconButton} from '@angular/material/button';
import {AuthService} from './services/auth/auth.service';
import {filter, takeUntil, tap} from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [
    MatTabLink,
    MatTabNav,
    MatTabNavPanel,
    RouterLinkActive,
    RouterOutlet,
    RouterLink,
    MatIcon,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    MatIconButton
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit{

  protected readonly title: WritableSignal<string> = signal('Speedtest Analytics');

  disableAccountButton: boolean = true;


  constructor(private router: Router, private authService: AuthService){}


  ngOnInit(){
    this.authService.loggedIn$.subscribe((loggedIn) => {
      if (!loggedIn){
        this.disableAccountButton = true;
        this.router.navigate(['/login']);
      } else {
        this.disableAccountButton = false;
      }
    })
  }

  logout() {
    this.authService.logout();
  }
}
