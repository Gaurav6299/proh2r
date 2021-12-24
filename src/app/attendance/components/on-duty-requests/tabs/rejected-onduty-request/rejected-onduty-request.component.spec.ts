import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedOndutyRequestComponent } from './rejected-onduty-request.component';

describe('RejectedOndutyRequestComponent', () => {
  let component: RejectedOndutyRequestComponent;
  let fixture: ComponentFixture<RejectedOndutyRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectedOndutyRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectedOndutyRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
