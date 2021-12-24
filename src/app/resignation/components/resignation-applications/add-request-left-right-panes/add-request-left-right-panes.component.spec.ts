import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRequestLeftRightPanesComponent } from './add-request-left-right-panes.component';

describe('AddRequestLeftRightPanesComponent', () => {
  let component: AddRequestLeftRightPanesComponent;
  let fixture: ComponentFixture<AddRequestLeftRightPanesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRequestLeftRightPanesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRequestLeftRightPanesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
