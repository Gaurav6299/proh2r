import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingOndutyRequestComponent } from './pending-onduty-request.component';

describe('PendingOndutyRequestComponent', () => {
  let component: PendingOndutyRequestComponent;
  let fixture: ComponentFixture<PendingOndutyRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingOndutyRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingOndutyRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
