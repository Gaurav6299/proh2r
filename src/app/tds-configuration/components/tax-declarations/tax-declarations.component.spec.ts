import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxDeclarationsComponent } from './tax-declarations.component';

describe('TaxDeclarationsComponent', () => {
  let component: TaxDeclarationsComponent;
  let fixture: ComponentFixture<TaxDeclarationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxDeclarationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxDeclarationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
