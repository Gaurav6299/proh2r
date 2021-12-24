import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesOnHoldComponent } from './employees-on-hold.component';

describe('EmployeesOnHoldComponent', () => {
  let component: EmployeesOnHoldComponent;
  let fixture: ComponentFixture<EmployeesOnHoldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeesOnHoldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeesOnHoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
