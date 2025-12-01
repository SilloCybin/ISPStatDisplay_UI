import {HomepageMetricItem} from '../models/classes/homepage-metric-item';
import {SpeedtestInterface} from '../models/interfaces/speedtest.interface';
import {AveragesInterface} from '../models/interfaces/averages.interface';
import {StandardDeviationsInterface} from '../models/interfaces/standard-deviations.interface';

export function loadHomepageMetricItems(latestTest: SpeedtestInterface,
                                        averages: AveragesInterface,
                                        standardDeviation: StandardDeviationsInterface): HomepageMetricItem[]{

  const homepageMetricItems: HomepageMetricItem[] = [];

  const downloadBandwidthMetricItem = new HomepageMetricItem(1,'Download Bandwidth',
    latestTest?.downloadTest.bandwidth,
    averages?.downloadBandwidth,
    standardDeviation?.downloadBandwidth,
    0);
  homepageMetricItems.push(downloadBandwidthMetricItem);
  const uploadBandwidthMetricItem = new HomepageMetricItem(2, 'Upload Bandwidth',
    latestTest?.uploadTest.bandwidth,
    averages?.uploadBandwidth,
    standardDeviation?.uploadBandwidth,
    0);
  homepageMetricItems.push(uploadBandwidthMetricItem);

  const downloadPingLatencyMetricItem = new HomepageMetricItem(3,'Download Ping Latency',
    latestTest.downloadTest.downloadPing.latency,
    averages?.downloadPingLatency,
    standardDeviation?.downloadPingLatency,
    1);
  homepageMetricItems.push(downloadPingLatencyMetricItem);
  const uploadPingLatencyMetricItem = new HomepageMetricItem(4, 'Upload Ping Latency',
    latestTest.uploadTest.uploadPing.latency,
    averages?.uploadPingLatency,
    standardDeviation?.uploadPingLatency,
    1);
  homepageMetricItems.push(uploadPingLatencyMetricItem);
  const idlePingLatencyMetricItem = new HomepageMetricItem(5, 'Idle Ping Latency',
    latestTest.idlePing.latency,
    averages?.idlePingLatency,
    standardDeviation?.idlePingLatency,
    1);
  homepageMetricItems.push(idlePingLatencyMetricItem);

  const downloadPingHighMetricItem = new HomepageMetricItem(6, 'Download Ping High',
    latestTest.downloadTest.downloadPing.high,
    averages?.downloadPingHigh,
    standardDeviation?.downloadPingHigh,
    1);
  homepageMetricItems.push(downloadPingHighMetricItem);
  const uploadPingHighMetricItem = new HomepageMetricItem(7, 'Upload Ping High',
    latestTest.uploadTest.uploadPing.high,
    averages?.uploadPingHigh,
    standardDeviation?.uploadPingHigh,
    1);
  homepageMetricItems.push(uploadPingHighMetricItem);
  const idlePingHighMetricItem = new HomepageMetricItem(8, 'Idle Ping High',
    latestTest.idlePing.high,
    averages?.idlePingHigh,
    standardDeviation?.idlePingHigh,
    1);
  homepageMetricItems.push(idlePingHighMetricItem);

  const downloadPingLowMetricItem = new HomepageMetricItem(9, 'Download Ping Low',
    latestTest.downloadTest.downloadPing.low,
    averages?.downloadPingLow,
    standardDeviation?.downloadPingLow,
    1);
  homepageMetricItems.push(downloadPingLowMetricItem);
  const uploadPingLowMetricItem = new HomepageMetricItem(10, 'Upload Ping Low',
    latestTest.uploadTest.uploadPing.low,
    averages?.uploadPingLow,
    standardDeviation?.uploadPingLow,
    1);
  homepageMetricItems.push(uploadPingLowMetricItem);
  const idlePingLowMetricItem = new HomepageMetricItem(11, 'Idle Ping Low',
    latestTest.idlePing.low,
    averages?.idlePingLow,
    standardDeviation?.idlePingLow,
    1);
  homepageMetricItems.push(idlePingLowMetricItem);

  const downloadPingJitterMetricItem = new HomepageMetricItem(12, 'Download Ping Jitter',
    latestTest.downloadTest.downloadPing.jitter,
    averages?.downloadPingJitter,
    standardDeviation?.downloadPingJitter,
    1);
  homepageMetricItems.push(downloadPingJitterMetricItem);
  const uploadPingJitterMetricItem = new HomepageMetricItem(13, 'Upload Ping Jitter',
    latestTest.uploadTest.uploadPing.jitter,
    averages?.uploadPingJitter,
    standardDeviation?.uploadPingJitter,
    1);
  homepageMetricItems.push(uploadPingJitterMetricItem);
  const idlePingJitterMetricItem = new HomepageMetricItem(14, 'Idle Ping Jitter',
    latestTest.idlePing.jitter,
    averages?.idlePingJitter,
    standardDeviation?.idlePingJitter,
    1);
  homepageMetricItems.push(idlePingJitterMetricItem);

  const packetLossMetricItem = new HomepageMetricItem(15, 'Packet Loss',
    latestTest?.packetLoss,
    averages?.packetLoss,
    standardDeviation?.packetLoss,
    2);
  homepageMetricItems.push(packetLossMetricItem);

  return homepageMetricItems;
}
