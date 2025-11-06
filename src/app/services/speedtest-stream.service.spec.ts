import { TestBed } from '@angular/core/testing';

import { SpeedtestStreamService } from './speedtest-stream.service';

describe('SpeedtestStreamService', () => {
  let service: SpeedtestStreamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpeedtestStreamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
