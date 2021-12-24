import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementDashboardAccessComponent } from './management-dashboard-access.component';

describe('ManagementDashboardAccessComponent', () => {
  let component: ManagementDashboardAccessComponent;
  let fixture: ComponentFixture<ManagementDashboardAccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementDashboardAccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementDashboardAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
