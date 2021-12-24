import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OffcyclePayUploadVariablePaysComponent } from './offcycle-pay-upload-variable-pays.component';

describe('OffcyclePayUploadVariablePaysComponent', () => {
  let component: OffcyclePayUploadVariablePaysComponent;
  let fixture: ComponentFixture<OffcyclePayUploadVariablePaysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffcyclePayUploadVariablePaysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffcyclePayUploadVariablePaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
