import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgBankInfoComponent } from './org-bank-info.component';

describe('OrgBankInfoComponent', () => {
  let component: OrgBankInfoComponent;
  let fixture: ComponentFixture<OrgBankInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgBankInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgBankInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
