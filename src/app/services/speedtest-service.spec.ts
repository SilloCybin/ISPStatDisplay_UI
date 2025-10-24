import { TestBed } from '@angular/core/testing';

import { SpeedtestService } from './speedtest-service';

describe('SpeedtestService', () => {
  let service: SpeedtestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpeedtestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
