import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedExpensesComponent } from './rejected-expenses.component';

describe('RejectedExpensesComponent', () => {
  let component: RejectedExpensesComponent;
  let fixture: ComponentFixture<RejectedExpensesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectedExpensesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectedExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
