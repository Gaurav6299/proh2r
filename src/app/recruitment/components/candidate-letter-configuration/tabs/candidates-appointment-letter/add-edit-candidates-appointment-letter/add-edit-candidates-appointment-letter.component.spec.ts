import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCandidatesAppointmentLetterComponent } from './add-edit-candidates-appointment-letter.component';

describe('AddEditCandidatesAppointmentLetterComponent', () => {
  let component: AddEditCandidatesAppointmentLetterComponent;
  let fixture: ComponentFixture<AddEditCandidatesAppointmentLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditCandidatesAppointmentLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditCandidatesAppointmentLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
