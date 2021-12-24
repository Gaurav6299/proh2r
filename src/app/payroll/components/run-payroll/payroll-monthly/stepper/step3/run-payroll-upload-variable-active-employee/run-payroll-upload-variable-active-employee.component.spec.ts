import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunPayrollUploadVariableActiveEmployeeComponent } from './run-payroll-upload-variable-active-employee.component';

describe('RunPayrollUploadVariableActiveEmployeeComponent', () => {
  let component: RunPayrollUploadVariableActiveEmployeeComponent;
  let fixture: ComponentFixture<RunPayrollUploadVariableActiveEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunPayrollUploadVariableActiveEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunPayrollUploadVariableActiveEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
