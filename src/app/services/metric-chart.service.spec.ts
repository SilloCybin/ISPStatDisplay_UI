import { TestBed } from '@angular/core/testing';

import { MetricChartService } from './metric-chart.service';

describe('MetricChartService', () => {
  let service: MetricChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetricChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
