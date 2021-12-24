import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSheetTemplateComponent } from './time-sheet-template.component';

describe('TimeSheetTemplateComponent', () => {
  let component: TimeSheetTemplateComponent;
  let fixture: ComponentFixture<TimeSheetTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeSheetTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeSheetTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
