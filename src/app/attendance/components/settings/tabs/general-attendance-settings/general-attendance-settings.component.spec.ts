import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralAttendanceSettingsComponent } from './general-attendance-settings.component';

describe('GeneralAttendanceSettingsComponent', () => {
  let component: GeneralAttendanceSettingsComponent;
  let fixture: ComponentFixture<GeneralAttendanceSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralAttendanceSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralAttendanceSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
