import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseTemplateAssignmentComponent } from './expense-template-assignment.component';

describe('ExpenseTemplateAssignmentComponent', () => {
  let component: ExpenseTemplateAssignmentComponent;
  let fixture: ComponentFixture<ExpenseTemplateAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseTemplateAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseTemplateAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
