import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessAlertsComponent } from './process-alerts.component';

describe('ProcessAlertsComponent', () => {
  let component: ProcessAlertsComponent;
  let fixture: ComponentFixture<ProcessAlertsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessAlertsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
