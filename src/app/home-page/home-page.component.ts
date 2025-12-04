import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {SpeedtestInterface} from '../models/interfaces/speedtest.interface';
import {Observable, Subject, Subscription, takeUntil} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {HomepageMetricItem} from '../models/classes/homepage-metric-item';
import {SlickCarouselModule} from 'ngx-slick-carousel';
import {AveragesInterface} from '../models/interfaces/averages.interface';
import {combineLatest} from 'rxjs';
import {MatIcon} from '@angular/material/icon';
import {HomePageService} from '../services/home-page.service';
import {ServerDetailsDialog} from './server-details-dialog/server-details-dialog';
import {makeBandwidthPretty, makeMetricPretty} from '../utils/pretty-value-maker';
import {loadHomepageMetricItems} from '../utils/homepage-metric-item-loader';
import {StandardDeviationsInterface} from '../models/interfaces/standard-deviations.interface';

@Component({
  selector: 'app-home-page',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardTitle,
    SlickCarouselModule,
    MatIcon
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit, OnDestroy {

  latestSpeedtestData: SpeedtestInterface | null = null;
  averages: AveragesInterface | null = null;
  standardDeviations: StandardDeviationsInterface | null = null;
  timestamp: Date | undefined;
  prettyTimestamp: string | undefined;

  subscriptions: Subscription[] = [];
  destroySubject: Subject<void> = new Subject<void>();

  homepageMetricList: HomepageMetricItem[] = [];

  readonly dialog: MatDialog = inject(MatDialog);
  protected readonly makeBandwidthPretty = makeBandwidthPretty;
  protected readonly makeMetricPretty = makeMetricPretty;

  constructor(private homePageService: HomePageService) {}

  ngOnInit() {
    const speedtest$: Observable<SpeedtestInterface> = this.homePageService.getLatestSpeedtestData().pipe(takeUntil(this.destroySubject));
    const averages$: Observable<AveragesInterface> = this.homePageService.getAverages().pipe(takeUntil(this.destroySubject));
    const standardDeviations$: Observable<StandardDeviationsInterface> = this.homePageService.getStandardDeviations().pipe(takeUntil(this.destroySubject));

    const averagesStream$: Observable<AveragesInterface> = this.homePageService.streamAverages().pipe(takeUntil(this.destroySubject));
    const speedtestDataStream$: Observable<SpeedtestInterface> = this.homePageService.streamSpeedtestData().pipe(takeUntil(this.destroySubject));
    const standardDeviationStream$: Observable<StandardDeviationsInterface> = this.homePageService.streamStandardDeviations().pipe(takeUntil(this.destroySubject));

    this.loadUpdatedData(averages$, speedtest$, standardDeviations$);
    this.loadUpdatedData(averagesStream$, speedtestDataStream$, standardDeviationStream$);
  }

  loadUpdatedData(averages$: Observable<AveragesInterface>,
                  speedtestData$: Observable<SpeedtestInterface>,
                  standardDeviations$: Observable<StandardDeviationsInterface>){

    const combinedSub = combineLatest([speedtestData$, averages$, standardDeviations$]).subscribe({
      next: ([speedtestData, averages, standardDeviations]) => {
        this.latestSpeedtestData = speedtestData;
        this.averages = averages;
        this.standardDeviations = standardDeviations;
        this.timestamp = new Date(speedtestData.timestamp);
        this.prettyTimestamp = this.timestamp.toLocaleString();

        this.homepageMetricList = loadHomepageMetricItems(speedtestData, averages, standardDeviations);
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
    this.destroySubject.next();
    this.destroySubject.complete();
  }

}
