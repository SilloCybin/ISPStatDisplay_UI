import {Injectable, NgZone} from '@angular/core';
import {Observable} from 'rxjs';
import {AveragesInterface} from '../models/interfaces/averages.interface';
import {environment} from '../../environments/environment';
import {SpeedtestInterface} from '../models/interfaces/speedtest.interface';

@Injectable({
  providedIn: 'root'
})
export class SpeedtestStreamService {

  private apiBaseUrl = environment.apiBaseUrl;

  constructor(private zone: NgZone){}

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

  getAveragesStream(): Observable<AveragesInterface>{
    return this.createSSE<AveragesInterface>(`${this.apiBaseUrl}/averagesStream`, 'averages-update');
  }

  getSpeedtestDataStream(): Observable<SpeedtestInterface>{
    return this.createSSE<SpeedtestInterface>(`${this.apiBaseUrl}/speedtestDataStream`, 'speedtest_data-update');
  }

}
