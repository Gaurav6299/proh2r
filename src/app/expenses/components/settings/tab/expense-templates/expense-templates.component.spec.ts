import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseTemplatesComponent } from './expense-templates.component';

describe('ExpenseTemplatesComponent', () => {
  let component: ExpenseTemplatesComponent;
  let fixture: ComponentFixture<ExpenseTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
