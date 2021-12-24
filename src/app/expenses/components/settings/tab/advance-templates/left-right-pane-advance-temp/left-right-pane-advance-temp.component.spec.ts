import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftRightPaneAdvanceTempComponent } from './left-right-pane-advance-temp.component';

describe('LeftRightPaneAdvanceTempComponent', () => {
  let component: LeftRightPaneAdvanceTempComponent;
  let fixture: ComponentFixture<LeftRightPaneAdvanceTempComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftRightPaneAdvanceTempComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftRightPaneAdvanceTempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
