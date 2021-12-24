import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompOffsRejectedComponent } from './comp-offs-rejected.component';

describe('CompOffsRejectedComponent', () => {
  let component: CompOffsRejectedComponent;
  let fixture: ComponentFixture<CompOffsRejectedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompOffsRejectedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompOffsRejectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
