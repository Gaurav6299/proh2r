import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MilestoneLeftRightComponent } from './milestone-left-right.component';

describe('MilestoneLeftRightComponent', () => {
  let component: MilestoneLeftRightComponent;
  let fixture: ComponentFixture<MilestoneLeftRightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MilestoneLeftRightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MilestoneLeftRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
