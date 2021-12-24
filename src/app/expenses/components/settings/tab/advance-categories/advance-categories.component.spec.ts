import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceCategoriesComponent } from './advance-categories.component';

describe('AdvanceCategoriesComponent', () => {
  let component: AdvanceCategoriesComponent;
  let fixture: ComponentFixture<AdvanceCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
