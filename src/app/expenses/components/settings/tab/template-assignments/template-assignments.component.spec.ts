import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateAssignmentsComponent } from './template-assignments.component';

describe('TemplateAssignmentsComponent', () => {
  let component: TemplateAssignmentsComponent;
  let fixture: ComponentFixture<TemplateAssignmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateAssignmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateAssignmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
