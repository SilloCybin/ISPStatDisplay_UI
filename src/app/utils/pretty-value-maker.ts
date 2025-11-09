export function makeBandwidthPretty(uglyNumber: number): string {
  return new Intl.NumberFormat('fr-FR', {maximumFractionDigits: 2}).format(uglyNumber * 8 / 1000000);
}

export function makeMetricPretty(uglyNumber: number): string {
  return new Intl.NumberFormat('fr-FR', {maximumFractionDigits: 2}).format(uglyNumber);
}
