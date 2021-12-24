import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamAdvanceCancelledComponent } from './team-advance-cancelled.component';

describe('TeamAdvanceCancelledComponent', () => {
  let component: TeamAdvanceCancelledComponent;
  let fixture: ComponentFixture<TeamAdvanceCancelledComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamAdvanceCancelledComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamAdvanceCancelledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
