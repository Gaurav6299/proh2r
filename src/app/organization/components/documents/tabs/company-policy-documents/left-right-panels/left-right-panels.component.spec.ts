import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftRightPanelsComponent } from './left-right-panels.component';

describe('LeftRightPanelsComponent', () => {
  let component: LeftRightPanelsComponent;
  let fixture: ComponentFixture<LeftRightPanelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftRightPanelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftRightPanelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
