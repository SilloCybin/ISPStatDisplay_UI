import {Component} from '@angular/core';
import {SpeedtestService} from '../services/speedtest-service';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-data-explorer-sidebar',
  imports: [
    MatIcon,
    MatButton
  ],
  templateUrl: './data-explorer-sidebar.html',
  styleUrl: './data-explorer-sidebar.css'
})
export class DataExplorerSidebar {

  selectedMetrics: string[] = [];


  constructor(private speedTestService: SpeedtestService) {
  }

  onMetricSelection(selectedMetric: string) {
    if (this.selectedMetrics.includes(selectedMetric)) {
      this.selectedMetrics = this.selectedMetrics.filter(item => item !== selectedMetric);
      this.speedTestService.setSelectedMetrics(this.selectedMetrics);
    } else if (this.selectedMetrics.length < 2) {
      this.selectedMetrics.push(selectedMetric);
      this.speedTestService.setSelectedMetrics(this.selectedMetrics);
    } else if (this.selectedMetrics.length === 2) {
      if ((this.selectedMetrics[0].includes('Latency') && this.selectedMetrics[1].includes('Latency') && selectedMetric.includes('Latency'))
        || (this.selectedMetrics[0].includes('High') && this.selectedMetrics[1].includes('High') && selectedMetric.includes('High'))
        || (this.selectedMetrics[0].includes('Low') && this.selectedMetrics[1].includes('Low') && selectedMetric.includes('Low'))
        || (this.selectedMetrics[0].includes('Jitter') && this.selectedMetrics[1].includes('Jitter') && selectedMetric.includes('Jitter')))
      {
        this.selectedMetrics.push(selectedMetric);
        this.speedTestService.setSelectedMetrics(this.selectedMetrics);
      }
    } else if (this.selectedMetrics.length === 3){
      console.log(`Can't select more than 3 metrics to display`);
      return;
    }
  }

  isSelected(metric: string): boolean {
    return this.selectedMetrics.includes(metric);
  }

  clearSelections() {
    this.selectedMetrics = [];
    this.speedTestService.setSelectedMetrics(this.selectedMetrics);
  }
}
