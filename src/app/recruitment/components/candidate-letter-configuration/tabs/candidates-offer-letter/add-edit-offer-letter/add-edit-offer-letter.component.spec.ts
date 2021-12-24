import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditOfferLetterComponent } from './add-edit-offer-letter.component';

describe('AddEditOfferLetterComponent', () => {
  let component: AddEditOfferLetterComponent;
  let fixture: ComponentFixture<AddEditOfferLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditOfferLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditOfferLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
