import {Component, OnDestroy, OnInit} from '@angular/core';
import {HeatmapService} from '../../services/heatmap/heatmap.service';
import {filter, Subject, switchMap, takeUntil, tap} from 'rxjs';
import {TimeslotAveragesInterface} from '../../models/interfaces/timeslot-averages.interface';
import {
  MatCell,
  MatCellDef, MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-heatmap',
  imports: [
    MatTable,
    MatIcon,
    MatRowDef,
    MatRow,
    MatHeaderRow,
    MatHeaderRowDef,
    MatCell,
    MatCellDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatColumnDef
  ],
  templateUrl: './heatmap.component.html',
  styleUrl: './heatmap.component.css',
})
export class HeatmapComponent implements OnInit, OnDestroy{

  private destroySubject: Subject<void> = new Subject<void>();

  displayedColumns: string[] = ['hour', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  tableData: TimeslotAveragesInterface[] = [];

  private minValue!: number;
  private maxValue!: number;
  private selectedMetric: string = '';


  constructor(private heatmapService: HeatmapService){}


  ngOnInit(){

    this.heatmapService.selectedMetric$.pipe(
      tap((metric)=> {
        this.tableData = [];
        this.selectedMetric = metric}
      ),
      takeUntil(this.destroySubject),
      filter(metric => ((metric !== '') && (metric !== undefined))),
      switchMap(metric => this.heatmapService.getTimeslotAverages(metric))).subscribe({
          next: timeslotAverages => {
            this.computeMinMax(timeslotAverages);
            this.tableData = timeslotAverages;
          },
          error: (error) => console.error('Error fetching data:', error.message)
      });
  }


  private extractValues(data: TimeslotAveragesInterface[]): number[] {
    return data.flatMap(row => [
      row.mondayAverage,
      row.tuesdayAverage,
      row.wednesdayAverage,
      row.thursdayAverage,
      row.fridayAverage,
      row.saturdayAverage,
      row.sundayAverage
    ]);
  }

  private computeMinMax(data: TimeslotAveragesInterface[]) {
    const values = this.extractValues(data);
    this.minValue = Math.min(...values);
    this.maxValue = Math.max(...values);
  }

  private normalize(value: number): number {
    if (this.selectedMetric.includes('Bandwidth')) {
      return (value - this.minValue) / (this.maxValue - this.minValue);
    } else {
      return (this.maxValue - value) / (this.maxValue - this.minValue);
    }
  }

  getHeatmapColor(value: number): string {
    const t = this.normalize(value);
    const hue = t * 120;
    const lightness = 30 + 40 * (1 - Math.abs(2 * t - 1));
    const saturation = 90;

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  getMetricType(): string{
    if (this.selectedMetric.includes('Bandwidth')){
      return 'load'
    } else if (this.selectedMetric === 'packetLoss') {
      return 'packetLoss'
    } else {
      return 'timeMeasurement'
    }
  }


  ngOnDestroy(){
    this.heatmapService.setSelectedMetric(['']);
    this.destroySubject.next();
    this.destroySubject.complete();
  }
}
