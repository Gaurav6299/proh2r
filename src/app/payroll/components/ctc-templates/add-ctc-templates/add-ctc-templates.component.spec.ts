import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCtcTemplatesComponent } from './add-ctc-templates.component';

describe('AddCtcTemplatesComponent', () => {
  let component: AddCtcTemplatesComponent;
  let fixture: ComponentFixture<AddCtcTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCtcTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCtcTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
