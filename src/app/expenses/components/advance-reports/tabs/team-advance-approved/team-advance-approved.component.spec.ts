import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamAdvanceApprovedComponent } from './team-advance-approved.component';

describe('TeamAdvanceApprovedComponent', () => {
  let component: TeamAdvanceApprovedComponent;
  let fixture: ComponentFixture<TeamAdvanceApprovedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamAdvanceApprovedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamAdvanceApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
