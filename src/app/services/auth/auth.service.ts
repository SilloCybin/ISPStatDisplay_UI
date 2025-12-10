import { Injectable } from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, tap, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/local/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private tokenKey: string = 'auth_token';

  private loggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject(this.hasToken());
  loggedIn$: Observable<boolean> = this.loggedInSubject.asObservable();

  private apiBaseUrl: string = environment.apiBaseUrl;


  constructor(private httpClient: HttpClient) {}


  login(username: string, password: string): Observable<{token: string}>{
    return this.httpClient.post<{token: string}>(`${this.apiBaseUrl}/auth/login`, {username, password}).pipe(
      tap(result => {
        sessionStorage.setItem(this.tokenKey, result.token);
        this.loggedInSubject.next(true);
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  signup(username: string, password: string) {
    return this.httpClient.post(`${this.apiBaseUrl}/auth/signup`, {username, password})
  }

  logout(){
    sessionStorage.removeItem(this.tokenKey);
    this.loggedInSubject.next(false)
  }

  getToken(): string | null{
    return sessionStorage.getItem(this.tokenKey);
  }

  private hasToken(): boolean{
    return !!sessionStorage.getItem(this.tokenKey);
  }

}
