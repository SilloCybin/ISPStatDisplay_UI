import {CarouselItem} from '../models/classes/carousel-item';
import {SpeedtestInterface} from '../models/interfaces/speedtest.interface';
import {AveragesInterface} from '../models/interfaces/averages.interface';

export function loadCarousel(latestTest: SpeedtestInterface, averages: AveragesInterface): CarouselItem[]{

  const carouselItemList: CarouselItem[] = [];

  const downloadBandwidthCarouselItem = new CarouselItem(1,'Download Bandwidth',
    latestTest?.downloadTest.bandwidth,
    averages?.downloadBandwidth,
    0);
  carouselItemList.push(downloadBandwidthCarouselItem);
  const uploadBandwidthCarouselItem = new CarouselItem(2, 'Upload Bandwidth',
    latestTest?.uploadTest.bandwidth,
    averages?.uploadBandwidth,
    0);
  carouselItemList.push(uploadBandwidthCarouselItem);

  const downloadPingLatencyCarouselItem = new CarouselItem(3,'Download Ping Latency',
    latestTest.downloadTest.downloadPing.latency,
    averages?.downloadPingLatency,
    1);
  carouselItemList.push(downloadPingLatencyCarouselItem);
  const uploadPingLatencyCarouselItem = new CarouselItem(4, 'Upload Ping Latency',
    latestTest.uploadTest.uploadPing.latency,
    averages?.uploadPingLatency,
    1);
  carouselItemList.push(uploadPingLatencyCarouselItem);
  const idlePingLatencyCarouselItem = new CarouselItem(5, 'Idle Ping Latency',
    latestTest.idlePing.latency,
    averages?.idlePingLatency,
    1);
  carouselItemList.push(idlePingLatencyCarouselItem);

  const downloadPingHighCarouselItem = new CarouselItem(6, 'Download Ping High',
    latestTest.downloadTest.downloadPing.high,
    averages?.downloadPingHigh,
    1);
  carouselItemList.push(downloadPingHighCarouselItem);
  const uploadPingHighCarouselItem = new CarouselItem(7, 'Upload Ping High',
    latestTest.uploadTest.uploadPing.high,
    averages?.uploadPingHigh,
    1);
  carouselItemList.push(uploadPingHighCarouselItem);
  const idlePingHighCarouselItem = new CarouselItem(8, 'Idle Ping High',
    latestTest.idlePing.high,
    averages?.idlePingHigh,
    1);
  carouselItemList.push(idlePingHighCarouselItem);

  const downloadPingLowCarouselItem = new CarouselItem(9, 'Download Ping Low',
    latestTest.downloadTest.downloadPing.low,
    averages?.downloadPingLow,
    1);
  carouselItemList.push(downloadPingLowCarouselItem);
  const uploadPingLowCarouselItem = new CarouselItem(10, 'Upload Ping Low',
    latestTest.uploadTest.uploadPing.low,
    averages?.uploadPingLow,
    1);
  carouselItemList.push(uploadPingLowCarouselItem);
  const idlePingLowCarouselItem = new CarouselItem(11, 'Idle Ping Low',
    latestTest.idlePing.low,
    averages?.idlePingLow,
    1);
  carouselItemList.push(idlePingLowCarouselItem);

  const downloadPingJitterCarouselItem = new CarouselItem(12, 'Download Ping Jitter',
    latestTest.downloadTest.downloadPing.jitter,
    averages?.downloadPingJitter,
    1);
  carouselItemList.push(downloadPingJitterCarouselItem);
  const uploadPingJitterCarouselItem = new CarouselItem(13, 'Upload Ping Jitter',
    latestTest.uploadTest.uploadPing.jitter,
    averages?.uploadPingJitter,
    1);
  carouselItemList.push(uploadPingJitterCarouselItem);
  const idlePingJitterCarouselItem = new CarouselItem(14, 'Idle Ping Jitter',
    latestTest.idlePing.jitter,
    averages?.idlePingJitter,
    1);
  carouselItemList.push(idlePingJitterCarouselItem);

  const packetLossCarouselItem = new CarouselItem(15, 'Packet Loss',
    latestTest?.packetLoss, averages?.packetLoss,
    2);
  carouselItemList.push(packetLossCarouselItem);

  return carouselItemList;
}
