import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseReportRightPanesComponent } from './expense-report-right-panes.component';

describe('ExpenseReportRightPanesComponent', () => {
  let component: ExpenseReportRightPanesComponent;
  let fixture: ComponentFixture<ExpenseReportRightPanesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseReportRightPanesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseReportRightPanesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
