import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedRegRequestComponent } from './rejected-reg-request.component';

describe('RejectedRegRequestComponent', () => {
  let component: RejectedRegRequestComponent;
  let fixture: ComponentFixture<RejectedRegRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectedRegRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectedRegRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
