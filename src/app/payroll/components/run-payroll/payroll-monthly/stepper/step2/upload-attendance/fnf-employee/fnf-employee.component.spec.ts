import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FnfEmployeeComponent } from './fnf-employee.component';

describe('FnfEmployeeComponent', () => {
  let component: FnfEmployeeComponent;
  let fixture: ComponentFixture<FnfEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FnfEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FnfEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
