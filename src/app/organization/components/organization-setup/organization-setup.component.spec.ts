import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationSetupComponent } from './organization-setup.component';

describe('OrganizationSetupComponent', () => {
  let component: OrganizationSetupComponent;
  let fixture: ComponentFixture<OrganizationSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
