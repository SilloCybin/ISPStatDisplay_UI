import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataExplorer } from './data-explorer.component';
import {CoordinatesService} from '../../services/coordinates.service';
import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {HomePageService} from '../../services/home-page.service';

describe('DataExplorer', () => {
  let component: DataExplorer;
  let fixture: ComponentFixture<DataExplorer>;
  let service: HomePageService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataExplorer],
      providers: [
        CoordinatesService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataExplorer);
    component = fixture.componentInstance;
    fixture.detectChanges();

    service = TestBed.inject(HomePageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
