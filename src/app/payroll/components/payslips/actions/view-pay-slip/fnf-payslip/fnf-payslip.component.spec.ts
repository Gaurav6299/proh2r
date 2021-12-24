import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FnfPayslipComponent } from './fnf-payslip.component';

describe('FnfPayslipComponent', () => {
  let component: FnfPayslipComponent;
  let fixture: ComponentFixture<FnfPayslipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FnfPayslipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FnfPayslipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
