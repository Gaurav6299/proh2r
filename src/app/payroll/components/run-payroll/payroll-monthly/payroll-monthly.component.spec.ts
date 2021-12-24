import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollMonthlyComponent } from './payroll-monthly.component';

describe('PayrollMonthlyComponent', () => {
  let component: PayrollMonthlyComponent;
  let fixture: ComponentFixture<PayrollMonthlyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayrollMonthlyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollMonthlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
