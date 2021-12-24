import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratedLettersComponent } from './generated-letters.component';

describe('GeneratedLettersComponent', () => {
  let component: GeneratedLettersComponent;
  let fixture: ComponentFixture<GeneratedLettersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneratedLettersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneratedLettersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
