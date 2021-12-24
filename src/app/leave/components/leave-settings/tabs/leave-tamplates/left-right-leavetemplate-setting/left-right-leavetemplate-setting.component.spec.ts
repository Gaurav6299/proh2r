import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftRightLeavetemplateSettingComponent } from './left-right-leavetemplate-setting.component';

describe('LeftRightLeavetemplateSettingComponent', () => {
  let component: LeftRightLeavetemplateSettingComponent;
  let fixture: ComponentFixture<LeftRightLeavetemplateSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftRightLeavetemplateSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftRightLeavetemplateSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
