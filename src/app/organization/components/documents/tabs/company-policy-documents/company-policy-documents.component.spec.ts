import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyPolicyDocumentsComponent } from './company-policy-documents.component';

describe('CompanyPolicyDocumentsComponent', () => {
  let component: CompanyPolicyDocumentsComponent;
  let fixture: ComponentFixture<CompanyPolicyDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyPolicyDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyPolicyDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
