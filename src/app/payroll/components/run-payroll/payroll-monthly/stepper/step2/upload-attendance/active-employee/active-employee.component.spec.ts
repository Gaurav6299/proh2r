import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveEmployeeComponent } from './active-employee.component';

describe('ActiveEmployeeComponent', () => {
  let component: ActiveEmployeeComponent;
  let fixture: ComponentFixture<ActiveEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
