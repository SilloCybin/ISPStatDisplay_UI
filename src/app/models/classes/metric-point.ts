export class MetricPoint{

  private _value: number;
  private _timestamp: Date;

  constructor(value: number, timestamp: Date) {
    this._value = value;
    this._timestamp = timestamp;
  }

 public get value(): number {
    return this._value;
  }

  set value(value: number) {
    this._value = value;
  }

  get timestamp(): Date {
    return this._timestamp;
  }

  set timestamp(value: Date) {
    this._timestamp = value;
  }
}
