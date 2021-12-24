import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftRightPanesComponent } from './left-right-panes.component';

describe('LeftRightPanesComponent', () => {
  let component: LeftRightPanesComponent;
  let fixture: ComponentFixture<LeftRightPanesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftRightPanesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftRightPanesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
