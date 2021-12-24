import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationPendingComponent } from './application-pending.component';

describe('ApplicationPendingComponent', () => {
  let component: ApplicationPendingComponent;
  let fixture: ComponentFixture<ApplicationPendingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationPendingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
