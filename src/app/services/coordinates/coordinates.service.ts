import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, catchError, Observable, Subject, throwError} from 'rxjs';
import {Coordinate} from '../../models/classes/coordinate';
import {environment} from '../../../environments/local/environment';
import {TimeWindowSettings} from '../../models/classes/time-window';
import {determineStartDateFromNow} from '../../utils/time-ops';

@Injectable({
  providedIn: 'root'
})
export class CoordinatesService {

  private apiBaseUrl: string = environment.apiBaseUrl;

  private selectedMetricsSubject: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  selectedMetrics$: Observable<string[]> = this.selectedMetricsSubject.asObservable();

  private timeWindowSettingsSubject: BehaviorSubject<TimeWindowSettings> = new BehaviorSubject<TimeWindowSettings>(new TimeWindowSettings());
  timeWindowSettings$: Observable<TimeWindowSettings> = this.timeWindowSettingsSubject.asObservable();

  private resetTrendlinesSelectionsSubject: Subject<void> = new Subject<void>();
  resetTrendlinesSelections$: Observable<void> = this.resetTrendlinesSelectionsSubject.asObservable();


  constructor(private httpClient: HttpClient) {}


  getCoordinates(metric: string, timeWindowSettings: TimeWindowSettings, trendline?: string, parameter?: number): Observable<Coordinate[]> {

    let startDate: any;
    let endDate: any;

    if (timeWindowSettings.timeUnitNumber && timeWindowSettings.timeUnit){
      startDate = determineStartDateFromNow(timeWindowSettings.timeUnitNumber, timeWindowSettings.timeUnit);
    } else if (timeWindowSettings.startDate){
      startDate = timeWindowSettings.startDate;
    } else if (timeWindowSettings.dateRange){
      startDate = timeWindowSettings.dateRange.get("start")?.value;
      endDate = timeWindowSettings.dateRange.get("end")?.value;
    }

    return this.httpClient.get<Coordinate[]>(`${this.apiBaseUrl}/getSeries`, {
        params: {
          metric: metric,
          ...(startDate !== undefined && {startDate: startDate.toISOString()}),
          ...(endDate !== undefined && {endDate: endDate.toISOString()}),
          ...(trendline !== undefined && {trendline: trendline}),
          ...(parameter !== undefined && {parameter: parameter})
        }
      }
    ).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    )
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

  resetTrendlinesSelections() {
    this.resetTrendlinesSelectionsSubject.next();
  }
}
