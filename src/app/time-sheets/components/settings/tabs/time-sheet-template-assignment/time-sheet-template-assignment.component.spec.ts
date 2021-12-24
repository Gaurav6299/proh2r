import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSheetTemplateAssignmentComponent } from './time-sheet-template-assignment.component';

describe('TimeSheetTemplateAssignmentComponent', () => {
  let component: TimeSheetTemplateAssignmentComponent;
  let fixture: ComponentFixture<TimeSheetTemplateAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeSheetTemplateAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeSheetTemplateAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
