import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxDeclarationCategoriesComponent } from './tax-declaration-categories.component';

describe('TaxDeclarationCategoriesComponent', () => {
  let component: TaxDeclarationCategoriesComponent;
  let fixture: ComponentFixture<TaxDeclarationCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxDeclarationCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxDeclarationCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
