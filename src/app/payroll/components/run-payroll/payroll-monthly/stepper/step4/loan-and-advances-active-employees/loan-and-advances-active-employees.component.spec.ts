import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanAndAdvancesActiveEmployeesComponent } from './loan-and-advances-active-employees.component';

describe('LoanAndAdvancesActiveEmployeesComponent', () => {
  let component: LoanAndAdvancesActiveEmployeesComponent;
  let fixture: ComponentFixture<LoanAndAdvancesActiveEmployeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanAndAdvancesActiveEmployeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanAndAdvancesActiveEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
