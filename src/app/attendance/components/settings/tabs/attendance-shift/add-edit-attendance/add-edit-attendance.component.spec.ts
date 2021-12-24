import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAttendanceComponent } from './add-edit-attendance.component';

describe('AddEditAttendanceComponent', () => {
  let component: AddEditAttendanceComponent;
  let fixture: ComponentFixture<AddEditAttendanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditAttendanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
