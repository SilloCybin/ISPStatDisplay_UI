import {ChartOptions} from '../models/types/chart-options';
import {colors} from './colors';

export const chartOptions: ChartOptions = {
  series: [],
  chart: {
    type: 'line',
    height: 695,
  },
  xaxis: {
    categories: []
  },
  yaxis: [],
  title: {
    text: ''
  },
  colors: colors
};
