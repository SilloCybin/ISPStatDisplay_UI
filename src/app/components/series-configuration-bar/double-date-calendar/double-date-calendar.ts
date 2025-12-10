import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-double-datepicker-toggle-wrapper',
  templateUrl: './double-date-calendar.html',
  styleUrl: './double-date-calendar.css',
  standalone: false
})
export class DoubleDatepickerToggleWrapperComponent implements OnInit{

  @Output() selectedDateRangeEmitter: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  selectedDateRange: FormGroup = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  minDate = new Date('2025-10-17');
  maxDate = new Date();

  constructor() {}

  ngOnInit(){
    this.selectedDateRange.valueChanges.subscribe(range => {
      const { start, end } = range;
      if (start && end) {  // Only trigger if both dates are chosen
        this.onRangeSelected();
      }
    });
  }

  onRangeSelected() {
    this.selectedDateRangeEmitter.emit(this.selectedDateRange);
  }
}
