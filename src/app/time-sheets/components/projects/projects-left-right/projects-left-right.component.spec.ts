import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsLeftRightComponent } from './projects-left-right.component';

describe('ProjectsLeftRightComponent', () => {
  let component: ProjectsLeftRightComponent;
  let fixture: ComponentFixture<ProjectsLeftRightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectsLeftRightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsLeftRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
