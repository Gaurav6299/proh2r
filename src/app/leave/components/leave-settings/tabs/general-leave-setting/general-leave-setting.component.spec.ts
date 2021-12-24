import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralLeaveSettingComponent } from './general-leave-setting.component';

describe('GeneralLeaveSettingComponent', () => {
  let component: GeneralLeaveSettingComponent;
  let fixture: ComponentFixture<GeneralLeaveSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralLeaveSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralLeaveSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
