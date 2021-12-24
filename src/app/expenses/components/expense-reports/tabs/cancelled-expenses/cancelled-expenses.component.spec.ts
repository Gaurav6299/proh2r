import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelledExpensesComponent } from './cancelled-expenses.component';

describe('CancelledExpensesComponent', () => {
  let component: CancelledExpensesComponent;
  let fixture: ComponentFixture<CancelledExpensesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelledExpensesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelledExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
