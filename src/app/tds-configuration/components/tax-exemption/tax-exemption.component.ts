import { Component, OnInit, ViewChild } from '@angular/core';
import { DirectExemptionComponent } from './tabs/direct-exemption/direct-exemption.component';
import { IndirectExemptionComponent } from './tabs/indirect-exemption/indirect-exemption.component';
declare var $: any;
@Component({
  selector: 'app-tax-exemption',
  templateUrl: './tax-exemption.component.html',
  styleUrls: ['./tax-exemption.component.scss']
})
export class TaxExemptionComponent implements OnInit {
  panelFirstWidth: any;
  panelFirstHeight: any;
  currentTab: any;
  @ViewChild(DirectExemptionComponent) tab1: DirectExemptionComponent;
  @ViewChild(IndirectExemptionComponent) tab2: IndirectExemptionComponent;
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
      this.tab1.getAllDirectExemptions();
    } else if (event.index === 1) {
      this.tab2.getAllIndirectExemptions();
    } else if (event.index === 2) {

    }
  }
}
