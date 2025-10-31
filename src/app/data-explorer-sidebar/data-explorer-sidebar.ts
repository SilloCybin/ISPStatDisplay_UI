import {Component} from '@angular/core';
import {SpeedtestService} from '../services/speedtest-service';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {isMetricDisabled} from '../utils/sidebar-metric-selection-algo';
import {MatRadioButton, MatRadioChange, MatRadioGroup} from '@angular/material/radio';
import {MatError, MatFormField, MatHint, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {FormGroup, FormsModule} from '@angular/forms';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatNativeDateModule, provideNativeDateAdapter} from '@angular/material/core';
import {DatepickerToggleWrapperModule} from './single-date-calendar/single-date-calendar-wrapper';
import {DoubleDatepickerToggleWrapperModule} from './double-date-calendar/double-date-calendar-wrapper';
import {TimeWindowSettings} from '../models/classes/time-window';
import {debounceTime, Subject} from 'rxjs';

interface TimeUnit {
  value: string;
  viewValueSingular: string;
  viewValuePlural: string;
}

@Component({
  selector: 'app-data-explorer-sidebar',
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
  templateUrl: './data-explorer-sidebar.html',
  styleUrl: './data-explorer-sidebar.css'
})
export class DataExplorerSidebar {

  selectedMetrics: string[] = [];

  selectedTimeWindow: string | null = null;
  timeUnits: TimeUnit[] = [
    {value: 'days-0', viewValueSingular: 'Day', viewValuePlural: 'Days'},
    {value: 'weeks-1', viewValueSingular: 'Week', viewValuePlural: 'Weeks'},
    {value: 'months-2', viewValueSingular: 'Month', viewValuePlural: 'Months'},
    {value: 'years-3', viewValueSingular: 'Year', viewValuePlural: 'Years'}
  ]

  private valueChanged = new Subject<number>();

  selectedNumberOfTimeUnits: number | null | undefined = null;
  selectedTimeUnit: string | null | undefined = null;

  selectedStartDateToNowStartDate: Date | null = null;

  selectedDateRange: FormGroup | null = null;

  constructor(private speedTestService: SpeedtestService) {
    this.valueChanged.pipe(debounceTime(1000)).subscribe((value) => {
      this.selectedNumberOfTimeUnits = value;
      this.onShowDataFromLastSelection();
    })
  }

  onMetricSelection(selectedMetric: string) {
    if (this.selectedMetrics.includes(selectedMetric)) {
      this.selectedMetrics = this.selectedMetrics.filter(item => item !== selectedMetric);
    } else {
      this.selectedMetrics.push(selectedMetric);
    }
    this.speedTestService.setSelectedMetrics(this.selectedMetrics);
  }

  isMetricSelected(metric: string): boolean {
    return this.selectedMetrics.includes(metric);
  }

  isMetricDisabled(metric: string): boolean | undefined {
    return isMetricDisabled(metric, this.selectedMetrics, this.isMetricSelected(metric));
  }

  clearSidebarSelection() {
    this.selectedMetrics = [];
    this.speedTestService.setSelectedMetrics(this.selectedMetrics);
    this.selectedTimeWindow = null;
    this.selectedNumberOfTimeUnits = null;
    this.selectedTimeUnit = null;
    this.selectedStartDateToNowStartDate = null;
    this.selectedDateRange = null;
    this.speedTestService.setSelectedTimeWindow(new TimeWindowSettings());
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
    this.valueChanged.next(value);
  }

  onShowDataFromLastSelection() {
    const fromLastWindowSetting = new TimeWindowSettings();
    if (
      this.selectedTimeUnit
      && this.selectedNumberOfTimeUnits
      && this.selectedNumberOfTimeUnits > 0
      && this.selectedNumberOfTimeUnits < 53
      && Number.isFinite(this.selectedNumberOfTimeUnits)
    ) {
      fromLastWindowSetting.isEntireHistory = false;
      fromLastWindowSetting.timeUnitNumber = this.selectedNumberOfTimeUnits;
      fromLastWindowSetting.timeUnit = this.selectedTimeUnit;
      this.speedTestService.setSelectedTimeWindow(fromLastWindowSetting);
    }
  }

  onStartDateToNowSelection(date: Date) {
    this.selectedStartDateToNowStartDate = date;
    const startDateToNowWindowSetting = new TimeWindowSettings();
    startDateToNowWindowSetting.isEntireHistory = false;
    startDateToNowWindowSetting.startDate = date;
    this.speedTestService.setSelectedTimeWindow(startDateToNowWindowSetting);
  }

  onDateRangeSelection(range: FormGroup) {
    this.selectedDateRange = range;
    const startDateToEndDateWindowSetting = new TimeWindowSettings();
    startDateToEndDateWindowSetting.isEntireHistory = false;
    startDateToEndDateWindowSetting.dateRange = range;
    this.speedTestService.setSelectedTimeWindow(startDateToEndDateWindowSetting);
  }

  setTimeWindowSelection(timeWindowSettings?: TimeWindowSettings) {
    this.speedTestService.setSelectedTimeWindow(timeWindowSettings);
  }

  isTimeWindowDisabled() {
    return (!this.selectedMetrics.length && !this.selectedTimeWindow);
  }
}
