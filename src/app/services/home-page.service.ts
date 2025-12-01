import {Injectable, NgZone} from '@angular/core';
import {catchError, map, Observable, throwError} from 'rxjs';
import {AveragesInterface} from '../models/interfaces/averages.interface';
import {environment} from '../../environments/environment';
import {SpeedtestInterface} from '../models/interfaces/speedtest.interface';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {handleError} from './http-error-handler';
import {StandardDeviationsInterface} from '../models/interfaces/standard-deviations.interface';

@Injectable({
  providedIn: 'root'
})
export class HomePageService {

  private apiBaseUrl = environment.apiBaseUrl;

  constructor(private zone: NgZone, private httpClient: HttpClient){}

  private createSSE<T> (url: string, eventName: string): Observable<T>{
    return new Observable<T>(observer => {

      const source = new EventSource(url);

      source.addEventListener(eventName, (event: MessageEvent) => {
        this.zone.run(() => observer.next(JSON.parse(event.data)));
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
        catchError(handleError));
  }

  getLatestSpeedtestData(): Observable<SpeedtestInterface> {
    return this.httpClient.get<SpeedtestInterface>(`${this.apiBaseUrl}/getLatestSpeedtestData`)
      .pipe(
        map(data => ({...data})),
        catchError(handleError)
      );
  }

  getStandardDeviations(): Observable<StandardDeviationsInterface> {
    return this.httpClient.get<StandardDeviationsInterface>(`${this.apiBaseUrl}/getStandardDeviations`)
      .pipe(
        map(data => ({...data})),
        catchError(handleError)
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
