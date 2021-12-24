import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFieldsComponent } from './add-fields.component';

describe('AddFieldsComponent', () => {
  let component: AddFieldsComponent;
  let fixture: ComponentFixture<AddFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
