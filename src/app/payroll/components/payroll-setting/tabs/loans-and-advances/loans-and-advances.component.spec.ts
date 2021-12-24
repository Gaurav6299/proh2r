import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoansAndAdvancesComponent } from './loans-and-advances.component';

describe('LoansAndAdvancesComponent', () => {
  let component: LoansAndAdvancesComponent;
  let fixture: ComponentFixture<LoansAndAdvancesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoansAndAdvancesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoansAndAdvancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
