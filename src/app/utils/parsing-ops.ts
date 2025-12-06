export function formatMetricName(metric: string) {
  if (metric.includes('Ping')) {
    return metric.charAt(0).toUpperCase()
      + metric.slice(1).replace(/([A-Z])/g, ' $1') + ' (ms)';
  } else if (metric.includes('Bandwidth')) {
    return metric.charAt(0).toUpperCase()
      + metric.slice(1).replace(/([A-Z])/g, ' $1') + ' (Mb/s)';
  } else if (metric == 'packetLoss') {
    return metric.charAt(0).toUpperCase()
      + metric.slice(1).replace(/([A-Z])/g, ' $1') + ' (%)';
  } else if (metric == 'polynomialRegression' || metric == 'exponentialMovingAverage'){
    return metric.charAt(0).toUpperCase()
      + metric.slice(1).replace(/([A-Z])/g, ' $1');
  }
  return '';
}

export function makeBandwidthPretty(uglyNumber: number): string {
  return new Intl.NumberFormat('fr-FR', {maximumFractionDigits: 2}).format(uglyNumber * 8 / 1000000);
}

export function makeMetricPretty(uglyNumber: number): string {
  return new Intl.NumberFormat('fr-FR', {maximumFractionDigits: 2}).format(uglyNumber);
}
