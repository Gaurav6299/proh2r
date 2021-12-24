import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedAndVariableAllowanceComponent } from './fixed-and-variable-allowance.component';

describe('FixedAndVariableAllowanceComponent', () => {
  let component: FixedAndVariableAllowanceComponent;
  let fixture: ComponentFixture<FixedAndVariableAllowanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedAndVariableAllowanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedAndVariableAllowanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
