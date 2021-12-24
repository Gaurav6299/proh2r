import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceRecordsPanesComponent } from './attendance-records-panes.component';

describe('AttendanceRecordsPanesComponent', () => {
  let component: AttendanceRecordsPanesComponent;
  let fixture: ComponentFixture<AttendanceRecordsPanesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendanceRecordsPanesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceRecordsPanesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
