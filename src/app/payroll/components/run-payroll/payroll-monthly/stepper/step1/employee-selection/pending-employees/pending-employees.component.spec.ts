import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingEmployeesComponent } from './pending-employees.component';

describe('PendingEmployeesComponent', () => {
  let component: PendingEmployeesComponent;
  let fixture: ComponentFixture<PendingEmployeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingEmployeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
