import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OndutyAttendanceTemplateAssignmentComponent } from './onduty-attendance-template-assignment.component';

describe('OndutyAttendanceTemplateAssignmentComponent', () => {
  let component: OndutyAttendanceTemplateAssignmentComponent;
  let fixture: ComponentFixture<OndutyAttendanceTemplateAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OndutyAttendanceTemplateAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OndutyAttendanceTemplateAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
