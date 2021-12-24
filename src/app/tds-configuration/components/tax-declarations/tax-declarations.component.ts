import { Component, OnInit, ViewChild } from '@angular/core';
import { LockUnlockEmployeeComponent } from './tabs/lock-unlock-employee/lock-unlock-employee.component';
import { TaxDeclarationCategoriesComponent } from './tabs/tax-declaration-categories/tax-declaration-categories.component';
import { TaxDeclarationCategorySettingsComponent } from './tabs/tax-declaration-category-settings/tax-declaration-category-settings.component';
import { TaxYearComponent } from './tabs/tax-year/tax-year.component';
declare var $: any;
@Component({
  selector: 'app-tax-declarations',
  templateUrl: './tax-declarations.component.html',
  styleUrls: ['./tax-declarations.component.scss']
})
export class TaxDeclarationsComponent implements OnInit {
  panelFirstWidth: any;
  panelFirstHeight: any;
  currentTab: any;
  @ViewChild(TaxYearComponent) tab1: TaxYearComponent;
  @ViewChild(TaxDeclarationCategoriesComponent) tab2: TaxDeclarationCategoriesComponent;
  @ViewChild(TaxDeclarationCategorySettingsComponent) tab3: TaxDeclarationCategorySettingsComponent;
  @ViewChild(LockUnlockEmployeeComponent) tab4: LockUnlockEmployeeComponent;
  constructor() { }

  ngOnInit() {
  }
  onTabChange(event) {
    console.log(event);
    if ($('.divtoggleDiv').length > 0) {
      this.panelFirstWidth = $('.divtoggleDiv')[0].offsetWidth;
      this.panelFirstHeight = $('.paneDiv')[0].offsetHeight;
      $('.divtoggleDiv')[1].style.display = 'none';
    }
  }
  selectedTabChange(event) {
    console.log('event => ', event);
    console.log('index => ', event.index);
    console.log('tab => ', event.tab);
    this.currentTab = event.index;

    console.log(event);
    if (event.index === 0) {
      this.tab1.getTaxYears();
    } else if (event.index === 1) {
      this.tab2.getTaxCategories();
    } else if (event.index === 2) {
      this.tab3.getTaxCategories();
    } else if (event.index === 3) {
      this.tab4.getAllFilterData();
    }
  }

}
