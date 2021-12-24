import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TDSConfigurationComponent } from './tds-configuration.component';

describe('TDSConfigurationComponent', () => {
  let component: TDSConfigurationComponent;
  let fixture: ComponentFixture<TDSConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TDSConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TDSConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
