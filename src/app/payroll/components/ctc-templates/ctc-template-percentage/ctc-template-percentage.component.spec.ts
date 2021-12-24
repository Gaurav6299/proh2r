import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCtcTemplatePercentageComponent } from './ctc-template-percentage.component';

describe('EditCtcTemplatePercentageComponent', () => {
  let component: EditCtcTemplatePercentageComponent;
  let fixture: ComponentFixture<EditCtcTemplatePercentageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCtcTemplatePercentageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCtcTemplatePercentageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
