import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunPayrollCompleteComponent } from './run-payroll-complete.component';

describe('RunPayrollCompleteComponent', () => {
  let component: RunPayrollCompleteComponent;
  let fixture: ComponentFixture<RunPayrollCompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunPayrollCompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunPayrollCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
