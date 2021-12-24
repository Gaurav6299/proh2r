import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupReportListComponent } from './group-report-list.component';

describe('GroupReportListComponent', () => {
  let component: GroupReportListComponent;
  let fixture: ComponentFixture<GroupReportListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupReportListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
