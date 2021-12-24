import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingRegRequestComponent } from './pending-reg-request.component';

describe('PendingRegRequestComponent', () => {
  let component: PendingRegRequestComponent;
  let fixture: ComponentFixture<PendingRegRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingRegRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingRegRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
