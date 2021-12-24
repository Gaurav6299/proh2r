import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryInformationComponent } from './salary-information.component';

describe('SalaryInformationComponent', () => {
  let component: SalaryInformationComponent;
  let fixture: ComponentFixture<SalaryInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalaryInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
