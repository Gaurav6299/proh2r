import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OndutyAttendanceTemplateComponent } from './onduty-attendance-template.component';

describe('OndutyAttendanceTemplateComponent', () => {
  let component: OndutyAttendanceTemplateComponent;
  let fixture: ComponentFixture<OndutyAttendanceTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OndutyAttendanceTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OndutyAttendanceTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
