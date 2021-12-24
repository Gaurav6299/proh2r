import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyOffcyclePaymentComponent } from './monthly-offcycle-payment.component';

describe('MonthlyOffcyclePaymentComponent', () => {
  let component: MonthlyOffcyclePaymentComponent;
  let fixture: ComponentFixture<MonthlyOffcyclePaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlyOffcyclePaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyOffcyclePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
