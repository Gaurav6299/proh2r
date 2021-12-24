import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelledOndutyRequestComponent } from './cancelled-onduty-request.component';

describe('CancelledOndutyRequestComponent', () => {
  let component: CancelledOndutyRequestComponent;
  let fixture: ComponentFixture<CancelledOndutyRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelledOndutyRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelledOndutyRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
