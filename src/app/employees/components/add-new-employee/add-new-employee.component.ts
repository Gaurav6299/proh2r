import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-new-employee',
  templateUrl: './add-new-employee.component.html',
  styleUrls: ['./add-new-employee.component.scss']
})
export class AddNewEmployeeComponent implements OnInit {
  currentTab = "1";
  isLinear = true;
  routeLinks: any[];
  activeLinkIndex = -1;
 requireRouteLink = './employment';
  constructor(private router: Router) {
    this.routeLinks = [
      {
        label: 'Basic Details',
        link: './basic',
        index: 0,
        isDisabled : false
      }, {
        label: 'Employment Details',
        link: './employment',
        index: 1,
        isDisabled : true
       }
      //, {
      //   label: 'Salary Details',
      //   link: './salary',
      //   index: 2,
      //   isDisabled : true
      // }, {
      //   label: 'Statutory Details',
      //   link: './statutory',
      //   index: 3,
      //   isDisabled : true
      // }, {
      //   label: 'Other Details',
      //   link: './other',
      //   index: 4,
      //   isDisabled : true
      // }
    ];
  }

  ngOnInit(): void {
    // this.router.events.subscribe((res) => {
    //   this.activeLinkIndex = this.routeLinks.indexOf(this.routeLinks.find(tab => tab.link === '.' + this.router.url));
    // });
  }


  receiveMessage($event) {
    this.currentTab = $event
  }
}
