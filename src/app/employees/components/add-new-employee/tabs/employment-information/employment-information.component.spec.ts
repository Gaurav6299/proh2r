import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmploymentInformationComponent } from './employment-information.component';

describe('EmploymentInformationComponent', () => {
  let component: EmploymentInformationComponent;
  let fixture: ComponentFixture<EmploymentInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmploymentInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmploymentInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
