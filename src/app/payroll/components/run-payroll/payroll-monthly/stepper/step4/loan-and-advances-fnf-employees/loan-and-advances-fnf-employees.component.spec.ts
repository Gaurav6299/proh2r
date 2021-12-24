import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanAndAdvancesFnfEmployeesComponent } from './loan-and-advances-fnf-employees.component';

describe('LoanAndAdvancesFnfEmployeesComponent', () => {
  let component: LoanAndAdvancesFnfEmployeesComponent;
  let fixture: ComponentFixture<LoanAndAdvancesFnfEmployeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanAndAdvancesFnfEmployeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanAndAdvancesFnfEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
