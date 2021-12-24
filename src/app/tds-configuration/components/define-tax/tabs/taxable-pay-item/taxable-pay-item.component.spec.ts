import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxablePayItemComponent } from './taxable-pay-item.component';

describe('TaxablePayItemComponent', () => {
  let component: TaxablePayItemComponent;
  let fixture: ComponentFixture<TaxablePayItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxablePayItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxablePayItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
