import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeLossOnHousePropertyComponent } from './income-loss-on-house-property.component';

describe('IncomeLossOnHousePropertyComponent', () => {
  let component: IncomeLossOnHousePropertyComponent;
  let fixture: ComponentFixture<IncomeLossOnHousePropertyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomeLossOnHousePropertyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeLossOnHousePropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
