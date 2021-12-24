import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxPayerTypeComponent } from './tax-payer-type.component';

describe('TaxPayerTypeComponent', () => {
  let component: TaxPayerTypeComponent;
  let fixture: ComponentFixture<TaxPayerTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxPayerTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxPayerTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
