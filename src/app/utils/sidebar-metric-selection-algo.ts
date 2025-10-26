export function isMetricDisabled(metric: string, selectedMetrics: string[], isSelected: boolean): boolean | undefined {
  if (selectedMetrics.length < 2) {
    return false;
  } else if (selectedMetrics.length === 2) {
    if (
      (selectedMetrics[0].includes("Jitter")
        && selectedMetrics[1].includes("Jitter")
        && !metric.includes("Jitter"))
      || (selectedMetrics[0].includes("High")
        && selectedMetrics[1].includes("High")
        && !metric.includes("High"))
      || (selectedMetrics[0].includes("Low")
        && selectedMetrics[1].includes("Low")
        && !metric.includes("Low"))
      || (selectedMetrics[0].includes("Latency")
        && selectedMetrics[1].includes("Latency")
        && !metric.includes("Latency"))
      || (selectedMetrics[0].includes("idlePing")
        && selectedMetrics[1].includes("idlePing")
        && !metric.includes("idlePing"))
      || (selectedMetrics[0].includes("downloadPing")
        && selectedMetrics[1].includes("downloadPing")
        && !metric.includes("downloadPing"))
      || (selectedMetrics[0].includes("uploadPing")
        && selectedMetrics[1].includes("uploadPing")
        && !metric.includes("uploadPing")
      )
    ) {
      return true;
    } else if (
      (
        (selectedMetrics[0].includes('Bandwidth')
          && selectedMetrics[1].includes('Bandwidth'))
        || (selectedMetrics[0].includes('Bandwidth')
          && selectedMetrics[1].includes('packetLoss'))
        || (selectedMetrics[0].includes('packetLoss')
          && selectedMetrics[1].includes('Bandwidth')
        )
      )
      && !isSelected) {
      return true;
    } else {
      return false
    }
  } else if (selectedMetrics.length === 3) {
    if (
      (
        (selectedMetrics[0].includes('Latency')
          && selectedMetrics[1].includes('Latency')
          && selectedMetrics[2].includes('Latency'))
        || (selectedMetrics[0].includes('Low')
          && selectedMetrics[1].includes('Low')
          && selectedMetrics[2].includes('Low'))
        || (selectedMetrics[0].includes('High')
          && selectedMetrics[1].includes('High')
          && selectedMetrics[2].includes('High'))
        || (selectedMetrics[0].includes('Jitter')
          && selectedMetrics[1].includes('Jitter')
          && selectedMetrics[2].includes('Jitter')))
      && !isSelected) {
      return true;
    } else if (
      (
        (selectedMetrics[2].includes('idlePing')
          && !metric.includes('idlePing'))
        || (selectedMetrics[2].includes('downloadPing')
          && !metric.includes('downloadPing'))
        || (selectedMetrics[2].includes('downloadPing')
          && !metric.includes('downloadPing')))
      && !isSelected) {
      return true;
    } else {
      return false;
    }
  } else if (isSelected) {
    return false;
  } else {
    return true;
  }


}
