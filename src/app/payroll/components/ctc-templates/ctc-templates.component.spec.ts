import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CtcTemplatesComponent } from './ctc-templates.component';

describe('CtcTemplatesComponent', () => {
  let component: CtcTemplatesComponent;
  let fixture: ComponentFixture<CtcTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CtcTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CtcTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
