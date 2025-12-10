import {HttpErrorResponse} from '@angular/common/http';

const signupHttpStatusMessages: Record<number, string> = {
  0: 'Cannot reach the server',
  400: 'Invalid input',
  401: 'Unauthorized',
  403: 'Action forbidden',
  409: 'Username already taken',
  500: 'Server error'
};

const loginHttpStatusMessages: Record<number, string> = {
  0: 'Cannot reach the server',
  400: 'Invalid input',
  401: 'Unauthorized',
  403: 'Wrong username or password',
  500: 'Server error'
};

export function userHttpErrorHandler(error: HttpErrorResponse, errorMessageBase: string): string {
  if (errorMessageBase.includes('account')){
    return errorMessageBase + (signupHttpStatusMessages[error.status] || 'Unexpected error');
  } else if (errorMessageBase.includes('sign in')){
    return errorMessageBase + (loginHttpStatusMessages[error.status] || 'Unexpected error');
  } else {
    return 'Unexpected error';
  }

}
