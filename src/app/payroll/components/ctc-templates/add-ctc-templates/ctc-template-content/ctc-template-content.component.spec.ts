import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CtcTemplateContentComponent } from './ctc-template-content.component';

describe('CtcTemplateContentComponent', () => {
  let component: CtcTemplateContentComponent;
  let fixture: ComponentFixture<CtcTemplateContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CtcTemplateContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CtcTemplateContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
