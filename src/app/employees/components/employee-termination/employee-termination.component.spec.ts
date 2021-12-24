import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTerminationComponent } from './employee-termination.component';

describe('EmployeeTerminationComponent', () => {
  let component: EmployeeTerminationComponent;
  let fixture: ComponentFixture<EmployeeTerminationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeTerminationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeTerminationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
