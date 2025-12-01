import {MeasurementType} from '../enums/measurement-type';

export class HomepageMetricItem {

  private _id: number;
  private _metric: string;
  private _latest_value: number;
  private _average_value: number;
  private _standardDeviation_value: number;
  private _measurementType: MeasurementType;
  private _differenceWithAveragePercentage: number = 0;
  private _distanceToStandardDeviationPercentage: number = 0;

  constructor(id: number, metric: string, value: number, average: number, standardDeviation: number, type: MeasurementType) {
    this._id = id;
    this._metric = metric;
    this._latest_value = value;
    this._average_value = average;
    this._standardDeviation_value = standardDeviation;
    this._measurementType = type;
    this._differenceWithAveragePercentage = this.computeDifferenceWithAveragePercentage();
    this._distanceToStandardDeviationPercentage = this.computeDistanceToStandardDeviationPercentage();
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

  get differenceWithAveragePercentage(): number {
    return this._differenceWithAveragePercentage;
  }

  set differenceWithAveragePercentage(value: number) {
    this._differenceWithAveragePercentage = value;
  }

  get standardDeviation_value(): number {
    return this._standardDeviation_value;
  }

  set standardDeviation_value(value: number) {
    this._standardDeviation_value = value;
  }

  get distanceToStandardDeviationPercentage(): number {
    return this._distanceToStandardDeviationPercentage;
  }

  set distanceToStandardDeviationPercentage(value: number) {
    this._distanceToStandardDeviationPercentage = value;
  }

  computeDifferenceWithAveragePercentage(): number {
    if (this._latest_value > this._average_value) {
      return (((this._latest_value - this._average_value) / this._average_value) * 100);
    } else if (this._latest_value === this._average_value){
      return 0;
    }
    else {
      return (((this._average_value - this._latest_value) / this._average_value) * 100 * (-1));
    }
  }

  computeDistanceToStandardDeviationPercentage(): number {
    if (this._latest_value > this._average_value) {
      if ((this._latest_value - this._average_value) > this._standardDeviation_value){
        return ((((this._latest_value - this._average_value) - this._standardDeviation_value) / this._standardDeviation_value) * 100);
      } else {
        return 0;
      }
    } else if (this._average_value > this._latest_value){
      if ((this._average_value - this._latest_value) > this._standardDeviation_value){
        return ((((this._average_value - this._latest_value) - this._standardDeviation_value) / this._standardDeviation_value) * 100);
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }

}
