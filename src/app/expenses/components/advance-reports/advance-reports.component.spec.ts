import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceReportsComponent } from './advance-reports.component';

describe('AdvanceReportsComponent', () => {
  let component: AdvanceReportsComponent;
  let fixture: ComponentFixture<AdvanceReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
