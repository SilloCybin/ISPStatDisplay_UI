import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CoordinatesService} from '../../services/coordinates/coordinates.service';
import {ChartComponent} from 'ng-apexcharts';
import {MatCheckbox} from '@angular/material/checkbox';
import {TimeWindowSettings} from '../../models/classes/time-window';
import {combineLatest, debounceTime, Observable, Subject, takeUntil} from 'rxjs';
import {MatIcon} from '@angular/material/icon';
import {formatMetricName} from '../../utils/parsing-ops';
import {Coordinate} from '../../models/classes/coordinate';
import {ChartOptions} from '../../models/types/chart-options';
import {FormsModule, NgModel} from '@angular/forms';
import {MatError, MatFormField} from '@angular/material/form-field';
import {MatInput, MatLabel} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {PolynomialDegree} from '../../models/interfaces/polynomial-degree';
import {polynomialDegrees} from '../../constants/polynomialDegrees';
import {chartOptions} from '../../constants/chartOptions';
import {colors} from '../../constants/colors'
import {timeOpsWrapper} from '../../utils/time-ops-wrapper';

@Component({
  selector: 'app-chart-container',
  imports: [
    ChartComponent,
    MatIcon,
    MatCheckbox,
    FormsModule,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect
  ],
  templateUrl: './chart-container.component.html',
  styleUrl: './chart-container.component.css'
})
export class ChartContainerComponent implements OnInit, OnDestroy {

  selectedMetrics: string[] = [];
  displayOnTwoYAxesOption: boolean = false;

  displayPolynomialRegressionTrendline: boolean = false;
  displayExponentialMovingAverageTrendline: boolean = false;

  timeWindowSettings: TimeWindowSettings = new TimeWindowSettings();

  private destroySubject: Subject<void> = new Subject<void>();

  private alphaParameterSubject: Subject<number> = new Subject<number>();

  alphaParameter: number | null | undefined = null;
  polynomialDegreeParameter: number | null | undefined = null;

  @ViewChild("chart") chart: ChartComponent | undefined;
  chartOptions: ChartOptions = chartOptions;

  private colors: string[] = colors;
  degrees: PolynomialDegree[] = polynomialDegrees;
  canDisplayTrendlines: boolean = false;

  constructor(private metricChartService: CoordinatesService) {
  }

  ngOnInit() {
    this.metricChartService.selectedMetric$.pipe(takeUntil(this.destroySubject)).subscribe((metrics) => {
      this.selectedMetrics = metrics;
      this.setDisplayOnTwoYAxesOption();
      this.updateChart();
    });

    this.metricChartService.timeWindowSettings$.pipe(takeUntil(this.destroySubject)).subscribe((settings) => {
      this.timeWindowSettings = settings;
      if (this.selectedMetrics.length) {
        this.updateChart();
      }
    });

    this.alphaParameterSubject.pipe(takeUntil(this.destroySubject)).pipe(debounceTime(1000)).subscribe((value) => {
      this.alphaParameter = value;
      this.getExponentialMovingAverageTrendline();
    });

    this.metricChartService.resetTrendlinesSelections$.pipe(takeUntil(this.destroySubject)).subscribe(() => {
      this.resetTrendlinesSelections()
    })

  }

  updateChart() {

    if (!this.selectedMetrics.length || this.timeWindowSettings.isTimeWindowEmpty()) {
      // Clear chart
      this.chartOptions.series = [];
      this.chartOptions.xaxis = {categories: []};
      this.chartOptions.yaxis = [];
      this.chartOptions.title = {text: ''};
      if (this.chart) {
        this.chart.updateOptions(this.chartOptions, true, true);
      }
      return;
    }

    const seriesObservables: Observable<Coordinate[]>[] = this.selectedMetrics.map(metric => {
      if (metric === 'polynomialRegression' && this.polynomialDegreeParameter !== null) {
        return this.metricChartService.getCoordinates(this.selectedMetrics[0], this.timeWindowSettings, metric, this.polynomialDegreeParameter);
      } else if (metric === 'exponentialMovingAverage' && this.alphaParameter !== null) {
        return this.metricChartService.getCoordinates(this.selectedMetrics[0], this.timeWindowSettings, metric, this.alphaParameter);
      } else {
        return this.metricChartService.getCoordinates(metric, this.timeWindowSettings);
      }
    });

    combineLatest(seriesObservables).subscribe(series => {

      this.canDisplayTrendlines = timeOpsWrapper.is5DayOrMoreSeries(series[0]);

      let yaxis: any[] = [];

      if (this.displayOnTwoYAxesOption) {
        yaxis = this.selectedMetrics.map((metric, i) => (
          {
            title: {
              text: formatMetricName(metric),
              style: {
                color: this.colors[i]
              }
            },
            opposite: (i === 1)
          }));

        this.chartOptions.series = series.map((data, i) => (
          {
            name: formatMetricName(this.selectedMetrics[i]),
            type: 'line',
            data: data.map(p => [new Date(p.timestamp).getTime(), p.value]),
            yaxis: i,
            color: this.colors[i]
          }));
      } else {
        this.chartOptions.series = series.map((data, i) => (
          {
            name: formatMetricName(this.selectedMetrics[i]),
            type: 'line',
            data: data.map(p => [new Date(p.timestamp).getTime(), p.value]),
          }));
      }

      this.chartOptions.yaxis = yaxis;
      this.chartOptions.xaxis = {type: 'datetime'};
      this.chartOptions.title = {text: this.selectedMetrics.map(formatMetricName).join(' & ')};

      setTimeout(() => {
        this.chart?.updateOptions(this.chartOptions, true, true);
      }, 150);
    });
  }

  onPolynomialRegressionCheckboxToggle(checked: boolean) {
    this.displayPolynomialRegressionTrendline = checked;
    if (!checked && this.selectedMetrics.includes('polynomialRegression')) {
      this.selectedMetrics = this.selectedMetrics.filter(item => item !== 'polynomialRegression');
      this.polynomialDegreeParameter = null;
      this.metricChartService.setSelectedMetrics(this.selectedMetrics);
    }
  }

  onExponentialMovingAverageCheckboxToggle(checked: boolean) {
    this.displayExponentialMovingAverageTrendline = checked;
    if (!checked && this.selectedMetrics.includes('exponentialMovingAverage')) {
      this.selectedMetrics = this.selectedMetrics.filter(item => item !== 'exponentialMovingAverage');
      this.alphaParameter = null;
      this.metricChartService.setSelectedMetrics(this.selectedMetrics);
    }
  }

  getPolynomialRegressionTrendline() {
    if (this.selectedMetrics.includes('polynomialRegression')) {
      this.selectedMetrics = this.selectedMetrics.filter(item => item !== 'polynomialRegression');
    }
    this.selectedMetrics.push('polynomialRegression');
    this.metricChartService.setSelectedMetrics(this.selectedMetrics);
  }

  getExponentialMovingAverageTrendline() {
    if (this.selectedMetrics.includes('exponentialMovingAverage')) {
      this.selectedMetrics = this.selectedMetrics.filter(item => item !== 'exponentialMovingAverage');
    }
    this.selectedMetrics.push('exponentialMovingAverage');
    this.metricChartService.setSelectedMetrics(this.selectedMetrics);
  }

  onAlphaParameterInputChange(value: number, control: NgModel) {
    if (control.valid && value <= 1 && value >= 0 && value !== null) {
      this.alphaParameterSubject.next(value);
    }
  }

  onTwoYAxisDisplayCheckboxToggle(checked: boolean) {
    this.displayOnTwoYAxesOption = checked;
    this.updateChart();
  }

  resetTrendlinesSelections() {
    this.displayPolynomialRegressionTrendline = false;
    this.polynomialDegreeParameter = null;
    this.displayExponentialMovingAverageTrendline = false;
    this.alphaParameter = null;
  }

  setDisplayOnTwoYAxesOption() {
    if (this.selectedMetrics.length !== 2) {
      this.displayOnTwoYAxesOption = false;
    }
  }

  ngOnDestroy() {
    this.selectedMetrics = [];
    this.metricChartService.clearSelection();
    this.destroySubject.next();
    this.destroySubject.complete();
    this.chart?.destroy();
  }
}
