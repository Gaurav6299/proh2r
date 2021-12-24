import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessOffcyclePaymentsComponent } from './process-offcycle-payments.component';

describe('ProcessOffcyclePaymentsComponent', () => {
  let component: ProcessOffcyclePaymentsComponent;
  let fixture: ComponentFixture<ProcessOffcyclePaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessOffcyclePaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessOffcyclePaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
