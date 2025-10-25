import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SpeedtestService} from '../services/speedtest-service';
import {MetricPoint} from '../models/classes/metric-point';
import {combineLatest} from 'rxjs';
import {ApexAxisChartSeries, ApexChart, ApexTitleSubtitle, ApexXAxis, ApexYAxis, ChartComponent,} from 'ng-apexcharts';
import {MatCheckbox} from '@angular/material/checkbox';

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
  firstMetricSeries: MetricPoint[] = [];
  secondMetricSeries: MetricPoint[] = [];
  displayOnTwoYAxis: boolean = false;

  colors: string[] = ['#0278ff', '#fa3d1c'];

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

  constructor(private speedtestService: SpeedtestService) {
  }

  ngOnInit() {
    this.speedtestService.selectedMetric$.subscribe(metrics => {
      this.selectedMetrics = metrics;
      this.updateChart(this.selectedMetrics);
    })
  }

  updateChart(metrics: string[]) {
    if (!metrics.length) {
      // Clear chart
      this.chartOptions.series = [];
      this.chartOptions.xaxis = {categories: []};
      this.chartOptions.yaxis = [];
      this.chartOptions.title = {text: ''};
      if (this.chart) this.chart.updateOptions(this.chartOptions, true, true);
      return;
    }

    const observables = metrics.map(m => this.speedtestService.getMetricPoints(m));
    combineLatest(observables).subscribe(results => {
      let yaxis: any[] = [];

      if (this.displayOnTwoYAxis) {
        yaxis = metrics.map((metric, i) => ({
          title: {
            text: this.formatMetricName(metric),
            style: {
              color: this.colors[i]
            }
          },
          opposite: (i === 1)
        }));

        this.chartOptions.series = results.map((data, i) => (
          {
            name: this.formatMetricName(metrics[i]),
            type: 'line',
            data: data.map(p => [new Date(p.timestamp).getTime(), p.value]),
            color: this.colors[i],
            yaxis: i
          }));
      }

      this.chartOptions.series = results.map((data, i) => (
        {
          name: this.formatMetricName(metrics[i]),
          type: 'line',
          data: data.map(p => [new Date(p.timestamp).getTime(), p.value]),
          color: this.colors[i]
        }));
      this.chartOptions.yaxis = yaxis;
      this.chartOptions.xaxis = {type: 'datetime'};
      this.chartOptions.title = {text: metrics.map(this.formatMetricName).join(' & ')};

      setTimeout(() => {
        this.chart?.updateOptions(this.chartOptions, true, true);
      }, 200);
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
    this.firstMetricSeries = [];
    this.secondMetricSeries = [];
    this.selectedMetrics = [];
    this.speedtestService.clearSelection();
  }


  onTwoYAxisDisplayCheckboxToggle(checked: boolean) {
    this.displayOnTwoYAxis = checked;
    this.updateChart(this.selectedMetrics);
  }
}


