import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftRightResignationSettingsComponent } from './left-right-resignation-settings.component';

describe('LeftRightResignationSettingsComponent', () => {
  let component: LeftRightResignationSettingsComponent;
  let fixture: ComponentFixture<LeftRightResignationSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftRightResignationSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftRightResignationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
