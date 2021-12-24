import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlexiBenefitsFnfEmployeeComponent } from './flexi-benefits-fnf-employee.component';

describe('FlexiBenefitsFnfEmployeeComponent', () => {
  let component: FlexiBenefitsFnfEmployeeComponent;
  let fixture: ComponentFixture<FlexiBenefitsFnfEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlexiBenefitsFnfEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlexiBenefitsFnfEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
