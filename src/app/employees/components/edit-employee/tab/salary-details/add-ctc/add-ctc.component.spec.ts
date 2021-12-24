import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCtcComponent } from './add-ctc.component';

describe('AddCtcComponent', () => {
  let component: AddCtcComponent;
  let fixture: ComponentFixture<AddCtcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCtcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCtcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
