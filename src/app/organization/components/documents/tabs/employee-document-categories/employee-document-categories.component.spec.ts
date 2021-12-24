import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDocumentCategoriesComponent } from './employee-document-categories.component';

describe('EmployeeDocumentCategoriesComponent', () => {
  let component: EmployeeDocumentCategoriesComponent;
  let fixture: ComponentFixture<EmployeeDocumentCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeDocumentCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeDocumentCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
