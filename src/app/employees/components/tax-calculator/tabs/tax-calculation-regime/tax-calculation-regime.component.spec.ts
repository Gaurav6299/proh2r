import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxCalculationRegimeComponent } from './tax-calculation-regime.component';

describe('TaxCalculationRegimeComponent', () => {
  let component: TaxCalculationRegimeComponent;
  let fixture: ComponentFixture<TaxCalculationRegimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxCalculationRegimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxCalculationRegimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
