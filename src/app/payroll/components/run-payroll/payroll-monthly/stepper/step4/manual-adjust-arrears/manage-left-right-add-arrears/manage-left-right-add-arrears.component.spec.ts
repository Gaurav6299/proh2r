import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLeftRightAddArrearsComponent } from './manage-left-right-add-arrears.component';

describe('ManageLeftRightAddArrearsComponent', () => {
  let component: ManageLeftRightAddArrearsComponent;
  let fixture: ComponentFixture<ManageLeftRightAddArrearsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageLeftRightAddArrearsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageLeftRightAddArrearsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
