import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResignationApplicationsComponent } from './resignation-applications.component';

describe('ResignationApplicationsComponent', () => {
  let component: ResignationApplicationsComponent;
  let fixture: ComponentFixture<ResignationApplicationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResignationApplicationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResignationApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
