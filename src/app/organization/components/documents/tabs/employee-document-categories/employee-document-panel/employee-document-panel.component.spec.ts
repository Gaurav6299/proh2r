import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDocumentPanelComponent } from './employee-document-panel.component';

describe('EmployeeDocumentPanelComponent', () => {
  let component: EmployeeDocumentPanelComponent;
  let fixture: ComponentFixture<EmployeeDocumentPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeDocumentPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeDocumentPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
