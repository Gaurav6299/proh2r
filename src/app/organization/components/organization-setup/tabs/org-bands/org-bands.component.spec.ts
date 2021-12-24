import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgBandsComponent } from './org-bands.component';

describe('OrgBandsComponent', () => {
  let component: OrgBandsComponent;
  let fixture: ComponentFixture<OrgBandsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgBandsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgBandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
