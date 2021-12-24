import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompOffsApprovedComponent } from './comp-offs-approved.component';

describe('CompOffsApprovedComponent', () => {
  let component: CompOffsApprovedComponent;
  let fixture: ComponentFixture<CompOffsApprovedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompOffsApprovedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompOffsApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
