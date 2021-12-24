import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatesOfferLetterComponent } from './candidates-offer-letter.component';

describe('CandidatesOfferLetterComponent', () => {
  let component: CandidatesOfferLetterComponent;
  let fixture: ComponentFixture<CandidatesOfferLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidatesOfferLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidatesOfferLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
