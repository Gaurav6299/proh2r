import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceTemplateAssignmentComponent } from './advance-template-assignment.component';

describe('AdvanceTemplateAssignmentComponent', () => {
  let component: AdvanceTemplateAssignmentComponent;
  let fixture: ComponentFixture<AdvanceTemplateAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceTemplateAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceTemplateAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
