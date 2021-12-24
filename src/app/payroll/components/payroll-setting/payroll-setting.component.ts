import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';

@Component({
  selector: 'app-payroll-setting',
  templateUrl: './payroll-setting.component.html',
  styleUrls: ['./payroll-setting.component.scss']
})
export class PayrollSettingComponent implements OnInit {
  panelFirstWidth: any;
  panelFirstHeight: any;
  currentTab = 0;

  constructor() { }

  ngOnInit() {
  }
  onTabChange(event: MatTabChangeEvent) {
    if ($('.divtoggleDiv').length > 0) {
      this.panelFirstWidth = $('.divtoggleDiv')[0].offsetWidth;
      this.panelFirstHeight = $('.paneDiv')[0].offsetHeight;
      $('.divtoggleDiv')[1].style.display = 'none';

    }
  }
  onLinkClick(event: MatTabChangeEvent) {
    // if ($('.divtoggleDiv').length > 0) {
    //   this.panelFirstWidth = $('.divtoggleDiv')[0].offsetWidth;
    //   this.panelFirstHeight = $('.paneDiv')[0].offsetHeight;
    //   $('.divtoggleDiv')[1].style.display = 'none';

    // }
    console.log('event => ', event);
    console.log('index => ', event.index);
    console.log('tab => ', event.tab);
    this.currentTab = event.index;
  }
}
