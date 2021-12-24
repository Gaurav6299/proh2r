import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceTemplatesComponent } from './advance-templates.component';

describe('AdvanceTemplatesComponent', () => {
  let component: AdvanceTemplatesComponent;
  let fixture: ComponentFixture<AdvanceTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
