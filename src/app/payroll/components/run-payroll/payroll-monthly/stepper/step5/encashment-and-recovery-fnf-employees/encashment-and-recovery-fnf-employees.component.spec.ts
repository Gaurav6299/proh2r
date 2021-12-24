import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncashmentAndRecoveryFnfEmployeesComponent } from './encashment-and-recovery-fnf-employees.component';

describe('EncashmentAndRecoveryFnfEmployeesComponent', () => {
  let component: EncashmentAndRecoveryFnfEmployeesComponent;
  let fixture: ComponentFixture<EncashmentAndRecoveryFnfEmployeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncashmentAndRecoveryFnfEmployeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncashmentAndRecoveryFnfEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
