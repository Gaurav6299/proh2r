import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatutoryDetailComponent } from './statutory-detail.component';

describe('StatutoryDetailComponent', () => {
  let component: StatutoryDetailComponent;
  let fixture: ComponentFixture<StatutoryDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatutoryDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatutoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
