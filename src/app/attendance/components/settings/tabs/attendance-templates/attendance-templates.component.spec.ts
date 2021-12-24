import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceTemplatesComponent } from './attendance-templates.component';

describe('AttendanceTemplatesComponent', () => {
  let component: AttendanceTemplatesComponent;
  let fixture: ComponentFixture<AttendanceTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendanceTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
