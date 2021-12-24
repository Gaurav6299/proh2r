import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OffcyclePaymentFlexiBenifitsComponent } from './offcycle-payment-flexi-benifits.component';

describe('OffcyclePaymentFlexiBenifitsComponent', () => {
  let component: OffcyclePaymentFlexiBenifitsComponent;
  let fixture: ComponentFixture<OffcyclePaymentFlexiBenifitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffcyclePaymentFlexiBenifitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffcyclePaymentFlexiBenifitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
