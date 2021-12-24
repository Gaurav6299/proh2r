import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceAuditComponent } from './attendance-audit.component';

describe('AttendanceAuditComponent', () => {
  let component: AttendanceAuditComponent;
  let fixture: ComponentFixture<AttendanceAuditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendanceAuditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
