import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatesAppointmentLetterComponent } from './candidates-appointment-letter.component';

describe('CandidatesAppointmentLetterComponent', () => {
  let component: CandidatesAppointmentLetterComponent;
  let fixture: ComponentFixture<CandidatesAppointmentLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidatesAppointmentLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidatesAppointmentLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
