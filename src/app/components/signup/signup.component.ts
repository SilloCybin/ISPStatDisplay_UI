import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatError, MatFormField} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput, MatLabel} from '@angular/material/input';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';
import {tick} from '@angular/core/testing';
import {userHttpErrorHandler} from '../../utils/user-http-error-handler';
import {Subject, Subscription, takeUntil} from 'rxjs';

@Component({
  selector: 'app-signup',
  imports: [
    MatButton,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    RouterLink,
    FormsModule,
    MatError
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent implements OnDestroy {

  credentials: FormGroup = new FormGroup({
    username: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(8)]),
    passwordCheck: new FormControl<string>('', [Validators.required])
  }, {
    validators: this.passwordsMatchValidator
  });

  signupError: string = '';
  signupSuccess: string = '';

  destroySubject: Subject<void> = new Subject<void>()


  constructor(private authService: AuthService, private router: Router) {}


  onSubmit(){
    this.signupError = '';
    const username: string = this.credentials.get("username")?.value;
    const password: string = this.credentials.get("password")?.value;

    if (username && password){
      this.authService.signup(username, password).pipe(takeUntil(this.destroySubject)).subscribe({
        next: () => {
          this.signupSuccess = 'Account creation successful. Redirecting to login page.'
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000)
        },
        error: (err) => {
          const errorMessage = 'Could not create account: ';
          this.signupError = userHttpErrorHandler(err, errorMessage);
        }
      });
    }
  }

  onErrorMessageClear() {
    this.signupError = '';
    this.credentials.get('username')?.setValue('');
    this.credentials.get('password')?.setValue('');
    this.credentials.get('passwordCheck')?.setValue('');
  }

  passwordsMatchValidator(group: AbstractControl): ValidationErrors | null{
    const password = group.get('password')?.value;
    const passwordCheck = group.get('passwordCheck')?.value;

    if (passwordCheck.length > 0 && password !== passwordCheck) {
      group.get('passwordCheck')?.setErrors({ passwordsMismatch: true });
    }

    return null;
  }

  ngOnDestroy(){
    this.destroySubject.next();
    this.destroySubject.complete();
  }

}
