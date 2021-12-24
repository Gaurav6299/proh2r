import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAllowanceComponent } from './add-edit-allowance.component';

describe('AddEditAllowanceComponent', () => {
  let component: AddEditAllowanceComponent;
  let fixture: ComponentFixture<AddEditAllowanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditAllowanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditAllowanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
