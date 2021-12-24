import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallanBatchComponent } from './challan-batch.component';

describe('ChallanBatchComponent', () => {
  let component: ChallanBatchComponent;
  let fixture: ComponentFixture<ChallanBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChallanBatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallanBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
