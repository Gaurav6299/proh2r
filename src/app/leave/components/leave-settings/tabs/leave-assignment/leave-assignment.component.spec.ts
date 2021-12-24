import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveAssignmentComponent } from './leave-assignment.component';

describe('LeaveAssignmentComponent', () => {
  let component: LeaveAssignmentComponent;
  let fixture: ComponentFixture<LeaveAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
