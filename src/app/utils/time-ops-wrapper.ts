import * as timeOpsOriginal from './time-ops';

// Wrap all utility functions you might want to spy on
export const timeOpsWrapper = {
  is5DayOrMoreSeries: timeOpsOriginal.is5DayOrMoreSeries
};
