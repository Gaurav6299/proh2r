import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingExpensesComponent } from './pending-expenses.component';

describe('PendingExpensesComponent', () => {
  let component: PendingExpensesComponent;
  let fixture: ComponentFixture<PendingExpensesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingExpensesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
