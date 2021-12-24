import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LockUnlockEmployeeComponent } from './lock-unlock-employee.component';

describe('LockUnlockEmployeeComponent', () => {
  let component: LockUnlockEmployeeComponent;
  let fixture: ComponentFixture<LockUnlockEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LockUnlockEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LockUnlockEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
