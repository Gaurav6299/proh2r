import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollSettingComponent } from './payroll-setting.component';

describe('PayrollSettingComponent', () => {
  let component: PayrollSettingComponent;
  let fixture: ComponentFixture<PayrollSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayrollSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
