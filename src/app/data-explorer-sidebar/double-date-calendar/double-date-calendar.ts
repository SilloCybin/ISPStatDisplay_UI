import {Component, EventEmitter, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-double-datepicker-toggle-wrapper',
  templateUrl: './double-date-calendar.html',
  styleUrl: './double-date-calendar.css',
  standalone: false
})
export class DoubleDatepickerToggleWrapperComponent {

  @Output() selectedDateRangeEmitter: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  selectedRange: FormGroup = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  minDate = new Date('2025-10-17');

  constructor() {
    this.selectedRange.valueChanges.subscribe(range => {
      const { start, end } = range;
      if (start && end) {  // Only trigger if both dates are chosen
        this.onRangeSelected();
      }
    });
  }

  onRangeSelected() {
    this.selectedDateRangeEmitter.emit(this.selectedRange);
  }
}
