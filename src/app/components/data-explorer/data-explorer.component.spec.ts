import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataExplorer } from './data-explorer.component';
import {CoordinatesService} from '../../services/coordinates/coordinates.service';
import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {HomepageService} from '../../services/homepage/homepage.service';

describe('DataExplorer', () => {
  let component: DataExplorer;
  let fixture: ComponentFixture<DataExplorer>;
  let service: HomepageService;
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

    service = TestBed.inject(HomepageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
