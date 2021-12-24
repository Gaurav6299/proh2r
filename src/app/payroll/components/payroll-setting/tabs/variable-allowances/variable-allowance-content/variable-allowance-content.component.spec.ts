import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VariableAllowanceContentComponent } from './variable-allowance-content.component';

describe('VariableAllowanceContentComponent', () => {
  let component: VariableAllowanceContentComponent;
  let fixture: ComponentFixture<VariableAllowanceContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VariableAllowanceContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariableAllowanceContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
