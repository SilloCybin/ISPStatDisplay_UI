import {Component, OnDestroy, OnInit} from '@angular/core';
import {CoordinatesService} from '../../services/coordinates/coordinates.service';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {isMetricDisabled} from '../../utils/metric-selection-algo';
import {MatRadioButton, MatRadioChange, MatRadioGroup} from '@angular/material/radio';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {FormGroup, FormsModule} from '@angular/forms';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatNativeDateModule, provideNativeDateAdapter} from '@angular/material/core';
import {DatepickerToggleWrapperModule} from './single-date-calendar/single-date-calendar-wrapper';
import {DoubleDatepickerToggleWrapperModule} from './double-date-calendar/double-date-calendar-wrapper';
import {TimeWindowSettings} from '../../models/classes/time-window';
import {debounceTime, filter, Subject, takeUntil} from 'rxjs';
import {TimeUnit} from '../../models/interfaces/time-unit.interface';
import {timeUnits} from '../../constants/timeUnits';
import {NavigationEnd, Router} from '@angular/router';
import {HeatmapService} from '../../services/heatmap/heatmap.service';

@Component({
  selector: 'app-series-configuration-bar',
  imports: [
    MatIcon,
    MatButton,
    MatRadioButton,
    MatRadioGroup,
    MatFormField,
    MatLabel,
    MatInput,
    MatSelect,
    FormsModule,
    MatOption,
    MatNativeDateModule,
    DatepickerToggleWrapperModule,
    DoubleDatepickerToggleWrapperModule,
    MatError
  ],
  providers: [
    provideNativeDateAdapter()
  ],
  templateUrl: './series-configuration-bar.component.html',
  styleUrl: './series-configuration-bar.component.css'
})
export class SeriesConfigurationBarComponent implements OnInit, OnDestroy{

  selectedMetrics: string[] = [];
  selectedTimeWindow: string | null = null;

  timeUnits: TimeUnit[] = timeUnits;

  private selectedNumberOfTimeUnitsSubject: Subject<number> = new Subject<number>();
  selectedNumberOfTimeUnits: number | null | undefined = null;
  selectedTimeUnit: string | null | undefined = null;
  selectedStartDateToNowStartDate: Date | null = null;
  selectedDateRange: FormGroup | null = null;

  currentUrl: string = '';

  private destroyComponentSubject: Subject<void> = new Subject<void>();


  constructor(private coordinatesService: CoordinatesService, private heatmapService: HeatmapService, private router: Router){}


  ngOnInit() {

    this.currentUrl = this.router.url;

    this.router.events.pipe(
      takeUntil(this.destroyComponentSubject),
      filter(event => event instanceof NavigationEnd)).subscribe((event) => {
        this.currentUrl = event.urlAfterRedirects;
        this.clearSeriesConfigurationSelection();
      }
    )

    this.coordinatesService.selectedMetrics$.pipe(takeUntil(this.destroyComponentSubject)).subscribe(metrics => {
      this.selectedMetrics = metrics;
    });

    this.selectedNumberOfTimeUnitsSubject.pipe(debounceTime(1000)).subscribe((value) => {
      this.selectedNumberOfTimeUnits = value;
      this.onShowDataFromLastSelection();
    });
  }

  onMetricSelection(selectedMetric: string) {
    if (this.selectedMetrics.includes(selectedMetric)) {
      this.selectedMetrics = this.selectedMetrics.filter(item => item !== selectedMetric);
    } else {
      this.selectedMetrics.push(selectedMetric);
    }
    if (this.isOnCharts()){
      this.selectedMetrics = this.selectedMetrics.filter(item => item !== 'polynomialRegression').filter(item => item !== 'exponentialMovingAverage');
      this.coordinatesService.resetTrendlinesSelections();
      this.coordinatesService.setSelectedMetrics(this.selectedMetrics);
    } else {
      this.heatmapService.setSelectedMetric(this.selectedMetrics);
    }
  }

  isMetricSelected(metric: string): boolean {
    return this.selectedMetrics.includes(metric);
  }

  isMetricDisabled(metric: string): boolean | undefined {
    return isMetricDisabled(metric, this.selectedMetrics, this.isMetricSelected(metric), this.isOnCharts());
  }

  clearSeriesConfigurationSelection() {
    this.selectedMetrics = [];
    this.coordinatesService.setSelectedMetrics(this.selectedMetrics);
    this.heatmapService.setSelectedMetric(this.selectedMetrics);
    this.selectedTimeWindow = null;
    this.selectedNumberOfTimeUnits = null;
    this.selectedTimeUnit = null;
    this.selectedStartDateToNowStartDate = null;
    this.selectedDateRange = null;
    this.coordinatesService.setSelectedTimeWindow(new TimeWindowSettings());
  }

  onTimeWindowSelection(event: MatRadioChange) {
    switch (event.value) {
      case 'entireHistory':
        this.selectedTimeWindow = 'entireHistory';
        const entireHistoryTimeWindowSetting = new TimeWindowSettings();
        entireHistoryTimeWindowSetting.isEntireHistory = true;
        this.setTimeWindowSelection(entireHistoryTimeWindowSetting);
        break;
      case 'fromLast':
        this.selectedTimeWindow = 'fromLast'
        this.selectedDateRange = null;
        this.selectedStartDateToNowStartDate = null;
        break;
      case 'startDateToNow':
        this.selectedTimeWindow = 'startDateToNow'
        this.selectedNumberOfTimeUnits = null;
        this.selectedTimeUnit = null;
        this.selectedDateRange = null;
        break;
      case 'startDateToEndDate':
        this.selectedTimeWindow = 'startDateToEndDate'
        this.selectedNumberOfTimeUnits = null;
        this.selectedTimeUnit = null;
        this.selectedStartDateToNowStartDate = null;
        break;
      default:
        break;
    }
  }

  onNumberInputChange(value: number) {
    this.selectedNumberOfTimeUnitsSubject.next(value);
  }

  onShowDataFromLastSelection() {
    if (
      this.selectedTimeUnit
      && this.selectedNumberOfTimeUnits
      && this.selectedNumberOfTimeUnits > 0
      && this.selectedNumberOfTimeUnits < 53
      && Number.isFinite(this.selectedNumberOfTimeUnits)
    ) {
      const fromLastWindowSetting = new TimeWindowSettings();
      fromLastWindowSetting.isEntireHistory = false;
      fromLastWindowSetting.timeUnitNumber = this.selectedNumberOfTimeUnits;
      fromLastWindowSetting.timeUnit = this.selectedTimeUnit;
      this.coordinatesService.setSelectedTimeWindow(fromLastWindowSetting);
    }
  }

  onStartDateToNowSelection(date: Date) {
    this.selectedStartDateToNowStartDate = date;
    const startDateToNowWindowSetting = new TimeWindowSettings();
    startDateToNowWindowSetting.isEntireHistory = false;
    startDateToNowWindowSetting.startDate = date;
    this.coordinatesService.setSelectedTimeWindow(startDateToNowWindowSetting);
  }

  onDateRangeSelection(range: FormGroup) {
    this.selectedDateRange = range;
    const startDateToEndDateWindowSetting = new TimeWindowSettings();
    startDateToEndDateWindowSetting.isEntireHistory = false;
    startDateToEndDateWindowSetting.dateRange = range;
    this.coordinatesService.setSelectedTimeWindow(startDateToEndDateWindowSetting);
  }

  setTimeWindowSelection(timeWindowSettings?: TimeWindowSettings) {
    this.coordinatesService.setSelectedTimeWindow(timeWindowSettings);
  }

  isOnCharts(){
    return (this.currentUrl === '/dataExplorer/charts');
  }

  ngOnDestroy(): void {
    this.destroyComponentSubject.next();
    this.destroyComponentSubject.complete();
    this.clearSeriesConfigurationSelection();
  }

}
