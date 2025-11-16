import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {SpeedtestInterface} from '../models/interfaces/speedtest.interface';
import {Observable, Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {CarouselItem} from '../models/classes/carousel-item';
import {SlickCarouselModule} from 'ngx-slick-carousel';
import {AveragesInterface} from '../models/interfaces/averages.interface';
import {combineLatest} from 'rxjs';
import {MeasurementType} from '../models/enums/measurement-type';
import {MatIcon} from '@angular/material/icon';
import {HomePageService} from '../services/home-page.service';
import {ServerDetailsDialog} from './server-details-dialog/server-details-dialog';
import {makeBandwidthPretty, makeMetricPretty} from '../utils/pretty-value-maker';
import {loadCarousel} from '../utils/carousel-loader';

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

  latestSpeedtestData: SpeedtestInterface | null = null;
  averages: AveragesInterface | null = null;
  timestamp: Date | undefined;
  prettyTimestamp: string | undefined;

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

  readonly dialog: MatDialog = inject(MatDialog);
  protected readonly measurementType = MeasurementType;
  protected readonly makeBandwidthPretty = makeBandwidthPretty;
  protected readonly makeMetricPretty = makeMetricPretty;

  constructor(private homePageService: HomePageService) {}

  ngOnInit() {
    const speedtest$: Observable<SpeedtestInterface> = this.homePageService.getLatestSpeedtestData();
    const averages$: Observable<AveragesInterface> = this.homePageService.getAverages();

    const averagesStream$: Observable<AveragesInterface> = this.homePageService.streamAverages();
    const speedtestDataStream$: Observable<SpeedtestInterface> = this.homePageService.streamSpeedtestData();

    this.loadUpdatedData(averages$, speedtest$);
    this.loadUpdatedData(averagesStream$, speedtestDataStream$);
  }

  loadUpdatedData(averages$: Observable<AveragesInterface>, speedtestData$: Observable<SpeedtestInterface>){
    const combinedSub = combineLatest([speedtestData$, averages$]).subscribe({
      next: ([speedtestData, averages]: [SpeedtestInterface, AveragesInterface]) => {
        this.latestSpeedtestData = speedtestData;
        this.averages = averages;
        this.timestamp = new Date(speedtestData.timestamp);
        this.prettyTimestamp = this.timestamp.toLocaleString();

        this.carouselItemList = loadCarousel(speedtestData, averages);
      },
      error: (error) => console.error('Error fetching data:', error.message)
    });
    this.subscriptions.push(combinedSub);
  }

  openDialog() {
    this.dialog.open(ServerDetailsDialog, {
      data: {
        server_id: this.latestSpeedtestData?.server.server_id,
        hostname: this.latestSpeedtestData?.server.hostname,
        ip: this.latestSpeedtestData?.server.ip,
        location: this.latestSpeedtestData?.server.location,
        provider: this.latestSpeedtestData?.server.provider,
        country: this.latestSpeedtestData?.server.country
      }
    })
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
