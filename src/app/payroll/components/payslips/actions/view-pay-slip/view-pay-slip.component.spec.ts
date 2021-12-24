import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPaySlipComponent } from './view-pay-slip.component';

describe('ViewPaySlipComponent', () => {
  let component: ViewPaySlipComponent;
  let fixture: ComponentFixture<ViewPaySlipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPaySlipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPaySlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
