import {FormGroup} from '@angular/forms';

export class TimeWindowSettings {

  private _isEntireHistory: boolean | undefined | null ;
  private _timeUnitNumber: number | undefined | null;
  private _timeUnit: string | undefined | null;
  private _startDate: Date | undefined | null;
  private _dateRange: FormGroup<any> | undefined | null;

  constructor(isEntireHistory?: boolean | undefined | null,
              timeUnitNumber?: number | undefined | null,
              timeUnit?: string | undefined | null,
              startDate?: Date | undefined | null,
              dateRange?: FormGroup<any> | undefined | null) {
    this._isEntireHistory = isEntireHistory;
    this._timeUnitNumber = timeUnitNumber;
    this._timeUnit = timeUnit;
    this._startDate = startDate;
    this._dateRange = dateRange;
  }

  get isEntireHistory(): boolean | undefined | null {
    return this._isEntireHistory;
  }

  set isEntireHistory(value: boolean | undefined | null) {
    this._isEntireHistory = value;
  }

  get timeUnitNumber(): number | undefined | null {
    return this._timeUnitNumber;
  }

  set timeUnitNumber(value: number | undefined | null) {
    this._timeUnitNumber = value;
  }

  get timeUnit(): string | undefined | null {
    return this._timeUnit;
  }

  set timeUnit(value: string | undefined | null) {
    this._timeUnit = value;
  }

  get startDate(): Date | undefined | null {
    return this._startDate;
  }

  set startDate(value: Date | undefined | null) {
    this._startDate = value;
  }

  get dateRange(): FormGroup<any> | undefined | null {
    return this._dateRange;
  }

  set dateRange(value: FormGroup<any> | undefined | null) {
    this._dateRange = value;
  }

  isTimeWindowEmpty(): boolean {
    return (!this.timeUnitNumber && !this.timeUnit && !this.startDate && !this.dateRange && !this.isEntireHistory)
  }
}
