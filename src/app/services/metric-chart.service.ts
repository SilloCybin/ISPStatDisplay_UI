import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, catchError, map, Observable, startWith, throwError} from 'rxjs';
import {SpeedtestInterface} from '../models/interfaces/speedtest.interface';
import {MetricPoint} from '../models/classes/metric-point';
import {AveragesInterface} from '../models/interfaces/averages.interface';
import {environment} from '../../environments/environment';
import {TimeWindowSettings} from '../models/classes/time-window';
import {determineStartDateFromNow} from '../utils/start-date-calculator';
import { handleError } from "./http-error-handler";

@Injectable({
  providedIn: 'root'
})
export class MetricChartService {

  private apiBaseUrl = environment.apiBaseUrl;

  private selectedMetricsSubject = new BehaviorSubject<string[]>([]);
  selectedMetric$ = this.selectedMetricsSubject.asObservable();

  private timeWindowSettingsSubject = new BehaviorSubject<TimeWindowSettings>(new TimeWindowSettings());
  timeWindowSettings$ = this.timeWindowSettingsSubject.asObservable();

  constructor(private httpClient: HttpClient) {}

  setSelectedMetrics(selectedMetrics: string[]){
    this.selectedMetricsSubject.next(selectedMetrics);
  }

  getMetricPoints(metric: string, timeWindowSettings: TimeWindowSettings): Observable<MetricPoint[]> {
    if (timeWindowSettings.timeUnitNumber && timeWindowSettings.timeUnit){

      const startDate = determineStartDateFromNow(timeWindowSettings.timeUnitNumber, timeWindowSettings.timeUnit);

      return this.httpClient.get<MetricPoint[]>(
        `${this.apiBaseUrl}/fromStartDate/${metric}`, {
          params: {
            startDate: startDate.toISOString()
          }
        }
      ).pipe(
        catchError(handleError)
      );

    } else if (timeWindowSettings.startDate) {

      return this.httpClient.get<MetricPoint[]>(
        `${this.apiBaseUrl}/fromStartDate/${metric}`, {
          params: {
            startDate: timeWindowSettings.startDate.toISOString()
          }
        }
      ).pipe(
        catchError(handleError)
      );

    } else if (timeWindowSettings.dateRange) {

      const startDate = timeWindowSettings.dateRange.get("start");
      const endDate = timeWindowSettings.dateRange.get("end");

      return this.httpClient.get<MetricPoint[]>(
        `${this.apiBaseUrl}/dateRange/${metric}`, {
          params: {
            startDate: startDate?.value.toISOString(),
            endDate: endDate?.value.toISOString()
          }
        }
      ).pipe(
        catchError(handleError)
      );

    } else {
      // Entire history was selected
      return this.httpClient.get<MetricPoint[]>(`${this.apiBaseUrl}/getAll/${metric}`)
        .pipe(
          catchError(handleError)
        );
    }

  }

  clearSelection() {
    this.selectedMetricsSubject.next([]);
    this.timeWindowSettingsSubject.next(new TimeWindowSettings());
  }

  setSelectedTimeWindow(timeWindowSettings: TimeWindowSettings | undefined){
    if (timeWindowSettings instanceof TimeWindowSettings) {
      this.timeWindowSettingsSubject.next(timeWindowSettings);
    }
  }

}
