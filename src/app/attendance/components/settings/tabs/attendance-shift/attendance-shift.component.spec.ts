import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceShiftComponent } from './attendance-shift.component';

describe('AttendanceShiftComponent', () => {
  let component: AttendanceShiftComponent;
  let fixture: ComponentFixture<AttendanceShiftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendanceShiftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
