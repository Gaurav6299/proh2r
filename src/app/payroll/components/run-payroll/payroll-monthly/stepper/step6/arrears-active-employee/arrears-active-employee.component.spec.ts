import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrearsActiveEmployeeComponent } from './arrears-active-employee.component';

describe('ArrearsActiveEmployeeComponent', () => {
  let component: ArrearsActiveEmployeeComponent;
  let fixture: ComponentFixture<ArrearsActiveEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArrearsActiveEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrearsActiveEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
