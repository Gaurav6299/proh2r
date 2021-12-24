import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationApprovedComponent } from './application-approved.component';

describe('ApplicationApprovedComponent', () => {
  let component: ApplicationApprovedComponent;
  let fixture: ComponentFixture<ApplicationApprovedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationApprovedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
