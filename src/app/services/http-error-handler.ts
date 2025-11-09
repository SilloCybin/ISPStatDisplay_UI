import {HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';

export function handleError(error: HttpErrorResponse): Observable<never> {
  let errorMessage = 'An error occurred';
  if (error.error instanceof ErrorEvent) {
    errorMessage = `Error: ${error.error.message}`;
  } else {
    errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
  }
  console.error(errorMessage);

  return throwError(() => new Error(errorMessage));
}
