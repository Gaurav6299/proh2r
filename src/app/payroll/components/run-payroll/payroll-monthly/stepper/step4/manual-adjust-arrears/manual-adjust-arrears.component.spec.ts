import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualAdjustArrearsComponent } from './manual-adjust-arrears.component';

describe('ManualAdjustArrearsComponent', () => {
  let component: ManualAdjustArrearsComponent;
  let fixture: ComponentFixture<ManualAdjustArrearsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualAdjustArrearsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualAdjustArrearsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
