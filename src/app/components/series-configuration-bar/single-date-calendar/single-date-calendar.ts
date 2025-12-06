import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-datepicker-toggle-wrapper',
  templateUrl: './single-date-calendar.html',
  styleUrl: './single-date-calendar.css',
  standalone: false
})
export class DatepickerToggleWrapperComponent {

  @Output() selectedDateEmitter = new EventEmitter<Date>();
  selectedDate!: Date;

  minDate = new Date('2025-10-17');
  maxDate = new Date();

  constructor() {}

  onDateChange() {
    this.selectedDateEmitter.emit(this.selectedDate);
  }
}
