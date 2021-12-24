import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectExemptionComponent } from './direct-exemption.component';

describe('DirectExemptionComponent', () => {
  let component: DirectExemptionComponent;
  let fixture: ComponentFixture<DirectExemptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectExemptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectExemptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
