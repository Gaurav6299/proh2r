import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Proh2rReportsComponent } from './proh2r-reports.component';

describe('Proh2rReportsComponent', () => {
  let component: Proh2rReportsComponent;
  let fixture: ComponentFixture<Proh2rReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Proh2rReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Proh2rReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
