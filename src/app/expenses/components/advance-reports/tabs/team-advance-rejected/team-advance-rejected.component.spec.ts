import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamAdvanceRejectedComponent } from './team-advance-rejected.component';

describe('TeamAdvanceRejectedComponent', () => {
  let component: TeamAdvanceRejectedComponent;
  let fixture: ComponentFixture<TeamAdvanceRejectedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamAdvanceRejectedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamAdvanceRejectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
