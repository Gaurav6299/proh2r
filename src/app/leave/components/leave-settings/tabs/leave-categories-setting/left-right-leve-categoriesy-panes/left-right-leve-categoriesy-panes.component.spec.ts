import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftRightLeveCategoriesyPanesComponent } from './left-right-leve-categoriesy-panes.component';

describe('LeftRightLeveCategoriesyPanesComponent', () => {
  let component: LeftRightLeveCategoriesyPanesComponent;
  let fixture: ComponentFixture<LeftRightLeveCategoriesyPanesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftRightLeveCategoriesyPanesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftRightLeveCategoriesyPanesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
