import {Injectable} from '@angular/core';
import {
  CanActivate, CanActivateChild,
  Router
} from '@angular/router';
import {AuthService} from '../services/auth/auth.service';
import {Observable, tap} from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate, CanActivateChild {


  constructor(private authService: AuthService, private router: Router) {}


  canActivate(): Observable<boolean> {
    return this.authService.loggedIn$.pipe(
      tap(isLoggedIn => {
        if (!isLoggedIn) {
          this.router.navigate(['/login']);
        }
      })
    );
  }

  canActivateChild(): Observable<boolean> {
    return this.canActivate();
  }

}
