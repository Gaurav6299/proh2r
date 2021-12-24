import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceShiftAssignmentComponent } from './attendance-shift-assignment.component';

describe('AttendanceShiftAssignmentComponent', () => {
  let component: AttendanceShiftAssignmentComponent;
  let fixture: ComponentFixture<AttendanceShiftAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendanceShiftAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceShiftAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
