import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicExpenseCategoryComponent } from './dynamic-expense-category.component';

describe('DynamicExpenseCategoryComponent', () => {
  let component: DynamicExpenseCategoryComponent;
  let fixture: ComponentFixture<DynamicExpenseCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicExpenseCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicExpenseCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
