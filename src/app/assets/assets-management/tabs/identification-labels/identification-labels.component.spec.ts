import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentificationLabelsComponent } from './identification-labels.component';

describe('IdentificationLabelsComponent', () => {
  let component: IdentificationLabelsComponent;
  let fixture: ComponentFixture<IdentificationLabelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdentificationLabelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentificationLabelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
