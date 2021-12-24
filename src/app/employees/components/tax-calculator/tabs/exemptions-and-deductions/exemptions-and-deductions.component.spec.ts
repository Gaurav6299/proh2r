import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExemptionsAndDeductionsComponent } from './exemptions-and-deductions.component';

describe('ExemptionsAndDeductionsComponent', () => {
  let component: ExemptionsAndDeductionsComponent;
  let fixture: ComponentFixture<ExemptionsAndDeductionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExemptionsAndDeductionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExemptionsAndDeductionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
