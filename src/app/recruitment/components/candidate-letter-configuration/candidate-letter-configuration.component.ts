import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';

@Component({
  selector: 'app-candidate-letter-configuration',
  templateUrl: './candidate-letter-configuration.component.html',
  styleUrls: ['./candidate-letter-configuration.component.scss']
})
export class CandidateLetterConfigurationComponent implements OnInit {
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
    console.log('event => ', event);
    console.log('index => ', event.index);
    console.log('tab => ', event.tab);
    this.currentTab = event.index;
  }
}
