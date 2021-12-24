import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LopReversalComponent } from './lop-reversal.component';

describe('LopReversalComponent', () => {
  let component: LopReversalComponent;
  let fixture: ComponentFixture<LopReversalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LopReversalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LopReversalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
