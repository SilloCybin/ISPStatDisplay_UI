import {Component} from '@angular/core';
import {SpeedtestService} from '../services/speedtest-service';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {isMetricDisabled} from '../utils/sidebar-metric-selection-algo';

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
    } else {
      this.selectedMetrics.push(selectedMetric);
    }
    this.speedTestService.setSelectedMetrics(this.selectedMetrics);
  }

  isSelected(metric: string): boolean {
    return this.selectedMetrics.includes(metric);
  }

  isMetricDisabled(metric: string): boolean | undefined {
    return isMetricDisabled(metric, this.selectedMetrics, this.isSelected(metric));
  }

  clearSelections() {
    this.selectedMetrics = [];
    this.speedTestService.setSelectedMetrics(this.selectedMetrics);
  }



}
