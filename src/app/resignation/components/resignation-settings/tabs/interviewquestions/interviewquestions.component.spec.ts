import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewquestionsComponent } from './interviewquestions.component';

describe('InterviewquestionsComponent', () => {
  let component: InterviewquestionsComponent;
  let fixture: ComponentFixture<InterviewquestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterviewquestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewquestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
