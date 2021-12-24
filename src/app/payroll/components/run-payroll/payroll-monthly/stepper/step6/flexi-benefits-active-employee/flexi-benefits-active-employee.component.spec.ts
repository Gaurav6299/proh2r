import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlexiBenefitsActiveEmployeeComponent } from './flexi-benefits-active-employee.component';

describe('FlexiBenefitsActiveEmployeeComponent', () => {
  let component: FlexiBenefitsActiveEmployeeComponent;
  let fixture: ComponentFixture<FlexiBenefitsActiveEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlexiBenefitsActiveEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlexiBenefitsActiveEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
