import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegularizationRequestsComponent } from './regularization-requests.component';

describe('RegularizationRequestsComponent', () => {
  let component: RegularizationRequestsComponent;
  let fixture: ComponentFixture<RegularizationRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegularizationRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegularizationRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
