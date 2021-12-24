import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessEmployeeOffcyclePaymentComponent } from './process-employee-offcycle-payment.component';

describe('ProcessEmployeeOffcyclePaymentComponent', () => {
  let component: ProcessEmployeeOffcyclePaymentComponent;
  let fixture: ComponentFixture<ProcessEmployeeOffcyclePaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessEmployeeOffcyclePaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessEmployeeOffcyclePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
