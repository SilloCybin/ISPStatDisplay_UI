import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, catchError, Observable, Subject} from 'rxjs';
import {Coordinate} from '../models/classes/coordinate';
import {environment} from '../../environments/environment';
import {TimeWindowSettings} from '../models/classes/time-window';
import {determineStartDateFromNow} from '../utils/start-date-calculator';
import {handleError} from "./http-error-handler";
import {AbstractControl} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CoordinatesService {

  private apiBaseUrl: string = environment.apiBaseUrl;

  private selectedMetricsSubject: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  selectedMetric$: Observable<string[]> = this.selectedMetricsSubject.asObservable();

  private timeWindowSettingsSubject: BehaviorSubject<TimeWindowSettings> = new BehaviorSubject<TimeWindowSettings>(new TimeWindowSettings());
  timeWindowSettings$: Observable<TimeWindowSettings> = this.timeWindowSettingsSubject.asObservable();

  private resetTrendlinesSubject: Subject<void> = new Subject<void>();
  resetTrendlines$: Observable<void> = this.resetTrendlinesSubject.asObservable();

  constructor(private httpClient: HttpClient) {}


  getCoordinates(metric: string, timeWindowSettings: TimeWindowSettings, trendline?: string, parameter?: number): Observable<Coordinate[]> {

    if (timeWindowSettings.timeUnitNumber && timeWindowSettings.timeUnit){
      const startDate: Date = determineStartDateFromNow(timeWindowSettings.timeUnitNumber, timeWindowSettings.timeUnit);

      if (trendline === undefined) {
        return this.httpClient.get<Coordinate[]>(
          `${this.apiBaseUrl}/fromStartDate/${metric}`, {
            params: {
              startDate: startDate.toISOString()
            }
          }
        ).pipe(
          catchError(handleError)
        );
      } else if (trendline === 'polynomialRegression' && parameter !== undefined) {
        return this.httpClient.get<Coordinate[]>(
          `${this.apiBaseUrl}/getTrendlineFromStartDate/${metric}/${trendline}`, {
            params: {
              startDate: startDate.toISOString(),
              degree: parameter
            }
          }
        ).pipe(
          catchError(handleError)
        );
      } else if (trendline === 'exponentialSmoothing' && parameter !== undefined){
        return this.httpClient.get<Coordinate[]>(
          `${this.apiBaseUrl}/getTrendlineFromStartDate/${metric}/${trendline}`, {
            params: {
              startDate: startDate.toISOString(),
              alpha: parameter
            }
          }
        ).pipe(
          catchError(handleError)
        );
      }

    } else if (timeWindowSettings.startDate) {

      if (trendline === undefined) {
        return this.httpClient.get<Coordinate[]>(
          `${this.apiBaseUrl}/fromStartDate/${metric}`, {
            params: {
              startDate: timeWindowSettings.startDate.toISOString()
            }
          }
        ).pipe(
          catchError(handleError)
        );
      } else if (trendline === 'polynomialRegression' && parameter !== undefined) {
        return this.httpClient.get<Coordinate[]>(
          `${this.apiBaseUrl}/getTrendlineFromStartDate/${metric}/${trendline}`, {
            params: {
              startDate: timeWindowSettings.startDate.toISOString(),
              degree: parameter
            }
          }
        ).pipe(
          catchError(handleError)
        );
      } else if (trendline === 'exponentialSmoothing' && parameter !== undefined) {
        return this.httpClient.get<Coordinate[]>(
          `${this.apiBaseUrl}/getTrendlineFromStartDate/${metric}/${trendline}`, {
            params: {
              startDate: timeWindowSettings.startDate.toISOString(),
              alpha: parameter
            }
          }
        ).pipe(
          catchError(handleError)
        );
      }

    } else if (timeWindowSettings.dateRange) {
      const startDate: AbstractControl<any, any> | null = timeWindowSettings.dateRange.get("start");
      const endDate: AbstractControl<any, any> | null = timeWindowSettings.dateRange.get("end");

      if (trendline === undefined){
        return this.httpClient.get<Coordinate[]>(
          `${this.apiBaseUrl}/dateRange/${metric}`, {
            params: {
              startDate: startDate?.value.toISOString(),
              endDate: endDate?.value.toISOString()
            }
          }
        ).pipe(
          catchError(handleError)
        );
      } else if (trendline === 'polynomialRegression' && parameter !== undefined) {
        return this.httpClient.get<Coordinate[]>(
          `${this.apiBaseUrl}/getTrendlineOnDateRange/${metric}/${trendline}`, {
            params: {
              startDate: startDate?.value.toISOString(),
              endDate: endDate?.value.toISOString(),
              degree: parameter
            }
          }
        ).pipe(
          catchError(handleError)
        );
      } else if (trendline === 'exponentialSmoothing' && parameter !== undefined) {
        return this.httpClient.get<Coordinate[]>(
          `${this.apiBaseUrl}/getTrendlineOnDateRange/${metric}/${trendline}`, {
            params: {
              startDate: startDate?.value.toISOString(),
              endDate: endDate?.value.toISOString(),
              alpha: parameter
            }
          }
        ).pipe(
          catchError(handleError)
        );
      }

    } else {
      // Entire history was selected
      if (trendline === undefined){
        return this.httpClient.get<Coordinate[]>(`${this.apiBaseUrl}/getAll/${metric}`)
          .pipe(
            catchError(handleError)
          );
      } else if (trendline === 'polynomialRegression' && parameter !== undefined){
        return this.httpClient.get<Coordinate[]>(`${this.apiBaseUrl}/getEntireTrendline/${metric}/${trendline}`, {
          params: {
            degree: parameter
          }
        })
          .pipe(
            catchError(handleError)
          );
      } else if (trendline === 'exponentialSmoothing' && parameter !== undefined){
        return this.httpClient.get<Coordinate[]>(`${this.apiBaseUrl}/getEntireTrendline/${metric}/${trendline}`, {
          params: {
            alpha: parameter
          }
        })
          .pipe(
            catchError(handleError)
          );
      }
    }
    return new Observable<Coordinate[]>();
  }

  setSelectedMetrics(selectedMetrics: string[]){
    this.selectedMetricsSubject.next(selectedMetrics);
  }

  setSelectedTimeWindow(timeWindowSettings: TimeWindowSettings | undefined){
    if (timeWindowSettings instanceof TimeWindowSettings) {
      this.timeWindowSettingsSubject.next(timeWindowSettings);
    }
  }

  clearSelection() {
    this.selectedMetricsSubject.next([]);
    this.timeWindowSettingsSubject.next(new TimeWindowSettings());
  }

  resetTrendlines() {
    this.resetTrendlinesSubject.next();
  }
}
