import { Component, OnInit, ViewChild } from '@angular/core';
import { TaxPayerTypeComponent } from './tabs/tax-payer-type/tax-payer-type.component';
import { TaxComponent } from './tabs/tax/tax.component';
import { TaxablePayItemComponent } from './tabs/taxable-pay-item/taxable-pay-item.component';
declare var $: any;
@Component({
  selector: 'app-define-tax',
  templateUrl: './define-tax.component.html',
  styleUrls: ['./define-tax.component.scss']
})
export class DefineTaxComponent implements OnInit {
  panelFirstWidth: any;
  panelFirstHeight: any;
  currentTab: any;
  @ViewChild(TaxablePayItemComponent) tab1: TaxablePayItemComponent;
  @ViewChild(TaxPayerTypeComponent) tab2: TaxPayerTypeComponent;
  @ViewChild(TaxComponent) tab3: TaxComponent;
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
      this.tab1.getAlltaxablePayItems();
    } else if (event.index === 1) {
      this.tab2.getTaxCriteria();
    } else if (event.index === 2) {
      this.tab3.getTaxCriteria();
    }
  }
}
