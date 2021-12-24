import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSettingComponent } from './report-setting.component';

describe('ReportSettingComponent', () => {
  let component: ReportSettingComponent;
  let fixture: ComponentFixture<ReportSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
