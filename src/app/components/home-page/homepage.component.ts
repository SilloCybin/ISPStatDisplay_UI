import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {SpeedtestInterface} from '../../models/interfaces/speedtest.interface';
import {filter, Observable, Subject, Subscription, take, takeUntil} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {HomepageMetricItem} from '../../models/classes/homepage-metric-item';
import {SlickCarouselModule} from 'ngx-slick-carousel';
import {AveragesInterface} from '../../models/interfaces/averages.interface';
import {combineLatest} from 'rxjs';
import {MatIcon} from '@angular/material/icon';
import {HomepageService} from '../../services/homepage/homepage.service';
import {ServerDetailsDialog} from './server-details-dialog/server-details-dialog';
import {makeBandwidthPretty, makeMetricPretty} from '../../utils/parsing-ops';
import {loadHomepageMetricItems} from '../../utils/homepage-metric-item-loader';
import {StandardDeviationsInterface} from '../../models/interfaces/standard-deviations.interface';
import {AuthService} from '../../services/auth/auth.service';

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
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit, OnDestroy {

  latestSpeedtestData: SpeedtestInterface | null = null;
  averages: AveragesInterface | null = null;
  standardDeviations: StandardDeviationsInterface | null = null;
  timestamp: Date | undefined;
  prettyTimestamp: string | undefined;

  destroySubject: Subject<void> = new Subject<void>();

  homepageMetricList: HomepageMetricItem[] = [];

  readonly dialog: MatDialog = inject(MatDialog);
  protected readonly makeBandwidthPretty = makeBandwidthPretty;
  protected readonly makeMetricPretty = makeMetricPretty;

  constructor(private homePageService: HomepageService, private authService: AuthService) {}

  ngOnInit() {

    this.authService.loggedIn$.pipe(
      takeUntil(this.destroySubject),
      filter(loggedIn => (loggedIn && !!this.authService.getToken())),
      take(1)
    ).subscribe(() => {

      const speedtest$ = this.homePageService.getLatestSpeedtestData();
      const averages$ = this.homePageService.getAverages();
      const standardDeviations$ = this.homePageService.getStandardDeviations();

      const speedtestDataStream$ = this.homePageService.streamSpeedtestData();
      const averagesStream$ = this.homePageService.streamAverages();
      const standardDeviationsStream$ = this.homePageService.streamStandardDeviations();

      this.loadUpdatedData(averages$, speedtest$, standardDeviations$);
      this.loadUpdatedData(averagesStream$, speedtestDataStream$, standardDeviationsStream$);
    })
  }

  loadUpdatedData(averages$: Observable<AveragesInterface>,
                  speedtestData$: Observable<SpeedtestInterface>,
                  standardDeviations$: Observable<StandardDeviationsInterface>){

    combineLatest([speedtestData$, averages$, standardDeviations$])
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
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
    this.destroySubject.next();
    this.destroySubject.complete();
  }

}
