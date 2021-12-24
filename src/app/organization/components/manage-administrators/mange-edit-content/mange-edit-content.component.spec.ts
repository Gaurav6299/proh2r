import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MangeEditContentComponent } from './mange-edit-content.component';

describe('MangeEditContentComponent', () => {
  let component: MangeEditContentComponent;
  let fixture: ComponentFixture<MangeEditContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MangeEditContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MangeEditContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
