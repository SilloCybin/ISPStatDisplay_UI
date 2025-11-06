import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {SpeedtestService} from '../services/speedtest.service';
import {SpeedtestInterface} from '../models/interfaces/speedtest.interface';
import {Observable, Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialog, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {ServerInterface} from '../models/interfaces/server.interface';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {CarouselItem} from '../models/classes/carousel-item';
import {SlickCarouselModule} from 'ngx-slick-carousel';
import {AveragesInterface} from '../models/interfaces/averages.interface';
import {combineLatest} from 'rxjs';
import {MeasurementType} from '../models/enums/measurement-type';
import {MatIcon} from '@angular/material/icon';
import {SpeedtestStreamService} from '../services/speedtest-stream.service';


@Component({
  selector: 'app-home-page',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardTitle,
    SlickCarouselModule,
    MatIcon,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit, OnDestroy {

  latestTest: SpeedtestInterface | null = null;
  timestamp: Date | undefined;
  prettyTimestamp: string | undefined;

  averages: AveragesInterface | null = null;

  subscriptions: Subscription[] = [];

  carouselItemList: CarouselItem[] = [];
  carouselConfig = {
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    dots: true,
    arrows: false,
    infinite: true,
    pauseOnHover: true
  };

  readonly dialog = inject(MatDialog);
  protected readonly MeasurementType = MeasurementType;

  constructor(private speedtestService: SpeedtestService, private speedtestStreamService: SpeedtestStreamService) {}

  ngOnInit() {
    const speedtest$: Observable<SpeedtestInterface> = this.speedtestService.getLatestTest();
    const averages$: Observable<AveragesInterface> = this.speedtestService.getMetricsAverages();

    const streamAverages$: Observable<AveragesInterface> = this.speedtestStreamService.getAveragesStream();
    const streamSpeedtestData$: Observable<SpeedtestInterface> = this.speedtestStreamService.getSpeedtestDataStream();

    this.loadUpdatedData(averages$, speedtest$);
    this.loadUpdatedData(streamAverages$, streamSpeedtestData$);
  }

  loadUpdatedData(averages$: Observable<AveragesInterface>, speedtestData$: Observable<SpeedtestInterface>){

    const combinedSub: Subscription = combineLatest([speedtestData$, averages$]).subscribe({
      next: ([speedtest, averages]) => {

        this.carouselItemList = [];

        this.latestTest = speedtest;
        this.averages = averages;

        console.log(this.latestTest);
        console.log(this.averages);

        this.timestamp = new Date(speedtest.timestamp);
        this.prettyTimestamp = this.timestamp.toLocaleString();

        const downloadBandwidthCarouselItem = new CarouselItem('Download Bandwidth',
          this.latestTest?.downloadTest.bandwidth,
          this.averages?.downloadBandwidth,
          0);
        this.carouselItemList.push(downloadBandwidthCarouselItem);
        const uploadBandwidthCarouselItem = new CarouselItem('Upload Bandwidth',
          this.latestTest?.uploadTest.bandwidth,
          this.averages?.uploadBandwidth,
          0);
        this.carouselItemList.push(uploadBandwidthCarouselItem);

        const downloadPingLatencyCarouselItem = new CarouselItem('Download Ping Latency',
          this.latestTest.downloadTest.downloadPing.latency,
          this.averages?.downloadPingLatency,
          1);
        this.carouselItemList.push(downloadPingLatencyCarouselItem);
        const uploadPingLatencyCarouselItem = new CarouselItem('Upload Ping Latency',
          this.latestTest.uploadTest.uploadPing.latency,
          this.averages?.uploadPingLatency,
          1);
        this.carouselItemList.push(uploadPingLatencyCarouselItem);
        const idlePingLatencyCarouselItem = new CarouselItem('Idle Ping Latency',
          this.latestTest.idlePing.latency,
          this.averages?.idlePingLatency,
          1);
        this.carouselItemList.push(idlePingLatencyCarouselItem);

        const downloadPingHighCarouselItem = new CarouselItem('Download Ping High',
          this.latestTest.downloadTest.downloadPing.high,
          this.averages?.downloadPingHigh,
          1);
        this.carouselItemList.push(downloadPingHighCarouselItem);
        const uploadPingHighCarouselItem = new CarouselItem('Upload Ping High',
          this.latestTest.uploadTest.uploadPing.high,
          this.averages?.uploadPingHigh,
          1);
        this.carouselItemList.push(uploadPingHighCarouselItem);
        const idlePingHighCarouselItem = new CarouselItem('Idle Ping High',
          this.latestTest.idlePing.high,
          this.averages?.idlePingHigh,
          1);
        this.carouselItemList.push(idlePingHighCarouselItem);

        const downloadPingLowCarouselItem = new CarouselItem('Download Ping Low',
          this.latestTest.downloadTest.downloadPing.low,
          this.averages?.downloadPingLow,
          1);
        this.carouselItemList.push(downloadPingLowCarouselItem);
        const uploadPingLowCarouselItem = new CarouselItem('Upload Ping Low',
          this.latestTest.uploadTest.uploadPing.low,
          this.averages?.uploadPingLow,
          1);
        this.carouselItemList.push(uploadPingLowCarouselItem);
        const idlePingLowCarouselItem = new CarouselItem('Idle Ping Low',
          this.latestTest.idlePing.low,
          this.averages?.idlePingLow,
          1);
        this.carouselItemList.push(idlePingLowCarouselItem);

        const downloadPingJitterCarouselItem = new CarouselItem('Download Ping Jitter',
          this.latestTest.downloadTest.downloadPing.jitter,
          this.averages?.downloadPingJitter,
          1);
        this.carouselItemList.push(downloadPingJitterCarouselItem);
        const uploadPingJitterCarouselItem = new CarouselItem('Upload Ping Jitter',
          this.latestTest.uploadTest.uploadPing.jitter,
          this.averages?.uploadPingJitter,
          1);
        this.carouselItemList.push(uploadPingJitterCarouselItem);
        const idlePingJitterCarouselItem = new CarouselItem('Idle Ping Jitter',
          this.latestTest.idlePing.jitter,
          this.averages?.idlePingJitter,
          1);
        this.carouselItemList.push(idlePingJitterCarouselItem);

        const packetLossCarouselItem = new CarouselItem('Packet Loss',
          this.latestTest?.packetLoss, this.averages?.packetLoss,
          2);
        this.carouselItemList.push(packetLossCarouselItem);
      },
      error: (error) => console.error('Error fetching data:', error.message)
    });

    this.subscriptions.push(combinedSub);
  }

  makeBandwidthPretty(uglyNumber: number): string {
    return new Intl.NumberFormat('fr-FR', {maximumFractionDigits: 2}).format(uglyNumber * 8 / 1000000);
  }

  makeMetricPretty(uglyNumber: number): string {
    return new Intl.NumberFormat('fr-FR', {maximumFractionDigits: 2}).format(uglyNumber);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ServerDetailsDialog, {
      data: {
        server_id: this.latestTest?.server.server_id,
        hostname: this.latestTest?.server.hostname,
        ip: this.latestTest?.server.ip,
        location: this.latestTest?.server.location,
        provider: this.latestTest?.server.provider,
        country: this.latestTest?.server.country
      }
    })
  }

}

@Component({
  selector: 'server-details-dialog',
  templateUrl: 'server-details-dialog.html',
  imports: [
    MatDialogTitle,
    MatDialogContent
  ],
})
export class ServerDetailsDialog {
  readonly data = inject<ServerInterface>(MAT_DIALOG_DATA);
}
