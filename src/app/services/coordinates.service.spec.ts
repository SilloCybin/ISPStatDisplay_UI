import {TestBed} from '@angular/core/testing';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';

import {CoordinatesService} from './coordinates.service';
import {TimeWindowSettings} from '../models/classes/time-window';
import {FormControl, FormGroup} from '@angular/forms';
import {Coordinate} from '../models/classes/coordinate';


describe('CoordinatesService', () => {
  let service: CoordinatesService;
  let httpMock: HttpTestingController;

  const entireHistoryWindowSettingsMock: TimeWindowSettings = new TimeWindowSettings(
    true,
    null,
    null,
    null,
    null
  );

  const startDateWindowSettingsMock: TimeWindowSettings = new TimeWindowSettings(
    false,
    null,
    null,
    new Date('2025-11-11T15:00:26Z'),
    null
  );

  const xTimeUnitsBackWindowSettingsMock: TimeWindowSettings = new TimeWindowSettings(
    false,
    2,
    'days-0',
    null,
    null
  );

  const dateRangeFormGroupMock: FormGroup = new FormGroup({
    start: new FormControl<Date | null>(new Date('2025-11-11T15:00:26.000Z')),
    end: new FormControl<Date | null>(new Date('2025-11-12T15:00:26.000Z')),
  });

  const dateRangeWindowSettingsMock: TimeWindowSettings = new TimeWindowSettings(
    false,
    null,
    null,
    null,
    dateRangeFormGroupMock
  );

  const metricPointArrayMock = [
    {
      value: 1876783578,
      timestamp: new Date('2025-11-11T15:00:26Z'),
    },
    {
      value: 1876783579,
      timestamp: new Date('2025-11-12T15:00:26Z'),
    }
  ]

  const selectedMetricsMock = ["uploadBandwidth", "downloadBandwidth"];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CoordinatesService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(CoordinatesService);
    httpMock = TestBed.inject(HttpTestingController);
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should update metricsSelectionSubject when setSelectedMetrics() is called', () => {
    let result: string[] | undefined;

    service.selectedMetric$.subscribe(metrics => result = metrics);
    service.setSelectedMetrics(selectedMetricsMock);

    expect(result).toEqual(selectedMetricsMock);
  });


  it('should update timeWindowSettingsSubject when setSelectedTimeWindow() is called', () => {
    let result: TimeWindowSettings | undefined;

    service.timeWindowSettings$.subscribe(timeWindow => result = timeWindow);
    service.setSelectedTimeWindow(entireHistoryWindowSettingsMock);

    expect(result).toEqual(entireHistoryWindowSettingsMock);
  });


  it('should clear selectedMetrics and timeWindowSettings when clearSelection() is called', () => {
    let metricsResult: string[] | undefined;
    let timeWindowResult: TimeWindowSettings | undefined;

    service.setSelectedMetrics(selectedMetricsMock);
    service.setSelectedTimeWindow(entireHistoryWindowSettingsMock);
    service.clearSelection();

    service.selectedMetric$.subscribe(metrics => {
      metricsResult = metrics;
    });
    service.timeWindowSettings$.subscribe(timeWindowSettings => {
      timeWindowResult = timeWindowSettings;
    });

    expect(metricsResult).toEqual([]);
    expect(timeWindowResult).toEqual(new TimeWindowSettings());
  });


  it('should fetch entire metric series via HTTP GET request on /getSeries url', () => {
    let coordinates: Coordinate[] = [];

    service.getCoordinates('downloadBandwidth', entireHistoryWindowSettingsMock).subscribe(data => {
      coordinates = data;
    });

    const req = httpMock.expectOne(
      (request) => request.url === `${service['apiBaseUrl']}/getSeries`
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('metric')).toEqual('downloadBandwidth');
    expect(req.request.params.get('startDate')).toBeNull();
    expect(req.request.params.get('endDate')).toBeNull();
    expect(req.request.params.get('trendline')).toBeNull();
    expect(req.request.params.get('parameter')).toBeNull();
    req.flush(metricPointArrayMock);

    expect(coordinates).toEqual(metricPointArrayMock);
  });


  it('should fetch entire trendline via HTTP GET request on /getSeries url', () => {
    let coordinates: Coordinate[] = [];

    service.getCoordinates('downloadBandwidth', entireHistoryWindowSettingsMock, 'polynomialRegression', 2).subscribe(data => {
      coordinates = data;
    });

    const req = httpMock.expectOne(
      (request) => request.url === `${service['apiBaseUrl']}/getSeries`
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('metric')).toEqual('downloadBandwidth');
    expect(req.request.params.get('startDate')).toBeNull();
    expect(req.request.params.get('endDate')).toBeNull();
    expect(req.request.params.get('trendline')).toEqual('polynomialRegression');
    expect(Number(req.request.params.get('parameter'))).toEqual(2);
    req.flush(metricPointArrayMock);

    expect(coordinates).toEqual(metricPointArrayMock);
  });


  it('should fetch trendline from start date via HTTP GET request on /getSeries url', () => {
    let coordinates: Coordinate[] = [];
    const startDateString = '2025-11-11T15:00:26.000Z';

    service.getCoordinates('downloadBandwidth', startDateWindowSettingsMock, 'exponentialMovingAverage', 0.8).subscribe(data => {
      coordinates = data;
    });

    const req = httpMock.expectOne(
      (request) => request.url === `${service['apiBaseUrl']}/getSeries`
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('metric')).toEqual('downloadBandwidth');
    expect(req.request.params.get('startDate')).toEqual(startDateString);
    expect(req.request.params.get('endDate')).toBeNull();
    expect(req.request.params.get('trendline')).toEqual('exponentialMovingAverage');
    expect(Number(req.request.params.get('parameter'))).toEqual(0.8);
    req.flush(metricPointArrayMock);

    expect(coordinates).toEqual(metricPointArrayMock);
  });


  it('should fetch trendline series on date range via HTTP GET request on /getSeries url', () => {
    let coordinates: Coordinate[] = [];

    const startDateString = '2025-11-11T15:00:26.000Z';
    const endDateString = '2025-11-12T15:00:26.000Z';

    service.getCoordinates('downloadBandwidth', dateRangeWindowSettingsMock, 'polynomialRegression', 2).subscribe(data => {
      coordinates = data;
    });

    const req = httpMock.expectOne(
      (request) => request.url === `${service['apiBaseUrl']}/getSeries`
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('metric')).toEqual('downloadBandwidth');
    expect(req.request.params.get('startDate')).toEqual(startDateString);
    expect(req.request.params.get('endDate')).toEqual(endDateString);
    expect(req.request.params.get('trendline')).toEqual('polynomialRegression');
    expect(Number(req.request.params.get('parameter'))).toEqual(2);
    req.flush(metricPointArrayMock);

    expect(coordinates).toEqual(metricPointArrayMock);
  });


  it('should handle HTTP errors correctly', () => {
    let error: Error;

    service.getCoordinates('downloadBandwidth', entireHistoryWindowSettingsMock).subscribe({
      next: () => fail('Expected an error'),
      error: (err) => {
        error = err;
      }
    });

    const req = httpMock.expectOne((request) => request.url === `${service['apiBaseUrl']}/getSeries`)
    req.flush('Not found', {status: 404, statusText: 'Not found'})

    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('metric')).toEqual('downloadBandwidth');
    expect(error! instanceof Error).toBeTrue();
    expect(error!.message).toContain('404 Not found')
  });


  it('should emit resetTrendlinesSelectionsSubject when resetTrendlinesSelections() is triggered', () => {
    let emitted = false;

    service.resetTrendlinesSelections$.subscribe(() => emitted = true);

    service.resetTrendlinesSelections();

    expect(emitted).toBeTrue();
  })

});
