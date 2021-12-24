import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTable } from 'primeng/primeng';

@Component({
  selector: 'app-company-information',
  templateUrl: './company-information.component.html',
  styleUrls: ['./company-information.component.scss']
})
export class CompanyInformationComponent implements OnInit {
  cars = [];
  cars1 = [];
  cars2 = [];
  constructor() {
    this.cars = [
      { label: 'Uttar Pradesh', value: 1 },
      { label: 'Delhi', value: 2 },
      { label: 'Bihar', value: 3 },
    ];
    this.cars1 = [
      { label: 'Association of person.........', value: 1 },
    ];
    this.cars2 = [
      { label: 'Payment made to Gov.', value: 1 },
    ];
  }

  ngOnInit() {
  }

}
