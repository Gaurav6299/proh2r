import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedDeductionContentComponent } from './fixed-deduction-content.component';

describe('FixedDeductionContentComponent', () => {
  let component: FixedDeductionContentComponent;
  let fixture: ComponentFixture<FixedDeductionContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedDeductionContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedDeductionContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
