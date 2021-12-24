import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgLocationsComponent } from './org-locations.component';

describe('OrgLocationsComponent', () => {
  let component: OrgLocationsComponent;
  let fixture: ComponentFixture<OrgLocationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgLocationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
