import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxDeclarationCategorySettingsComponent } from './tax-declaration-category-settings.component';

describe('TaxDeclarationCategorySettingsComponent', () => {
  let component: TaxDeclarationCategorySettingsComponent;
  let fixture: ComponentFixture<TaxDeclarationCategorySettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxDeclarationCategorySettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxDeclarationCategorySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
