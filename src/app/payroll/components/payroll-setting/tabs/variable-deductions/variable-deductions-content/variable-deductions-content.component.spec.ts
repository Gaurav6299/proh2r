import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VariableDeductionsContentComponent } from './variable-deductions-content.component';

describe('VariableDeductionsContentComponent', () => {
  let component: VariableDeductionsContentComponent;
  let fixture: ComponentFixture<VariableDeductionsContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VariableDeductionsContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariableDeductionsContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
