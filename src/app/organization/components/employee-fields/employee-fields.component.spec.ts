import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeFieldsComponent } from './employee-fields.component';

describe('EmployeeFieldsComponent', () => {
  let component: EmployeeFieldsComponent;
  let fixture: ComponentFixture<EmployeeFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeFieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
