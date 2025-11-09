import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MetricChartService} from '../services/metric-chart.service';
import {ApexAxisChartSeries, ApexChart, ApexTitleSubtitle, ApexXAxis, ApexYAxis, ChartComponent} from 'ng-apexcharts';
import {MatCheckbox} from '@angular/material/checkbox';
import {TimeWindowSettings} from '../models/classes/time-window';
import {combineLatest} from 'rxjs';
import {MatIcon} from '@angular/material/icon';
import {formatMetricName} from '../utils/metric-name-formatter';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis?: ApexYAxis | ApexYAxis[];
  title: ApexTitleSubtitle;
  colors?: string[]
}

@Component({
  selector: 'app-metric-chart',
  imports: [
    ChartComponent,
    MatCheckbox,
    MatIcon
  ],
  templateUrl: './metric-chart.component.html',
  styleUrl: './metric-chart.component.css'
})
export class MetricChartComponent implements OnInit, OnDestroy {

  selectedMetrics: string[] = [];
  displayOnTwoYAxesOption: boolean = false;

  timeWindowSettings: TimeWindowSettings = new TimeWindowSettings();

  @ViewChild("chart") chart: ChartComponent | undefined;

  colors: string[] = ['#1d69f6','#5fb602','#ea5900','#bd21fd'];

  chartOptions: ChartOptions = {
    series: [],
    chart: {
      type: 'line',
      height: 800,
    },
    xaxis: {
      categories: []
    },
    yaxis: [],
    title: {
      text: ''
    },
    colors: this.colors
  };

  constructor(private metricChartService: MetricChartService) {}

  ngOnInit() {

    this.metricChartService.selectedMetric$.subscribe(metrics => {
      this.selectedMetrics = metrics;
      if (this.selectedMetrics.length !== 2){
        this.displayOnTwoYAxesOption = false;
      }
      this.updateChart(this.selectedMetrics);
    });

    this.metricChartService.timeWindowSettings$.subscribe(settings => {
      this.timeWindowSettings = settings;
      if (this.selectedMetrics.length) {
        this.updateChart(this.selectedMetrics)
      }
    });
  }

  updateChart(metrics: string[]) {
    if (!metrics.length || this.timeWindowSettings.isTimeWindowEmpty()) {
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

    const observables = metrics.map(m => this.metricChartService.getMetricPoints(m, this.timeWindowSettings));
    combineLatest(observables).subscribe(results => {

      let yaxis: any[] = [];

      if (this.displayOnTwoYAxesOption) {
        yaxis = metrics.map((metric, i) => (
          {
          title: {
            text: formatMetricName(metric),
            style: {
              color: this.colors[i]
            }
          },
          opposite: (i === 1)
        }));

        this.chartOptions.series = results.map((data, i) => (
          {
            name: formatMetricName(metrics[i]),
            type: 'line',
            data: data.map(p => [new Date(p.timestamp).getTime(), p.value]),
            yaxis: i,
            color: this.colors[i]
          }));
      } else {
        this.chartOptions.series = results.map((data, i) => (
        {
          name: formatMetricName(metrics[i]),
          type: 'line',
          data: data.map(p => [new Date(p.timestamp).getTime(), p.value]),
        }));
      }

      this.chartOptions.yaxis = yaxis;
      this.chartOptions.xaxis = {type: 'datetime'};
      this.chartOptions.title = {text: metrics.map(formatMetricName).join(' & ')};

      setTimeout(() => {
        this.chart?.updateOptions(this.chartOptions, true, true);
      }, 150);
    });
  }

  ngOnDestroy() {
    this.selectedMetrics = [];
    this.metricChartService.clearSelection();
  }

  onTwoYAxisDisplayCheckboxToggle(checked: boolean) {
    this.displayOnTwoYAxesOption = checked;
    this.updateChart(this.selectedMetrics);
  }
}
