import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, catchError, map, Observable, throwError} from 'rxjs';
import {SpeedtestInterface} from '../models/interfaces/speedtest-interface';
import {MetricPoint} from '../models/classes/metric-point';
import {AveragesInterface} from '../models/interfaces/averages-interface';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpeedtestService {

  private apiBaseUrl = environment.apiBaseUrl;

  private selectedMetricsSubject = new BehaviorSubject<string[]>([]);
  selectedMetric$ = this.selectedMetricsSubject.asObservable();

  constructor(private httpClient: HttpClient) {}

  getLatestTest(): Observable<SpeedtestInterface> {
    return this.httpClient.get<SpeedtestInterface>(`${this.apiBaseUrl}/getLatestSpeedtestData`)
      .pipe(
        map(data => ({...data})),
        catchError(this.handleError)
      );
  }

  setSelectedMetrics(selectedMetrics: string[]){
    this.selectedMetricsSubject.next(selectedMetrics);
  }

  getMetricPoints(metric: string): Observable<MetricPoint[]> {
    metric = metric.charAt(0).toUpperCase() + metric.slice(1);
    return this.httpClient.get<MetricPoint[]>(`${this.apiBaseUrl}/getAll${metric}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  clearSelection() {
    this.selectedMetricsSubject.next([]);
  }

  getMetricsAverages(): Observable<AveragesInterface> {
    return this.httpClient.get<AveragesInterface>(`${this.apiBaseUrl}/getAverages`)
      .pipe(
        map(data => ({...data})),
        catchError(this.handleError));
  }

  /***************************************
   Error handling for HttpClient.get()s
   ****************************************/

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

}
