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


  constructor(private speedTestService : SpeedtestService) {}

  onMetricSelection(selectedMetric: string) {
    if (this.selectedMetrics.includes(selectedMetric)){
      this.selectedMetrics = this.selectedMetrics.filter(item => item !== selectedMetric);
      this.speedTestService.setSelectedMetrics(this.selectedMetrics);
    } else if (this.selectedMetrics.length < 2){
      this.selectedMetrics.push(selectedMetric);
      this.speedTestService.setSelectedMetrics(this.selectedMetrics);
    } else {
      console.log('Cannot select more than 2 metrics to display on the chart')
    }
  }

  isSelected(metric: string): boolean{
    return this.selectedMetrics.includes(metric);
  }

  clearSelections() {
    this.selectedMetrics = [];
    this.speedTestService.setSelectedMetrics(this.selectedMetrics);
  }
}
