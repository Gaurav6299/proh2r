import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedExpensesComponent } from './approved-expenses.component';

describe('ApprovedExpensesComponent', () => {
  let component: ApprovedExpensesComponent;
  let fixture: ComponentFixture<ApprovedExpensesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovedExpensesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovedExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
