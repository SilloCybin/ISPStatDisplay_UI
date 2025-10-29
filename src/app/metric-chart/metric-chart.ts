import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SpeedtestService} from '../services/speedtest-service';
import {MetricPoint} from '../models/classes/metric-point';
import {ApexAxisChartSeries, ApexChart, ApexTitleSubtitle, ApexXAxis, ApexYAxis, ChartComponent} from 'ng-apexcharts';
import {MatCheckbox} from '@angular/material/checkbox';
import {TimeWindowSettings} from '../models/classes/time-window';
import {combineLatest} from 'rxjs';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis?: ApexYAxis | ApexYAxis[];
  title: ApexTitleSubtitle;
}

@Component({
  selector: 'app-metric-chart',
  imports: [
    ChartComponent,
    MatCheckbox
  ],
  templateUrl: './metric-chart.html',
  styleUrl: './metric-chart.css'
})
export class MetricChart implements OnInit, OnDestroy {

  selectedMetrics: string[] = [];
  displayOnTwoYAxis: boolean = false;

  timeWindowSettings: TimeWindowSettings = new TimeWindowSettings();

  @ViewChild("chart") chart: ChartComponent | undefined;

  chartOptions: ChartOptions = {
    series: [],
    chart: {
      type: 'line',
      height: 800
    },
    xaxis: {
      categories: []
    },
    yaxis: [],
    title: {
      text: ''
    }
  };

  constructor(private speedtestService: SpeedtestService) {}

  ngOnInit() {

    this.speedtestService.selectedMetric$.subscribe(metrics => {
      this.selectedMetrics = metrics;
      if (this.selectedMetrics.length !== 2){
        this.displayOnTwoYAxis = false;
      }
      if (
        (this.timeWindowSettings.timeUnitNumber && this.timeWindowSettings.timeUnit)
        || this.timeWindowSettings.dateRange
        || this.timeWindowSettings.startDate
        || this.timeWindowSettings.isEntireHistory
      ) {
        console.log('Coming from MetricChartComponent, on selectedMetrics update - Displaying because time settings are defined and metrics selected :', this.timeWindowSettings, this.selectedMetrics);
        this.updateChart(this.selectedMetrics);
      } else {
        console.log('Coming from MetricChartComponent, on selectedMetrics update - Not displaying because time settings are undefined');
      }
    })

    this.speedtestService.timeWindowSettings$.subscribe(settings => {
      this.timeWindowSettings = settings;
      if (this.selectedMetrics.length) {
        console.log('Coming from MetricChartComponent, on timeWindowSettings update - Displaying because time settings are defined and metrics selected :', this.timeWindowSettings, this.selectedMetrics);
        this.updateChart(this.selectedMetrics)
      } else {
        console.log('Coming from MetricChartComponent, on timeWindowSettings update - Not displaying because metric selection is empty');
      }
    })
  }

  updateChart(metrics: string[]) {
    if (!metrics.length) {
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

    const observables = metrics.map(m => this.speedtestService.getMetricPoints(m, this.timeWindowSettings));
    combineLatest(observables).subscribe(results => {

      console.log(results);

      let yaxis: any[] = [];

      if (this.displayOnTwoYAxis) {
        yaxis = metrics.map((metric, i) => ({
          title: {
            text: this.formatMetricName(metric),
          },
          opposite: (i === 1)
        }));

        this.chartOptions.series = results.map((data, i) => (
          {
            name: this.formatMetricName(metrics[i]),
            type: 'line',
            data: data.map(p => [new Date(p.timestamp).getTime(), p.value]),
            yaxis: i
          }));
      }

      this.chartOptions.series = results.map((data, i) => (
        {
          name: this.formatMetricName(metrics[i]),
          type: 'line',
          data: data.map(p => [new Date(p.timestamp).getTime(), p.value]),
        }));
      this.chartOptions.yaxis = yaxis;
      this.chartOptions.xaxis = {type: 'datetime'};
      this.chartOptions.title = {text: metrics.map(this.formatMetricName).join(' & ')};

      setTimeout(() => {
        this.chart?.updateOptions(this.chartOptions, true, true);
      }, 150);
    });
  }

  formatMetricName(metric: string) {
    if (metric.includes('Ping')) {
      return metric.charAt(0).toUpperCase()
        + metric.slice(1).replace(/([A-Z])/g, ' $1') + ' (ms)';
    } else if (metric.includes('Bandwidth')) {
      return metric.charAt(0).toUpperCase()
        + metric.slice(1).replace(/([A-Z])/g, ' $1') + ' (Mb/s)';
    } else if (metric == 'packetLoss') {
      return metric.charAt(0).toUpperCase()
        + metric.slice(1).replace(/([A-Z])/g, ' $1') + ' (%)';
    }
    return '';
  }

  ngOnDestroy() {
    this.selectedMetrics = [];
    this.speedtestService.clearSelection();
  }

  onTwoYAxisDisplayCheckboxToggle(checked: boolean) {
    this.displayOnTwoYAxis = checked;
    this.updateChart(this.selectedMetrics);
  }
}


