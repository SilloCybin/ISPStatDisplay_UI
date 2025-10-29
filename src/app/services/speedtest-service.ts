import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, catchError, map, Observable, startWith, throwError} from 'rxjs';
import {SpeedtestInterface} from '../models/interfaces/speedtest-interface';
import {MetricPoint} from '../models/classes/metric-point';
import {AveragesInterface} from '../models/interfaces/averages-interface';
import {environment} from '../../environments/environment';
import {TimeWindowSettings} from '../models/classes/time-window';
import {determineStartDateFromNow} from '../utils/start-date-calculator';

@Injectable({
  providedIn: 'root'
})
export class SpeedtestService {

  private apiBaseUrl = environment.apiBaseUrl;

  private selectedMetricsSubject = new BehaviorSubject<string[]>([]);
  selectedMetric$ = this.selectedMetricsSubject.asObservable();

  private timeWindowSettingsSubject = new BehaviorSubject<TimeWindowSettings>(new TimeWindowSettings());
  timeWindowSettings$ = this.timeWindowSettingsSubject.asObservable();

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

  getMetricPoints(metric: string, timeWindowSettings: TimeWindowSettings): Observable<MetricPoint[]> {
    if (timeWindowSettings.timeUnitNumber && timeWindowSettings.timeUnit){

      const startDate = determineStartDateFromNow(timeWindowSettings.timeUnitNumber, timeWindowSettings.timeUnit);

      return this.httpClient.get<MetricPoint[]>(
        `${this.apiBaseUrl}/fromStartDate/${metric}`, {
          params: {
            startDate: startDate.toISOString().split('T')[0]
          }
        }
      ).pipe(
        catchError(this.handleError)
      );

    } else if (timeWindowSettings.startDate) {

      return this.httpClient.get<MetricPoint[]>(
        `${this.apiBaseUrl}/fromStartDate/${metric}`, {
          params: {
            startDate: timeWindowSettings.startDate.toISOString().split('T')[0]
          }
        }
      ).pipe(
        catchError(this.handleError)
      );

    } else if (timeWindowSettings.dateRange) {

      const startDate = timeWindowSettings.dateRange.get("start");
      const endDate = timeWindowSettings.dateRange.get("end");

      return this.httpClient.get<MetricPoint[]>(
        `${this.apiBaseUrl}/dateRange/${metric}`, {
          params: {
            startDate: startDate?.value.toISOString().split('T')[0],
            endDate: endDate?.value.toISOString().split('T')[0]
          }
        }
      ).pipe(
        catchError(this.handleError)
      );

    } else {
      // Entire history was selected
      return this.httpClient.get<MetricPoint[]>(`${this.apiBaseUrl}/getAll/${metric}`)
        .pipe(
          catchError(this.handleError)
        );
    }

  }

  clearSelection() {
    this.selectedMetricsSubject.next([]);
    this.timeWindowSettingsSubject.next(new TimeWindowSettings());
  }

  getMetricsAverages(): Observable<AveragesInterface> {
    return this.httpClient.get<AveragesInterface>(`${this.apiBaseUrl}/getAverages`)
      .pipe(
        map(data => ({...data})),
        catchError(this.handleError));
  }

  setSelectedTimeWindow(timeWindowSettings: TimeWindowSettings | undefined){
    if (timeWindowSettings instanceof TimeWindowSettings) {
      this.timeWindowSettingsSubject.next(timeWindowSettings);
    }
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
