import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataExplorerSidebarComponent } from './data-explorer-sidebar.component';

describe('DataExplorerSidebarComponent', () => {
  let component: DataExplorerSidebarComponent;
  let fixture: ComponentFixture<DataExplorerSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataExplorerSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataExplorerSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
