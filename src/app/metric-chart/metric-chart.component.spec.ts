import { ComponentFixture, TestBed } from '@angular/core/testing';

import {MetricChartComponent} from './metric-chart.component';
import {MetricChartService} from '../services/metric-chart.service';
import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {TimeWindowSettings} from '../models/classes/time-window';

describe('MetricChartComponent', () => {
  let component: MetricChartComponent;
  let fixture: ComponentFixture<MetricChartComponent>;
  let service: MetricChartService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetricChartComponent],
      providers: [
        MetricChartService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MetricChartComponent) as any;
    component = fixture.componentInstance;

    service = TestBed.inject(MetricChartService);
    httpMock = TestBed.inject(HttpTestingController);

    spyOn(component, 'updateChart');
  });


  it('should be created', () => {
    expect(component).toBeTruthy();
  });


  it(`should create subscription to service's selectedMetrics$ on component initialization and update chart
  when subscription triggered`, () => {

    fixture.detectChanges();
    component.timeWindowSettings = new TimeWindowSettings();
    service.setSelectedMetrics(['downloadBandwidth']);

    expect(component.updateChart).toHaveBeenCalledWith(['downloadBandwidth']);
  })


  it(`should create subscription to service's timeWindowSettings$ on component initialization, and update
  chart when subscription triggered and metrics previously selected`, () => {

    fixture.detectChanges();
    component.selectedMetrics = ['downloadBandwidth'];
    service.setSelectedTimeWindow(new TimeWindowSettings());

    expect(component.updateChart).toHaveBeenCalledWith(['downloadBandwidth']);
  })


  it('should NOT update chart when selectedMetrics is emptied', () => {

    fixture.detectChanges();
    (component.updateChart as jasmine.Spy).calls.reset();
    component.selectedMetrics = [];
    service.setSelectedTimeWindow(new TimeWindowSettings());

    expect(component.updateChart).not.toHaveBeenCalled();
  })


  it('should update chart with empty settings on metric selection when timeWindowSettings is empty', () => {

    fixture.detectChanges();
    component.timeWindowSettings = new TimeWindowSettings();
    service.setSelectedMetrics(['downloadBandwidth']);

    expect(component.updateChart).toHaveBeenCalledWith(['downloadBandwidth']);
    expect(component.chartOptions.series).toEqual([]);
    expect(component.chartOptions.xaxis.categories).toEqual([]);
    expect(component.chartOptions.yaxis).toEqual([]);
    expect(component.chartOptions.title.text).toBe('');
  })

});
