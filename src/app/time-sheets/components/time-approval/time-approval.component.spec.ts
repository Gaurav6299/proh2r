import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeApprovalComponent } from './time-approval.component';

describe('TimeApprovalComponent', () => {
  let component: TimeApprovalComponent;
  let fixture: ComponentFixture<TimeApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
