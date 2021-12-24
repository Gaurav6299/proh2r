import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItPtActiveEmployeeComponent } from './it-pt-active-employee.component';

describe('ItPtActiveEmployeeComponent', () => {
  let component: ItPtActiveEmployeeComponent;
  let fixture: ComponentFixture<ItPtActiveEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItPtActiveEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItPtActiveEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
