import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupIssuesComponent } from './setup-issues.component';

describe('SetupIssuesComponent', () => {
  let component: SetupIssuesComponent;
  let fixture: ComponentFixture<SetupIssuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupIssuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
