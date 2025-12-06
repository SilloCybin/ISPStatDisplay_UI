import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {ChartContainerComponent} from './chart-container.component';
import {CoordinatesService} from '../../services/coordinates.service';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {TimeWindowSettings} from '../../models/classes/time-window';
import {NgModel} from '@angular/forms';
import {of} from 'rxjs';
import {timeOpsWrapper} from '../../utils/time-ops-wrapper';

describe('ChartContainerComponent', () => {
  let component: ChartContainerComponent;
  let fixture: ComponentFixture<ChartContainerComponent>;
  let service: CoordinatesService;

  const selectedMetricsMock1 = ['downloadBandwidth', 'polynomialRegression'];
  const selectedMetricsMock2 = ['downloadBandwidth'];
  const selectedMetricsMock3 = ['downloadBandwidth', 'exponentialMovingAverage'];
  const selectedMetricsMock4 = ['downloadBandwidth', 'polynomialRegression', 'exponentialMovingAverage'];

  const timeWindowSettingsMock = new TimeWindowSettings(
    false,
    23,
    'days-0',
    null,
    null);

  function mockControl(valid: boolean): NgModel {
    return { valid } as unknown as NgModel;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartContainerComponent],
      providers: [
        CoordinatesService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChartContainerComponent) as any;
    component = fixture.componentInstance;

    service = TestBed.inject(CoordinatesService);

    spyOn(component, 'updateChart');
  });


  it('should be created', () => {
    expect(component).toBeTruthy();
  });


  it(`should create subscription to service's selectedMetrics$ on component initialization and update chart
  when triggered`, () => {

    fixture.detectChanges();
    component.timeWindowSettings = new TimeWindowSettings();
    service.setSelectedMetrics(['downloadBandwidth']);

    expect(component.updateChart).toHaveBeenCalled();
  });


  it(`should create subscription to service's timeWindowSettings$ on component initialization, and update
  chart when triggered and metrics previously selected`, () => {

    fixture.detectChanges();
    component.selectedMetrics = ['downloadBandwidth'];
    service.setSelectedTimeWindow(new TimeWindowSettings());

    expect(component.updateChart).toHaveBeenCalled();
  });


  it('should update alphaParameter and trigger getExponentialMovingAverageTrendline() on user input of alpha', fakeAsync(() => {

    const spy = spyOn(component, 'getExponentialMovingAverageTrendline');

    fixture.detectChanges();
    component.onAlphaParameterInputChange(0.8, mockControl(true));

    tick(1000);

    expect(component.alphaParameter).toEqual(0.8);
    expect(spy).toHaveBeenCalled();
  }))


  it(`should create subscription to service's resetTrendlinesSelections$ on component initialization, and launch
  resetTrendlinesSelection() when triggered`, () => {

    const spy = spyOn(component, 'resetTrendlinesSelections');

    fixture.detectChanges();

    service.resetTrendlinesSelections();

    expect(spy).toHaveBeenCalled();
  });


  it(`should  reset trendline checkboxes and parameters when resetTrendlinesSelections() is triggered` , () => {

    fixture.detectChanges();

    component.alphaParameter = 0.8;
    component.displayExponentialMovingAverageTrendline = true;
    component.polynomialDegreeParameter = 2;
    component.displayPolynomialRegressionTrendline = true;

    component.resetTrendlinesSelections();

    expect(component.alphaParameter).toBeNull();
    expect(component.displayExponentialMovingAverageTrendline).toBeFalse();
    expect(component.polynomialDegreeParameter).toBeNull();
    expect(component.displayPolynomialRegressionTrendline).toBeFalse();
  });


  it('should set displayOnTwoYAxesOption correctly and launch updateChart() when onTwoYAxisDisplayCheckboxToggle() is triggered', () => {

    fixture.detectChanges();

    component.onTwoYAxisDisplayCheckboxToggle(true);

    expect(component.displayOnTwoYAxesOption).toBeTrue();
    expect(component.updateChart).toHaveBeenCalled();
  });


  it(`should update selectedMetrics correctly, launch service's setSelectedMetrics(), launch component's updateChart() when
  getPolynomialRegressionTrendline() is triggered`, () => {

    const spy = spyOn(service, 'setSelectedMetrics');
    fixture.detectChanges();

    component.selectedMetrics = selectedMetricsMock1;

    component.getPolynomialRegressionTrendline();
    expect(spy).toHaveBeenCalledWith(selectedMetricsMock1);
    expect(component.updateChart).toHaveBeenCalled();

    component.selectedMetrics = selectedMetricsMock2;

    component.getPolynomialRegressionTrendline();
    expect(spy).toHaveBeenCalledWith(selectedMetricsMock2);
    expect(component.updateChart).toHaveBeenCalled();
  });

  it(`should set displayPolynomialRegression correctly, and update selectedMetrics correctly on box uncheck after display
  of the polynomial regression curve`, () => {

    const spy = spyOn(service, 'setSelectedMetrics');

    fixture.detectChanges();

    component.selectedMetrics = selectedMetricsMock1;
    component.polynomialDegreeParameter = 2;

    component.onPolynomialRegressionCheckboxToggle(false);

    expect(component.displayExponentialMovingAverageTrendline).toBeFalse()
    expect(component.selectedMetrics.includes('polynomialRegression')).toBeFalse();
    expect(component.polynomialDegreeParameter).toBeNull();
    expect(spy).toHaveBeenCalledWith(['downloadBandwidth'])
  })


  it(`should update selectedMetrics correctly, launch service's setSelectedMetrics(), launch component's updateChart() when
  getExponentialMovingAverage() is triggered`, () => {

    const spy = spyOn(service, 'setSelectedMetrics');
    fixture.detectChanges();

    component.selectedMetrics = selectedMetricsMock3;

    component.getExponentialMovingAverageTrendline();
    expect(spy).toHaveBeenCalledWith(['downloadBandwidth', 'exponentialMovingAverage']);
    expect(component.updateChart).toHaveBeenCalled();

    component.selectedMetrics = selectedMetricsMock2;

    component.getExponentialMovingAverageTrendline();
    expect(spy).toHaveBeenCalledWith(['downloadBandwidth', 'exponentialMovingAverage']);
    expect(component.updateChart).toHaveBeenCalled();
  });

  it(`should set displayExponentialMovingAverage correctly, and update selectedMetrics correctly on box uncheck after display
  of the exponential moving average curve`, () => {

    const spy = spyOn(service, 'setSelectedMetrics');

    fixture.detectChanges();

    component.selectedMetrics = selectedMetricsMock3;
    component.alphaParameter = 0.8;

    component.onExponentialMovingAverageCheckboxToggle(false);

    expect(component.displayExponentialMovingAverageTrendline).toBeFalse()
    expect(component.selectedMetrics.includes('exponentialMovingAverage')).toBeFalse();
    expect(component.alphaParameter).toBeNull();
    expect(spy).toHaveBeenCalledWith(['downloadBandwidth'])
  })


  it('should update chart with empty settings on metric selection when timeWindowSettings is empty', () => {

    fixture.detectChanges();
    component.timeWindowSettings = new TimeWindowSettings();
    service.setSelectedMetrics(['downloadBandwidth']);

    expect(component.updateChart).toHaveBeenCalled();
    expect(component.chartOptions.series).toEqual([]);
    expect(component.chartOptions.xaxis.categories).toEqual([]);
    expect(component.chartOptions.yaxis).toEqual([]);
    expect(component.chartOptions.title.text).toBe('');
  });


  it(`should launch service's getCoordinates() with correct parameters on updateChart()`, fakeAsync(() => {

    const spy = spyOn(service, 'getCoordinates').and.returnValue(of([]));
    (timeOpsWrapper as any).is5DayOrMoreSeries = () => true;
    (component.updateChart as jasmine.Spy).and.callThrough();

    fixture.detectChanges();

    component.alphaParameter = 0.8;
    component.polynomialDegreeParameter = 2;
    component.selectedMetrics = selectedMetricsMock4;
    component.timeWindowSettings = timeWindowSettingsMock;

    component.updateChart();

    tick(1000);

    expect(spy).toHaveBeenCalledTimes(3);

    expect(spy).toHaveBeenCalledWith(
      'downloadBandwidth',
      jasmine.objectContaining({
        isEntireHistory: false,
        timeUnitNumber: 23,
        timeUnit: 'days-0',
        startDate: null,
        dateRange: null
      }))

    expect(spy).toHaveBeenCalledWith(
      'downloadBandwidth',
      jasmine.objectContaining({
        isEntireHistory: false,
        timeUnitNumber: 23,
        timeUnit: 'days-0',
        startDate: null,
        dateRange: null
      }),
      'polynomialRegression',
      2
      )

    expect(spy).toHaveBeenCalledWith(
      'downloadBandwidth',
      jasmine.objectContaining({
        isEntireHistory: false,
        timeUnitNumber: 23,
        timeUnit: 'days-0',
        startDate: null,
        dateRange: null
      }),
      'exponentialMovingAverage',
      0.8
    )
  }))
});
