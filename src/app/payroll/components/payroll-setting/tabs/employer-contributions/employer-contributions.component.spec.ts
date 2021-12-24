import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerContributionsComponent } from './employer-contributions.component';

describe('EmployerContributionsComponent', () => {
  let component: EmployerContributionsComponent;
  let fixture: ComponentFixture<EmployerContributionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployerContributionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployerContributionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
