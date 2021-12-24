import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTable } from 'primeng/primeng';

@Component({
  selector: 'app-challan-batch',
  templateUrl: './challan-batch.component.html',
  styleUrls: ['./challan-batch.component.scss']
})
export class ChallanBatchComponent implements OnInit {
  @ViewChild('dt1') dt: DataTable;
  columns = [
    { field: 'empCode', header: 'Employee Code' },
    { field: 'empName', header: 'Employee Name' },
    { field: 'challanAmt', header: 'TDS/Challan Amount' },
    { field: 'surcharge', header: 'TDS Surcharge' },
    { field: 'educationAmt', header: 'Education Cess Amount' },
    { field: 'taxAmt', header: 'Total Tax Amount' },
  ];
  cars = [];
  cars1 = []
  cars2 = [];
  challanBatchList = [];
  constructor() {
    this.challanBatchList = [{ empCode: '1194', empName: 'Sourabh Bhatiya', challanAmt: '5000.00', surcharge: '0.00', educationAmt: '199.00', taxAmt: '5199.00', },
    { empCode: '1149', empName: 'Nayab Haider', challanAmt: '5000.00', surcharge: '0.00', educationAmt: '199.00', taxAmt: '5199.00', }]
    this.cars = [
      { label: '2018', value: 1 },
      { label: '2019', value: 2 },
      { label: '2020', value: 3 },
      { label: '2021', value: 4 },
      { label: '2022', value: 5 },
    ];
    this.cars1 = [
      { label: 'January', value: 1 },
      { label: 'Febuary', value: 2 },
      { label: 'March', value: 3 },
      { label: 'April', value: 4 },
      { label: 'May', value: 5 },
      { label: 'June', value: 6 }
    ];
    this.cars2 = [
      { label: 'xyz', value: 1 },
      { label: 'xyz', value: 2 },
      { label: 'xyz', value: 3 },
      { label: 'xyz', value: 4 },
      { label: 'xyz', value: 5 },
      { label: 'xyz', value: 6 }
    ];
  }

  ngOnInit() {
  }

}
