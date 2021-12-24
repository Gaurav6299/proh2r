import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgHolidaysComponent } from './org-holidays.component';

describe('OrgHolidaysComponent', () => {
  let component: OrgHolidaysComponent;
  let fixture: ComponentFixture<OrgHolidaysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgHolidaysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgHolidaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
