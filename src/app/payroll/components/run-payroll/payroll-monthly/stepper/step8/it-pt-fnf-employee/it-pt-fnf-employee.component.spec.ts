import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItPtFnfEmployeeComponent } from './it-pt-fnf-employee.component';

describe('ItPtFnfEmployeeComponent', () => {
  let component: ItPtFnfEmployeeComponent;
  let fixture: ComponentFixture<ItPtFnfEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItPtFnfEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItPtFnfEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
