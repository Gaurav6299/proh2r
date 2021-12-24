import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessedEmployeesComponent } from './processed-employees.component';

describe('ProcessedEmployeesComponent', () => {
  let component: ProcessedEmployeesComponent;
  let fixture: ComponentFixture<ProcessedEmployeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessedEmployeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessedEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
