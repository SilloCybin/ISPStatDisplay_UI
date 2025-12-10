import {Injectable, NgZone} from '@angular/core';
import {catchError, map, Observable, throwError} from 'rxjs';
import {AveragesInterface} from '../../models/interfaces/averages.interface';
import {environment} from '../../../environments/local/environment';
import {SpeedtestInterface} from '../../models/interfaces/speedtest.interface';
import {HttpClient} from '@angular/common/http';
import {StandardDeviationsInterface} from '../../models/interfaces/standard-deviations.interface';
import {AuthService} from '../auth/auth.service';
import {EventSourcePolyfill} from 'event-source-polyfill';

@Injectable({
  providedIn: 'root'
})
export class HomepageService {

  private apiBaseUrl = environment.apiBaseUrl;


  constructor(private zone: NgZone, private httpClient: HttpClient, private authService: AuthService){}


  private createSSE<T> (url: string, eventName: string): Observable<T>{

    return new Observable<T>(observer => {
      const token = this.authService.getToken();
      const source = new EventSourcePolyfill(url, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        heartbeatTimeout: 61000
      });

      (source as any).addEventListener(eventName, (event: MessageEvent) => {
        this.zone.run(() => observer.next(JSON.parse(event.data) as T));
      });

      source.onopen = () => console.log(`Connected to SSE at ${url} for event ${eventName}`);

      source.onerror = error => {
        console.error('SSE error : '+ error);
        source.close();
        observer.error(error);
      }

      return () => source.close();
    })
  }

  getAverages(): Observable<AveragesInterface> {
    return this.httpClient.get<AveragesInterface>(`${this.apiBaseUrl}/getAverages`)
      .pipe(
        map(data => ({...data})),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  getLatestSpeedtestData(): Observable<SpeedtestInterface> {
    return this.httpClient.get<SpeedtestInterface>(`${this.apiBaseUrl}/getLatestSpeedtestData`)
      .pipe(
        map(data => ({...data})),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  getStandardDeviations(): Observable<StandardDeviationsInterface> {
    return this.httpClient.get<StandardDeviationsInterface>(`${this.apiBaseUrl}/getStandardDeviations`)
      .pipe(
        map(data => ({...data})),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  streamAverages(): Observable<AveragesInterface>{
    return this.createSSE<AveragesInterface>(`${this.apiBaseUrl}/averagesStream`, 'averages-update');
  }

  streamSpeedtestData(): Observable<SpeedtestInterface>{
    return this.createSSE<SpeedtestInterface>(`${this.apiBaseUrl}/speedtestDataStream`, 'speedtest_data-update');
  }

  streamStandardDeviations(): Observable<StandardDeviationsInterface>{
    return this.createSSE<StandardDeviationsInterface>(`${this.apiBaseUrl}/standardDeviationsStream`, 'standard_deviations-update');
  }

}
