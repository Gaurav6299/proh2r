import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceProcessTabComponent } from './attendance-process-tab.component';

describe('AttendanceProcessTabComponent', () => {
  let component: AttendanceProcessTabComponent;
  let fixture: ComponentFixture<AttendanceProcessTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendanceProcessTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceProcessTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
