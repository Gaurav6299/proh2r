import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BiometricLogComponent } from './biometric-log.component';

describe('BiometricLogComponent', () => {
  let component: BiometricLogComponent;
  let fixture: ComponentFixture<BiometricLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BiometricLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BiometricLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
