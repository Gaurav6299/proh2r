import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishPaySlipComponent } from './publish-pay-slip.component';

describe('PublishPaySlipComponent', () => {
  let component: PublishPaySlipComponent;
  let fixture: ComponentFixture<PublishPaySlipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishPaySlipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishPaySlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
