import {Coordinate} from '../models/classes/coordinate';

export function determineStartDateFromNow(timeUnitNumber: number, timeUnit: string): Date {
  const now = new Date();
  const startDate = new Date(now);

  switch (timeUnit) {
    case 'days-0':
      startDate.setDate(now.getDate() - timeUnitNumber);
      break;
    case 'weeks-1':
      startDate.setDate(now.getDate() - timeUnitNumber * 7);
      break;
    case 'months-2':
      startDate.setMonth(now.getMonth() - timeUnitNumber);
      break;
    case 'years-3':
      startDate.setFullYear(now.getFullYear() - timeUnitNumber);
      break;
    default:
      throw new Error(`Invalid time unit: ${timeUnit}`);
  }

  return startDate;
}

export function is5DayOrMoreSeries(series: Coordinate[]): boolean{
  const startDate = new Date(series[0].timestamp);
  const endDate = new Date (series[series.length - 1].timestamp);

  return (((endDate.getTime() - startDate.getTime()) / 86400000) >= 5)
}
