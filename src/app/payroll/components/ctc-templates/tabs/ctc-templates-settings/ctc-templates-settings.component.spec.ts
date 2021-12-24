import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CtcTemplatesSettingsComponent } from './ctc-templates-settings.component';

describe('CtcTemplatesSettingsComponent', () => {
  let component: CtcTemplatesSettingsComponent;
  let fixture: ComponentFixture<CtcTemplatesSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CtcTemplatesSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CtcTemplatesSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
