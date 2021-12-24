import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelledRegRequestComponent } from './cancelled-reg-request.component';

describe('CancelledRegRequestComponent', () => {
  let component: CancelledRegRequestComponent;
  let fixture: ComponentFixture<CancelledRegRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelledRegRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelledRegRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
