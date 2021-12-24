import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicLeaveCategoriesComponent } from './dynamic-leave-categories.component';

describe('DynamicLeaveCategoriesComponent', () => {
  let component: DynamicLeaveCategoriesComponent;
  let fixture: ComponentFixture<DynamicLeaveCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicLeaveCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicLeaveCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
