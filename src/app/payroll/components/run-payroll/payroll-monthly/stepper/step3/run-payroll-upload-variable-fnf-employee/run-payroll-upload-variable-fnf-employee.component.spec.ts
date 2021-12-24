import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunPayrollUploadVariableFnfEmployeeComponent } from './run-payroll-upload-variable-fnf-employee.component';

describe('RunPayrollUploadVariableFnfEmployeeComponent', () => {
  let component: RunPayrollUploadVariableFnfEmployeeComponent;
  let fixture: ComponentFixture<RunPayrollUploadVariableFnfEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunPayrollUploadVariableFnfEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunPayrollUploadVariableFnfEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
