import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgDesignationsComponent } from './org-designations.component';

describe('OrgDesignationsComponent', () => {
  let component: OrgDesignationsComponent;
  let fixture: ComponentFixture<OrgDesignationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgDesignationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgDesignationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
