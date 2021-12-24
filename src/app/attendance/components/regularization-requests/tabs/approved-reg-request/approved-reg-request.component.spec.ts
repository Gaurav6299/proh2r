import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedRegRequestComponent } from './approved-reg-request.component';

describe('ApprovedRegRequestComponent', () => {
  let component: ApprovedRegRequestComponent;
  let fixture: ComponentFixture<ApprovedRegRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovedRegRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovedRegRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
