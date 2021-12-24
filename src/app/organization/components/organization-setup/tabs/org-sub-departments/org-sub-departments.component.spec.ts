import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgSubDepartmentsComponent } from './org-sub-departments.component';

describe('OrgSubDepartmentsComponent', () => {
  let component: OrgSubDepartmentsComponent;
  let fixture: ComponentFixture<OrgSubDepartmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgSubDepartmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgSubDepartmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
