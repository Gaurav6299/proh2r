import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RosterRecordsComponent } from './roster-records.component';

describe('RosterRecordsComponent', () => {
  let component: RosterRecordsComponent;
  let fixture: ComponentFixture<RosterRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RosterRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RosterRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
