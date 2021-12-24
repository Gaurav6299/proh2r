import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxPayslipComponent } from './tax-payslip.component';

describe('TaxPayslipComponent', () => {
  let component: TaxPayslipComponent;
  let fixture: ComponentFixture<TaxPayslipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxPayslipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxPayslipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
