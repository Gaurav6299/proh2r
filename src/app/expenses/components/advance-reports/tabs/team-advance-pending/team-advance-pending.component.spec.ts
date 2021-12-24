import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamAdvancePendingComponent } from './team-advance-pending.component';

describe('TeamAdvancePendingComponent', () => {
  let component: TeamAdvancePendingComponent;
  let fixture: ComponentFixture<TeamAdvancePendingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamAdvancePendingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamAdvancePendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
