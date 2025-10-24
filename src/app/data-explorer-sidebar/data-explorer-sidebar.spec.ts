import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataExplorerSidebar } from './data-explorer-sidebar';

describe('DataExplorerSidebar', () => {
  let component: DataExplorerSidebar;
  let fixture: ComponentFixture<DataExplorerSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataExplorerSidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataExplorerSidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
