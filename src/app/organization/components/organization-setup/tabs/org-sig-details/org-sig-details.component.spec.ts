import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgSigDetailsComponent } from './org-sig-details.component';

describe('OrgSigDetailsComponent', () => {
  let component: OrgSigDetailsComponent;
  let fixture: ComponentFixture<OrgSigDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgSigDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgSigDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
