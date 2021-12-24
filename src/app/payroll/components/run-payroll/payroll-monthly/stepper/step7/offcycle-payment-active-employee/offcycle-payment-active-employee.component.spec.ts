import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OffcyclePaymentActiveEmployeeComponent } from './offcycle-payment-active-employee.component';

describe('OffcyclePaymentActiveEmployeeComponent', () => {
  let component: OffcyclePaymentActiveEmployeeComponent;
  let fixture: ComponentFixture<OffcyclePaymentActiveEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffcyclePaymentActiveEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffcyclePaymentActiveEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
