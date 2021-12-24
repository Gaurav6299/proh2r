import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveEmployeeOffcyclePaymentComponent } from './active-employee-offcycle-payment.component';

describe('ActiveEmployeeOffcyclePaymentComponent', () => {
  let component: ActiveEmployeeOffcyclePaymentComponent;
  let fixture: ComponentFixture<ActiveEmployeeOffcyclePaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveEmployeeOffcyclePaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveEmployeeOffcyclePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
