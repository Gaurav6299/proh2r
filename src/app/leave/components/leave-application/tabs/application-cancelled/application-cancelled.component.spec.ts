import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationCancelledComponent } from './application-cancelled.component';

describe('ApplicationCancelledComponent', () => {
  let component: ApplicationCancelledComponent;
  let fixture: ComponentFixture<ApplicationCancelledComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationCancelledComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationCancelledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
