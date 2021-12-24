import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityFeedTrackerComponent } from './activity-feed-tracker.component';

describe('ActivityFeedTrackerComponent', () => {
  let component: ActivityFeedTrackerComponent;
  let fixture: ComponentFixture<ActivityFeedTrackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityFeedTrackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityFeedTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
