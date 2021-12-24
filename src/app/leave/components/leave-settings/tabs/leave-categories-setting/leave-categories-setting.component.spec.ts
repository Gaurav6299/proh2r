import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveCategoriesSettingComponent } from './leave-categories-setting.component';

describe('LeaveCategoriesSettingComponent', () => {
  let component: LeaveCategoriesSettingComponent;
  let fixture: ComponentFixture<LeaveCategoriesSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveCategoriesSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveCategoriesSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
