import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationAssetsComponent } from './organization-assets.component';

describe('OrganizationAssetsComponent', () => {
  let component: OrganizationAssetsComponent;
  let fixture: ComponentFixture<OrganizationAssetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationAssetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
