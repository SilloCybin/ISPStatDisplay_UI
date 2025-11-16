import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageComponent } from './home-page.component';
import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {HomePageService} from '../services/home-page.service';
import {of, Subject, throwError} from 'rxjs';
import {AveragesInterface} from '../models/interfaces/averages.interface';
import {SpeedtestInterface} from '../models/interfaces/speedtest.interface';
import {Component, NO_ERRORS_SCHEMA} from '@angular/core';

@Component({selector: 'ngx-slick-carousel', template: ''})
class MockSlickCarouselComponent {}

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  let service: HomePageService;
  let httpMock: HttpTestingController;
  let averagesMockStream$: Subject<AveragesInterface>;
  let speedtestDataMockStream$: Subject<SpeedtestInterface>;

  let averagesMock: AveragesInterface = {
    downloadBandwidth : 55517188,
    uploadBandwidth : 12774742,
    downloadPingLatency : 6.26132,
    uploadPingLatency : 9.88004,
    idlePingLatency : 2.40281,
    downloadPingHigh : 143.071,
    uploadPingHigh : 163.655,
    idlePingHigh : 2.72327,
    downloadPingLow : 1.6918,
    uploadPingLow : 2.87336,
    idlePingLow : 2.03654,
    downloadPingJitter : 4.08998,
    uploadPingJitter : 6.18479,
    idlePingJitter : 0.324705,
    packetLoss : 0.344289
  }

  let averagesMockStream: AveragesInterface = {
    downloadBandwidth : 55517188,
    uploadBandwidth : 12774742,
    downloadPingLatency : 6.26132,
    uploadPingLatency : 9.88004,
    idlePingLatency : 2.40281,
    downloadPingHigh : 143.071,
    uploadPingHigh : 163.655,
    idlePingHigh : 2.72327,
    downloadPingLow : 1.6918,
    uploadPingLow : 2.87336,
    idlePingLow : 2.03654,
    downloadPingJitter : 4.08998,
    uploadPingJitter : 6.18479,
    idlePingJitter : 0.324705,
    packetLoss : 0.344288
  }

  let speedtestDataMock: SpeedtestInterface = {
    timestamp : new Date('2025-11-14T16:00:23Z'),
    idlePing : {
      jitter : 1.24,
      latency : 2.814,
      low : 1.234,
      high : 3.477
    },
    downloadTest : {
      bandwidth : 64808680,
      bytes : 416947200,
      elapsed : 6414.0,
      downloadPing : {
        jitter : 2.454,
        latency : 9.37,
        low : 1.86,
        high : 21.357
      }
    },
    uploadTest : {
      bandwidth : 12234613,
      bytes : 83626200,
      elapsed : 6810.0,
      uploadPing : {
        jitter : 2.675,
        latency : 8.054,
        low : 1.481,
        high : 36.74
      }
    },
    packetLoss : 0.0,
    isp : 'Vodafone Portugal',
    server : {
      server_id : 30945,
      hostname : 'speedtest-ga1.meo.pt',
      port : 8080,
      provider : 'MEO',
      location : 'Gaia',
      country : 'Portugal',
      ip : '212.55.137.228'
    }
  }

  let speedtestDataMockStream: SpeedtestInterface = {
    timestamp : new Date('2025-11-14T16:00:23Z'),
    idlePing : {
      jitter : 1.24,
      latency : 2.814,
      low : 1.234,
      high : 3.477
    },
    downloadTest : {
      bandwidth : 64808680,
      bytes : 416947200,
      elapsed : 6414.0,
      downloadPing : {
        jitter : 2.454,
        latency : 9.37,
        low : 1.86,
        high : 21.357
      }
    },
    uploadTest : {
      bandwidth : 12234613,
      bytes : 83626200,
      elapsed : 6810.0,
      uploadPing : {
        jitter : 2.675,
        latency : 8.054,
        low : 1.481,
        high : 36.74
      }
    },
    packetLoss : 0.0,
    isp : 'Vodafone Portugal',
    server : {
      server_id : 30945,
      hostname : 'speedtest-ga1.meo.pt',
      port : 8080,
      provider : 'MEO',
      location : 'Gaia',
      country : 'Portugal',
      ip : '212.55.137.229'
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePageComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        HomePageService,
        provideHttpClient(),
        provideHttpClientTesting()
      ],
    }).overrideComponent(HomePageComponent, {
      set: {
        imports: [
          MockSlickCarouselComponent,
        ]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;

    service = TestBed.inject(HomePageService);
    httpMock = TestBed.inject(HttpTestingController);
  });


  it('should be created', () => {
    expect(component).toBeTruthy();
  });


  it('should load SpeedtestData and Averages data on component instantiation', () => {

    spyOn(service, 'getAverages').and.returnValue(of(averagesMock));
    spyOn(service, 'getLatestSpeedtestData').and.returnValue(of(speedtestDataMock));

    fixture.detectChanges();

    expect(component.averages).toEqual(averagesMock);
    expect(component.latestSpeedtestData).toEqual(speedtestDataMock);
    expect(component.timestamp).toEqual(new Date('2025-11-14T16:00:23Z'));
    expect(component.carouselItemList.length).toBeGreaterThan(0);
  })


  it('should load updated SpeedtestData and Averages when streams push new data', () => {

    averagesMockStream$ = new Subject<AveragesInterface>();
    speedtestDataMockStream$ = new Subject<SpeedtestInterface>();

    spyOn(service, 'streamAverages').and.returnValue(averagesMockStream$);
    spyOn(service, 'streamSpeedtestData').and.returnValue(speedtestDataMockStream$);

    fixture.detectChanges();

    averagesMockStream$.next(averagesMockStream);
    speedtestDataMockStream$.next(speedtestDataMockStream);

    expect(component.averages).toEqual(averagesMockStream);
    expect(component.latestSpeedtestData).toEqual(speedtestDataMockStream);
    expect(component.timestamp).toEqual(new Date('2025-11-14T16:00:23Z'));
    expect(component.carouselItemList.length).toBeGreaterThan(0);
  })


  it('should log an error whenever one of the requests fails', () => {
    const error = new Error('Request failed');

    spyOn(service, 'getAverages').and.returnValue(throwError(() => error));
    spyOn(service, 'getLatestSpeedtestData').and.returnValue(of(speedtestDataMock));

    const spy = spyOn(console, 'error');

    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith('Error fetching data:', 'Request failed');
  })


  it('should log an error whenever one of the streams fails', () => {
    const error = new Error('Stream failed');

    averagesMockStream$ = new Subject<AveragesInterface>();
    speedtestDataMockStream$ = new Subject<SpeedtestInterface>();

    spyOn(service, 'streamAverages').and.returnValue(averagesMockStream$);
    spyOn(service, 'streamSpeedtestData').and.returnValue(throwError(() => error));

    const spy = spyOn(console, 'error');

    fixture.detectChanges();

    averagesMockStream$.next(averagesMockStream);
    speedtestDataMockStream$.next(speedtestDataMockStream);

    expect(spy).toHaveBeenCalledWith('Error fetching data:', 'Stream failed');
  })
});
