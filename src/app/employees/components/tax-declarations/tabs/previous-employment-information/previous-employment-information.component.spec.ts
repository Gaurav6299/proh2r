import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousEmploymentInformationComponent } from './previous-employment-information.component';

describe('PreviousEmploymentInformationComponent', () => {
  let component: PreviousEmploymentInformationComponent;
  let fixture: ComponentFixture<PreviousEmploymentInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviousEmploymentInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousEmploymentInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
