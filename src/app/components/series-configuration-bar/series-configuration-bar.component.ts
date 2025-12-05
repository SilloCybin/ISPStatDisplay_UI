import {Component, OnDestroy, OnInit} from '@angular/core';
import {CoordinatesService} from '../../services/coordinates.service';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {isMetricDisabled} from '../../utils/sidebar-metric-selection-algo';
import {MatRadioButton, MatRadioChange, MatRadioGroup} from '@angular/material/radio';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {FormGroup, FormsModule} from '@angular/forms';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatNativeDateModule, provideNativeDateAdapter} from '@angular/material/core';
import {DatepickerToggleWrapperModule} from './single-date-calendar/single-date-calendar-wrapper';
import {DoubleDatepickerToggleWrapperModule} from './double-date-calendar/double-date-calendar-wrapper';
import {TimeWindowSettings} from '../../models/classes/time-window';
import {debounceTime, Subject, takeUntil} from 'rxjs';
import {TimeUnit} from '../../models/interfaces/time-unit.interface';
import {timeUnits} from '../../constants/timeUnits';

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

  private destroySubject: Subject<void> = new Subject<void>();

  constructor(private metricChartService: CoordinatesService){}

  ngOnInit() {

    this.metricChartService.selectedMetric$.pipe(takeUntil(this.destroySubject)).subscribe(metrics => {
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
    this.selectedMetrics = this.selectedMetrics.filter(item => item !== 'polynomialRegression').filter(item => item !== 'exponentialSmoothing');
    this.metricChartService.resetTrendlinesSelections();
    this.metricChartService.setSelectedMetrics(this.selectedMetrics);
  }

  isMetricSelected(metric: string): boolean {
    return this.selectedMetrics.includes(metric);
  }

  isMetricDisabled(metric: string): boolean | undefined {
    return isMetricDisabled(metric, this.selectedMetrics, this.isMetricSelected(metric));
  }

  clearSidebarSelection() {
    this.selectedMetrics = [];
    this.metricChartService.setSelectedMetrics(this.selectedMetrics);
    this.selectedTimeWindow = null;
    this.selectedNumberOfTimeUnits = null;
    this.selectedTimeUnit = null;
    this.selectedStartDateToNowStartDate = null;
    this.selectedDateRange = null;
    this.metricChartService.setSelectedTimeWindow(new TimeWindowSettings());
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
      this.metricChartService.setSelectedTimeWindow(fromLastWindowSetting);
    }
  }

  onStartDateToNowSelection(date: Date) {
    this.selectedStartDateToNowStartDate = date;
    const startDateToNowWindowSetting = new TimeWindowSettings();
    startDateToNowWindowSetting.isEntireHistory = false;
    startDateToNowWindowSetting.startDate = date;
    this.metricChartService.setSelectedTimeWindow(startDateToNowWindowSetting);
  }

  onDateRangeSelection(range: FormGroup) {
    this.selectedDateRange = range;
    const startDateToEndDateWindowSetting = new TimeWindowSettings();
    startDateToEndDateWindowSetting.isEntireHistory = false;
    startDateToEndDateWindowSetting.dateRange = range;
    this.metricChartService.setSelectedTimeWindow(startDateToEndDateWindowSetting);
  }

  setTimeWindowSelection(timeWindowSettings?: TimeWindowSettings) {
    this.metricChartService.setSelectedTimeWindow(timeWindowSettings);
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete()
  }

}
