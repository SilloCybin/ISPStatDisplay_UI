import {MeasurementType} from '../enums/measurement-type';

export class CarouselItem {

  private _id: number;
  private _metric: string;
  private _latest_value: number;
  private _average_value: number;
  private _measurementType: MeasurementType;
  private _differencePercentage: number = 0;

  constructor(id: number, metric: string, value: number, average: number, type: MeasurementType) {
    this._id = id;
    this._metric = metric;
    this._latest_value = value;
    this._average_value = average;
    this._measurementType = type;
    this._differencePercentage = this.computeDifferencePercentage();
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get metric(): string {
    return this._metric;
  }

  set metric(value: string) {
    this._metric = value;
  }

  get latest_value(): number {
    return this._latest_value;
  }

  set latest_value(value: number) {
    this._latest_value = value;
  }

  get average_value(): number {
    return this._average_value;
  }

  set average_value(value: number) {
    this._average_value = value;
  }

  get measurementType(): MeasurementType {
    return this._measurementType;
  }

  set measurementType(value: MeasurementType) {
    this._measurementType = value;
  }

  get differencePercentage(): number {
    return this._differencePercentage;
  }

  set differencePercentage(value: number) {
    this._differencePercentage = value;
  }

  computeDifferencePercentage(): number {
    if (this._latest_value > this._average_value) {
      return (((this._latest_value - this._average_value) / this._average_value) * 100);
    } else if (this._latest_value === this._average_value){
      return 0;
    }
    else {
      return (((this._average_value - this._latest_value) / this._average_value) * 100 * (-1));
    }
  }

}
