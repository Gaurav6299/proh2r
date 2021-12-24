import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftRightPaneComponent } from './left-right-pane.component';

describe('LeftRightPanelComponent', () => {
  let component: LeftRightPaneComponent;
  let fixture: ComponentFixture<LeftRightPaneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftRightPaneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftRightPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
