import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedPayslipComponent } from './detailed-payslip.component';

describe('DetailedPayslipComponent', () => {
  let component: DetailedPayslipComponent;
  let fixture: ComponentFixture<DetailedPayslipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedPayslipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedPayslipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
