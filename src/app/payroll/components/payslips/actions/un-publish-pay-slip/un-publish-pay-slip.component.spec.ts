import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnPublishPaySlipComponent } from './un-publish-pay-slip.component';

describe('UnPublishPaySlipComponent', () => {
  let component: UnPublishPaySlipComponent;
  let fixture: ComponentFixture<UnPublishPaySlipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnPublishPaySlipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnPublishPaySlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
