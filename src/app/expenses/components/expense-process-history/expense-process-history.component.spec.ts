import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseProcessHistoryComponent } from './expense-process-history.component';

describe('ExpenseProcessHistoryComponent', () => {
  let component: ExpenseProcessHistoryComponent;
  let fixture: ComponentFixture<ExpenseProcessHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseProcessHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseProcessHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
