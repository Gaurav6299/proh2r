import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrearsFnfEmployeeComponent } from './arrears-fnf-employee.component';

describe('ArrearsFnfEmployeeComponent', () => {
  let component: ArrearsFnfEmployeeComponent;
  let fixture: ComponentFixture<ArrearsFnfEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArrearsFnfEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrearsFnfEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
