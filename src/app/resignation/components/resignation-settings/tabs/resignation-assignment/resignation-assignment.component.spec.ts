import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResignationAssignmentComponent } from './resignation-assignment.component';

describe('ResignationAssignmentComponent', () => {
  let component: ResignationAssignmentComponent;
  let fixture: ComponentFixture<ResignationAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResignationAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResignationAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
