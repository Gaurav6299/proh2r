import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerquisitesComponent } from './perquisites.component';

describe('PerquisitesComponent', () => {
  let component: PerquisitesComponent;
  let fixture: ComponentFixture<PerquisitesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerquisitesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerquisitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
