import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherIncomeInfoComponent } from './other-income-info.component';

describe('OtherIncomeInfoComponent', () => {
  let component: OtherIncomeInfoComponent;
  let fixture: ComponentFixture<OtherIncomeInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherIncomeInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherIncomeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
