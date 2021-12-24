import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Employees80CDeductionsComponent } from './employees80-c-deductions.component';

describe('Employees80CDeductionsComponent', () => {
  let component: Employees80CDeductionsComponent;
  let fixture: ComponentFixture<Employees80CDeductionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Employees80CDeductionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Employees80CDeductionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
