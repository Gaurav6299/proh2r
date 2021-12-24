import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndirectExemptionComponent } from './indirect-exemption.component';

describe('IndirectExemptionComponent', () => {
  let component: IndirectExemptionComponent;
  let fixture: ComponentFixture<IndirectExemptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndirectExemptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndirectExemptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
