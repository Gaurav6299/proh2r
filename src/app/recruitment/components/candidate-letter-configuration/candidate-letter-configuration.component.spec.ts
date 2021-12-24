import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateLetterConfigurationComponent } from './candidate-letter-configuration.component';

describe('CandidateLetterConfigurationComponent', () => {
  let component: CandidateLetterConfigurationComponent;
  let fixture: ComponentFixture<CandidateLetterConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateLetterConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateLetterConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
