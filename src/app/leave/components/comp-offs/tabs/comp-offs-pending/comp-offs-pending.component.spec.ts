import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompOffsPendingComponent } from './comp-offs-pending.component';

describe('CompOffsPendingComponent', () => {
  let component: CompOffsPendingComponent;
  let fixture: ComponentFixture<CompOffsPendingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompOffsPendingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompOffsPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
