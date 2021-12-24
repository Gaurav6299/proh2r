import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveTamplatesComponent } from './leave-tamplates.component';

describe('LeaveTamplatesComponent', () => {
  let component: LeaveTamplatesComponent;
  let fixture: ComponentFixture<LeaveTamplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveTamplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveTamplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
