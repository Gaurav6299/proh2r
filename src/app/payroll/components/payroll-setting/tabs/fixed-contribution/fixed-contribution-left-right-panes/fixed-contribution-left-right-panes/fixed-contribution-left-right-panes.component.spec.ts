import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedContributionLeftRightPanesComponent } from './fixed-contribution-left-right-panes.component';

describe('FixedContributionLeftRightPanesComponent', () => {
  let component: FixedContributionLeftRightPanesComponent;
  let fixture: ComponentFixture<FixedContributionLeftRightPanesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedContributionLeftRightPanesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedContributionLeftRightPanesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
