import { Component, OnInit } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-e-tds',
  templateUrl: './e-tds.component.html',
  styleUrls: ['./e-tds.component.scss']
})
export class ETDSComponent implements OnInit {
  panelFirstWidth: any;
  panelFirstHeight: any;
  currentTab: any;
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
    } else if (event.index === 1) {
    } else if (event.index === 2) {
    } else if (event.index === 3) {
    } else if (event.index === 4) { }
  }
}
