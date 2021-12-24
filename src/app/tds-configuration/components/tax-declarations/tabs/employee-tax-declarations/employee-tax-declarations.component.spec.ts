import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTaxDeclarationsComponent } from './employee-tax-declarations.component';

describe('EmployeeTaxDeclarationsComponent', () => {
  let component: EmployeeTaxDeclarationsComponent;
  let fixture: ComponentFixture<EmployeeTaxDeclarationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeTaxDeclarationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeTaxDeclarationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
