import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {AuthService} from '../../services/auth/auth.service';
import {MatButton, MatIconButton} from '@angular/material/button';
import {filter, Subject, Subscription, take, takeUntil, tap} from 'rxjs';
import {Router, RouterLink} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {userHttpErrorHandler} from '../../utils/user-http-error-handler';

@Component({
  selector: 'app-login',
  imports: [
    MatFormField,
    ReactiveFormsModule,
    MatInput,
    MatButton,
    MatIcon,
    RouterLink,
    MatIconButton,
    MatLabel,
    MatError
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit, OnDestroy{

  credentials: FormGroup = new FormGroup({
    username: new FormControl<string | null>(null, [Validators.required, Validators.email]),
    password: new FormControl<string | null>(null, [Validators.required])
  })

  loginError: string = '';

  destroySubject: Subject<void> = new Subject<void>();


  constructor(private authService: AuthService, private router: Router) {}


  ngOnInit(){
    this.authService.loggedIn$.pipe(
      takeUntil(this.destroySubject),
      filter(loggedIn => loggedIn),
      tap(() => this.router.navigate(['/homepage'])))
      .subscribe();
  }

  onSubmit(){
    const username: string = this.credentials.get("username")?.value;
    const password: string = this.credentials.get("password")?.value;

    if (username && password){
      this.authService.login(username, password).pipe(takeUntil(this.destroySubject)).subscribe({
        next: () => {
          this.router.navigate(['/homepage']);
        },
        error: (err) => {
          const errorMessage = 'Could not sign in: ';
          this.loginError = userHttpErrorHandler(err, errorMessage);
        }
      });
    }
  }

  onErrorMessageClear() {
    this.loginError = '';
    this.credentials.get('password')?.setValue('');
  }

  ngOnDestroy(){
    this.destroySubject.next();
    this.destroySubject.complete();
  }
}
