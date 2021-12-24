import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChapterViDeductionsComponent } from './chapter-vi-deductions.component';

describe('ChapterViDeductionsComponent', () => {
  let component: ChapterViDeductionsComponent;
  let fixture: ComponentFixture<ChapterViDeductionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChapterViDeductionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChapterViDeductionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
