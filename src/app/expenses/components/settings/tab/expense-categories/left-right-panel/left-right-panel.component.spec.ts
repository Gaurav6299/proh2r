import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftRightPanelComponent } from './left-right-panel.component';

describe('LeftRightPanelComponent', () => {
  let component: LeftRightPanelComponent;
  let fixture: ComponentFixture<LeftRightPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftRightPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftRightPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
