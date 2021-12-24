import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditFieldsComponent } from './add-edit-fields.component';

describe('AddEditFieldsComponent', () => {
  let component: AddEditFieldsComponent;
  let fixture: ComponentFixture<AddEditFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditFieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
