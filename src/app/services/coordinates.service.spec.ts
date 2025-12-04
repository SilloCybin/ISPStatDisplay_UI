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

  const dateRangeFormGroup: FormGroup = new FormGroup({
    start: new FormControl<Date | null>(new Date('2025-11-11T15:00:26.000Z')),
    end: new FormControl<Date | null>(new Date('2025-11-12T15:00:26.000Z')),
  });

  const dateRangeWindowSettingsMock: TimeWindowSettings = new TimeWindowSettings(
    false,
    null,
    null,
    null,
    dateRangeFormGroup
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

    service.setSelectedMetrics(selectedMetricsMock);
    service.setSelectedTimeWindow(entireHistoryWindowSettingsMock);
    service.clearSelection();

    service.selectedMetric$.subscribe(metrics => {
      expect(metrics).toEqual([]);
    });
    service.timeWindowSettings$.subscribe(timeWindowSettings => {
      expect(timeWindowSettings).toEqual(new TimeWindowSettings());
    });
  });


  it('should fetch MetricPoints via HTTP GET request on /getAll/{metric} url', () => {
    service.getCoordinates('downloadBandwidth', entireHistoryWindowSettingsMock).subscribe(data => {
      expect(data).toEqual(metricPointArrayMock);
    });

    const req = httpMock.expectOne(`${service['apiBaseUrl']}/getAll/downloadBandwidth`);
    expect(req.request.method).toBe('GET');
    req.flush(metricPointArrayMock);
  });


  it('should fetch Metric Points from start date to now via HTTP GET request on /fromStartDate url', () => {

    service.getCoordinates('downloadBandwidth', startDateWindowSettingsMock).subscribe(data => {
      expect(data).toEqual(metricPointArrayMock);
    });

    const req = httpMock.expectOne(
      (request) => request.url === `${service['apiBaseUrl']}/fromStartDate/downloadBandwidth`
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('startDate')).toEqual('2025-11-11T15:00:26.000Z');
    req.flush(metricPointArrayMock);
  });


  it('should fetch Metric Points from x time units back from now via HTTP GET request on /fromStartDate url', () => {

    const now = new Date();
    const startDateString = new Date(now);
    startDateString.setDate(now.getDate() - 2);

    service.getCoordinates('downloadBandwidth', xTimeUnitsBackWindowSettingsMock).subscribe(data => {
      expect(data).toEqual(metricPointArrayMock);
    });

    const req = httpMock.expectOne(
      (request) => request.url === `${service['apiBaseUrl']}/fromStartDate/downloadBandwidth`
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('startDate')!.split('.')[0]).toEqual(startDateString.toISOString().split('.')[0]);
    req.flush(metricPointArrayMock);
  });


  it('should fetch Metric Points on date range via HTTP GET request on /dateRange url', () => {

    const startDateString = '2025-11-11T15:00:26.000Z';
    const endDateString = '2025-11-12T15:00:26.000Z';

    service.getCoordinates('downloadBandwidth', dateRangeWindowSettingsMock).subscribe(data => {
      expect(data).toEqual(metricPointArrayMock);
    });

    const req = httpMock.expectOne(
      (request) => request.url === `${service['apiBaseUrl']}/dateRange/downloadBandwidth`
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('startDate')).toEqual(startDateString);
    expect(req.request.params.get('endDate')).toEqual(endDateString);
    req.flush(metricPointArrayMock);
  });


  it('should handle HTTP errors correctly', () => {

    service.getCoordinates('downloadBandwidth', entireHistoryWindowSettingsMock).subscribe({
      next: () => fail('Expected an error'),
      error: (err) => {
        expect(err instanceof Error).toBeTrue();
        expect(err.message).toContain('404 Not found')
      }
    });

    const req = httpMock.expectOne(`${service['apiBaseUrl']}/getAll/downloadBandwidth`)
    req.flush('Not found', {status: 404, statusText: 'Not found'})
  });

});
