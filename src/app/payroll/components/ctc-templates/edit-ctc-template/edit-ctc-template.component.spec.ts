import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCtcTemplateComponent } from './edit-ctc-template.component';

describe('EditCtcTemplateComponent', () => {
  let component: EditCtcTemplateComponent;
  let fixture: ComponentFixture<EditCtcTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCtcTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCtcTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
