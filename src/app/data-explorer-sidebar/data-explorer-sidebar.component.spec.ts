import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {DataExplorerSidebarComponent} from './data-explorer-sidebar.component';
import {HomePageService} from '../services/home-page.service';
import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {CoordinatesService} from '../services/coordinates.service';
import {TimeWindowSettings} from '../models/classes/time-window';
import {MatRadioChange} from '@angular/material/radio';
import {FormControl, FormGroup} from '@angular/forms';

describe('DataExplorerSidebarComponent', () => {
  let component: DataExplorerSidebarComponent;
  let fixture: ComponentFixture<DataExplorerSidebarComponent>;
  let service: CoordinatesService;
  let httpMock: HttpTestingController;

  const selectedMetricsMock1 = ['downloadBandwidth', 'packetLoss'];
  const selectedMetricsMock2: string[] = [];
  const selectedMetricsMock3 = ['downloadPingJitter', 'uploadPingJitter'];
  const selectedMetricsMock4 = ['downloadPingJitter', 'downloadPingLow'];

  function mockRadio(value: string): MatRadioChange {
    return {value} as MatRadioChange;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataExplorerSidebarComponent],
      providers: [
        CoordinatesService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DataExplorerSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    service = TestBed.inject(CoordinatesService);
    httpMock = TestBed.inject(HttpTestingController);
  });


  it('should be created', () => {
    expect(component).toBeTruthy();
  });


  it('should create time unit selection subject on instantiation, and it should next() correctly', fakeAsync(() => {

    const spy = spyOn(component, 'onShowDataFromLastSelection');

    component.onNumberInputChange(23);

    expect(component.selectedNumberOfTimeUnits).toBeNull();
    expect(spy).not.toHaveBeenCalled();

    tick(1000);

    expect(component.selectedNumberOfTimeUnits).toEqual(23);
    expect(spy).toHaveBeenCalled();
  }));


  it(`should call service's setSelectedTimeWindow() with correct parameter when subject is next()ed and conditions are met`, fakeAsync(() => {

    const spy = spyOn(service, 'setSelectedTimeWindow');

    component.selectedTimeUnit = 'days-0';
    component.onNumberInputChange(23);

    tick(1000);

    expect(spy).toHaveBeenCalledWith(jasmine.objectContaining({
      isEntireHistory: false,
      timeUnitNumber: 23,
      timeUnit: 'days-0',
      startDate: undefined,
      dateRange: undefined
    }));


  }));


  it(`should update component's selectedMetrics correctly and fire service's setSelectedMetrics() accordingly`, () => {

    component.selectedMetrics = selectedMetricsMock1;
    const spy = spyOn(service, 'setSelectedMetrics');

    component.onMetricSelection('downloadBandwidth');
    expect(spy).toHaveBeenCalledWith(['packetLoss']);

    component.onMetricSelection('downloadBandwidth');
    expect(spy).toHaveBeenCalledWith(['packetLoss', 'downloadBandwidth'])
  });


  it(`should check correctly whether a metric is selected or not`, () => {

    component.selectedMetrics = selectedMetricsMock1;
    const result = component.isMetricSelected('downloadBandwidth');
    expect(result).toBeTrue();
  });


  it(`should clear metric and time window selections correctly, and fire service's setSelectedMetrics() and setSelectedTimeWindow()`, () => {

    const spy1 = spyOn(service, 'setSelectedMetrics');
    const spy2 = spyOn(service, 'setSelectedTimeWindow');

    component.selectedMetrics = selectedMetricsMock1;
    component.selectedTimeWindow = 'fromLast';
    component.selectedTimeUnit = 'days-0';
    component.selectedNumberOfTimeUnits = 2;
    component.selectedStartDateToNowStartDate = null;
    component.selectedDateRange = null;

    component.clearSidebarSelection();

    expect(component.selectedTimeWindow).toBeNull();
    expect(component.selectedTimeUnit).toBeNull();
    expect(component.selectedNumberOfTimeUnits).toBeNull();
    expect(spy1).toHaveBeenCalledWith([]);
    expect(spy2).toHaveBeenCalledWith(jasmine.objectContaining({}));
  });


  it(`should handle 'entireHistory' time window selection correctly`, () => {

    const spy1 = spyOn(component, 'setTimeWindowSelection').and.callThrough();
    const spy2 = spyOn(service, 'setSelectedTimeWindow');

    component.onTimeWindowSelection(mockRadio('entireHistory'));

    expect(component.selectedTimeWindow).toEqual('entireHistory');
    expect(spy1).toHaveBeenCalledWith(jasmine.objectContaining({
      isEntireHistory: true,
      timeUnitNumber: undefined,
      timeUnit: undefined,
      startDate: undefined,
      dateRange: undefined
    }))
    expect(spy2).toHaveBeenCalledWith(jasmine.objectContaining({
      isEntireHistory: true,
      timeUnitNumber: undefined,
      timeUnit: undefined,
      startDate: undefined,
      dateRange: undefined
    }))
  })


  it(`should handle 'fromLast' time window selection correctly`, () => {

    component.onTimeWindowSelection(mockRadio('fromLast'));

    expect(component.selectedTimeWindow).toEqual('fromLast');
    expect(component.selectedDateRange).toBeNull();
    expect(component.selectedStartDateToNowStartDate).toBeNull();
  })


  it(`should handle 'startDateToNow' time window selection correctly`, () => {

    component.onTimeWindowSelection(mockRadio('startDateToNow'));

    expect(component.selectedTimeWindow).toEqual('startDateToNow');
    expect(component.selectedNumberOfTimeUnits).toBeNull();
    expect(component.selectedTimeUnit).toBeNull();
    expect(component.selectedDateRange).toBeNull();
  })


  it(`should handle 'startDateToEndDate' time window selection correctly`, () => {

    component.onTimeWindowSelection(mockRadio('startDateToEndDate'));

    expect(component.selectedTimeWindow).toEqual('startDateToEndDate');
    expect(component.selectedNumberOfTimeUnits).toBeNull();
    expect(component.selectedTimeUnit).toBeNull();
    expect(component.selectedStartDateToNowStartDate).toBeNull();
  })


  it(`should handle date picking in 'startDateToNow' time window selection correctly`, () => {

    const spy2 = spyOn(service, 'setSelectedTimeWindow');

    component.onStartDateToNowSelection(new Date('2025-11-14T16:00:23Z'))

    expect(component.selectedStartDateToNowStartDate).toEqual(new Date('2025-11-14T16:00:23Z'))
    expect(spy2).toHaveBeenCalledWith(jasmine.objectContaining({
      isEntireHistory: false,
      timeUnitNumber: undefined,
      timeUnit: undefined,
      startDate: new Date('2025-11-14T16:00:23Z'),
      dateRange: undefined
    }))
  })


  it(`should handle date range picking in 'startDateToEndDate' time window selection correctly`, () => {

    const range = new FormGroup({
      start: new FormControl<Date | null>(new Date('2025-11-14T16:00:23Z')),
      end: new FormControl<Date | null>(new Date('2025-11-15T16:00:23Z')),
    });

    const spy2 = spyOn(service, 'setSelectedTimeWindow');

    component.onDateRangeSelection(range)

    expect(component.selectedDateRange).toEqual(range)
    expect(spy2).toHaveBeenCalledWith(jasmine.objectContaining({
      isEntireHistory: false,
      timeUnitNumber: undefined,
      timeUnit: undefined,
      startDate: undefined,
      dateRange: range
    }))
  })


  it('should handle metric selection logic correctly, test 1', () => {
    component.selectedMetrics = selectedMetricsMock1;
    const result = component.isMetricDisabled('uploadBandwidth');
    expect(result).toBeTrue();
  })


  it('should handle metric selection logic correctly, test 2', () => {
    component.selectedMetrics = selectedMetricsMock2;
    const result = component.isMetricDisabled('uploadBandwidth');
    expect(result).toBeFalse();
  })


  it('should handle metric selection logic correctly, test 3', () => {
    component.selectedMetrics = selectedMetricsMock3;
    const result = component.isMetricDisabled('idlePingJitter');
    const result2 = component.isMetricDisabled('idlePingLow');
    const result3 = component.isMetricDisabled('downloadBandwidth')
    expect(result).toBeFalse();
    expect(result2).toBeTrue();
    expect(result3).toBeTrue();
  })


  it('should handle metric selection logic correctly, test 4', () => {
    component.selectedMetrics = selectedMetricsMock4;
    const result = component.isMetricDisabled('idlePingJitter');
    const result2 = component.isMetricDisabled('downloadPingHigh');
    const result3 = component.isMetricDisabled('downloadPingLatency');
    const result4 = component.isMetricDisabled('downloadBandwidth')
    expect(result).toBeTrue();
    expect(result2).toBeFalse();
    expect(result3).toBeFalse();
    expect(result4).toBeTrue();
  })
});
