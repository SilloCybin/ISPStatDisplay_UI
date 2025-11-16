import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, catchError, Observable} from 'rxjs';
import {MetricPoint} from '../models/classes/metric-point';
import {environment} from '../../environments/environment';
import {TimeWindowSettings} from '../models/classes/time-window';
import {determineStartDateFromNow} from '../utils/start-date-calculator';
import {handleError} from "./http-error-handler";

@Injectable({
  providedIn: 'root'
})
export class MetricChartService {

  private apiBaseUrl = environment.apiBaseUrl;

  private selectedMetricsSubject: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  selectedMetric$: Observable<string[]> = this.selectedMetricsSubject.asObservable();

  private timeWindowSettingsSubject: BehaviorSubject<TimeWindowSettings> = new BehaviorSubject<TimeWindowSettings>(new TimeWindowSettings());
  timeWindowSettings$: Observable<TimeWindowSettings> = this.timeWindowSettingsSubject.asObservable();

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

  setSelectedTimeWindow(timeWindowSettings: TimeWindowSettings | undefined){
    if (timeWindowSettings instanceof TimeWindowSettings) {
      this.timeWindowSettingsSubject.next(timeWindowSettings);
    }
  }

  clearSelection() {
    this.selectedMetricsSubject.next([]);
    this.timeWindowSettingsSubject.next(new TimeWindowSettings());
  }

}
