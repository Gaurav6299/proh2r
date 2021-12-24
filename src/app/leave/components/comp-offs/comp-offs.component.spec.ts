import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompOffsComponent } from './comp-offs.component';

describe('CompOffsComponent', () => {
  let component: CompOffsComponent;
  let fixture: ComponentFixture<CompOffsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompOffsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompOffsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
