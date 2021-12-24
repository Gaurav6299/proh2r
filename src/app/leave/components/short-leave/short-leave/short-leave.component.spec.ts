import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortLeaveComponent } from './short-leave.component';

describe('ShortLeaveComponent', () => {
  let component: ShortLeaveComponent;
  let fixture: ComponentFixture<ShortLeaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShortLeaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
