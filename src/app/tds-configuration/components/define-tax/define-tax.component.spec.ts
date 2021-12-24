import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefineTaxComponent } from './define-tax.component';

describe('DefineTaxComponent', () => {
  let component: DefineTaxComponent;
  let fixture: ComponentFixture<DefineTaxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefineTaxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefineTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
