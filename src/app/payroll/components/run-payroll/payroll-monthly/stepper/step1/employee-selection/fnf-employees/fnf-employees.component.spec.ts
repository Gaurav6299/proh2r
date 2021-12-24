import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FnfEmployeesComponent } from './fnf-employees.component';

describe('FnfEmployeesComponent', () => {
  let component: FnfEmployeesComponent;
  let fixture: ComponentFixture<FnfEmployeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FnfEmployeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FnfEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
