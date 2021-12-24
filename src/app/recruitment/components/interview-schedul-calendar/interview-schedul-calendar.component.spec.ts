import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewSchedulCalendarComponent } from './interview-schedul-calendar.component';

describe('InterviewSchedulCalendarComponent', () => {
  let component: InterviewSchedulCalendarComponent;
  let fixture: ComponentFixture<InterviewSchedulCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterviewSchedulCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewSchedulCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
