import { TestBed } from '@angular/core/testing';
import { HomepageService } from './homepage.service';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AveragesInterface } from '../../models/interfaces/averages.interface';
import { SpeedtestInterface } from '../../models/interfaces/speedtest.interface';
import { Observable, of } from 'rxjs';

describe('HomePageService', () => {
  let service: HomepageService;
  let httpMock: HttpTestingController;

  const mockAverages: AveragesInterface = {
    downloadBandwidth: 11,
    uploadBandwidth: 11,
    downloadPingLatency: 1.1,
    uploadPingLatency: 1.1,
    idlePingLatency: 1.1,
    downloadPingLow: 1.1,
    uploadPingLow: 1.1,
    idlePingLow: 1.1,
    downloadPingHigh: 1.1,
    uploadPingHigh: 1.1,
    idlePingHigh: 1.1,
    downloadPingJitter: 1.1,
    uploadPingJitter: 1.1,
    idlePingJitter: 1.1,
    packetLoss: 1.1,
  };

  const mockSpeedtestData: SpeedtestInterface = {
    isp: 'Vodafone Portugal',
    packetLoss: 3.9801,
    timestamp: new Date('2025-11-11T15:00:26Z'),
    downloadTest: {
      bandwidth: 65059956,
      bytes: 628815550,
      elapsed: 10010.0,
      downloadPing: {
        jitter: 10.459,
        latency: 10.205,
        low: 2.653,
        high: 654.731,
      },
    },
    uploadTest: {
      bandwidth: 12626938,
      bytes: 70889000,
      elapsed: 5606.0,
      uploadPing: {
        jitter: 13.614,
        latency: 7.872,
        low: 2.289,
        high: 234.585,
      },
    },
    idlePing: {
      jitter: 0.778,
      latency: 2.996,
      low: 2.291,
      high: 3.883,
    },
    server: {
      server_id: 30945,
      hostname: 'speedtest-ga1.meo.pt',
      port: 8080,
      provider: 'MEO',
      location: 'Gaia',
      country: 'Portugal',
      ip: '212.55.137.229',
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HomepageService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(HomepageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch Averages via HTTP GET request', () => {
    service.getAverages().subscribe((data) => {
      expect(data).toEqual(mockAverages);
    });

    const req = httpMock.expectOne(`${service['apiBaseUrl']}/getAverages`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAverages);
  });

  it('should fetch latest SpeedtestData via HTTP GET request', () => {
    service.getLatestSpeedtestData().subscribe((data) => {
      expect(data).toEqual(mockSpeedtestData);
    });

    const req = httpMock.expectOne(`${service['apiBaseUrl']}/getLatestSpeedtestData`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSpeedtestData);
  });

  it('should stream Averages via mocked SSE', (done) => {
    spyOn<any>(service, 'createSSE').and.callFake((url: string, eventName: any): Observable<AveragesInterface> => {
        expect(eventName).toBe('averages-update');
        return of(mockAverages);
      }
    );

    service.streamAverages().subscribe((data) => {
      expect(data).toEqual(mockAverages);
      done();
    });
  });

  it('should stream SpeedtestData via mocked SSE', (done) => {
    spyOn<any>(service, 'createSSE').and.callFake((url: string, eventName: any): Observable<SpeedtestInterface> => {
        expect(eventName).toBe('speedtest_data-update');
        return of(mockSpeedtestData);
      }
    );

    service.streamSpeedtestData().subscribe((data) => {
      expect(data).toEqual(mockSpeedtestData);
      done();
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
