import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, catchError, map, Observable, throwError} from 'rxjs';
import {environment} from '../../../environments/local/environment';
import {TimeslotAveragesInterface} from '../../models/interfaces/timeslot-averages.interface';

@Injectable({
  providedIn: 'root',
})
export class HeatmapService {

  private apiBaseUrl: string = environment.apiBaseUrl;

  private selectedMetricSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  selectedMetric$: Observable<string> = this.selectedMetricSubject.asObservable();


  constructor(private httpClient: HttpClient) {}


  getTimeslotAverages(metric: string): Observable<TimeslotAveragesInterface[]>{
    return this.httpClient.get<TimeslotAveragesInterface[]>(`${this.apiBaseUrl}/getTimeslotAverages`, {
      params: {
        metric: metric
      }
    }).pipe(catchError(error => {
      return throwError(() => error);
    })
    );
  }

  setSelectedMetric(selectedMetric: string[]) {
    return ((selectedMetric.length === 1) ? this.selectedMetricSubject.next(selectedMetric[0]) : this.selectedMetricSubject.next(''));
  }
}
