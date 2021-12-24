import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTreeComponent } from './employee-tree.component';

describe('EmployeeTreeComponent', () => {
  let component: EmployeeTreeComponent;
  let fixture: ComponentFixture<EmployeeTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
