import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedOndutyRequestComponent } from './approved-onduty-request.component';

describe('ApprovedOndutyRequestComponent', () => {
  let component: ApprovedOndutyRequestComponent;
  let fixture: ComponentFixture<ApprovedOndutyRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovedOndutyRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovedOndutyRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
