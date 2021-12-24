import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTable } from 'primeng/primeng';

@Component({
  selector: 'app-challan-entry',
  templateUrl: './challan-entry.component.html',
  styleUrls: ['./challan-entry.component.scss']
})
export class ChallanEntryComponent implements OnInit {
  @ViewChild('dt1') dt: DataTable;
  columns = [
    { field: 'period', header: 'Period' },
    { field: 'challanName', header: 'Challan Name' },
    { field: 'bsrCode', header: 'BSR Code' },
    { field: 'challanAmt', header: 'TDS/Challan Amount' },
    { field: 'educationAmt', header: 'Education Cess Amount' },
    { field: 'taxAmt', header: 'Total Tax Amount' },
    { field: 'payDate', header: 'Pay Date' },
    { field: 'deposite', header: 'Date of Deposite' },
    { field: 'voucherNo', header: 'Challan/Voucher No' },
  ];
  cars = [];
  cars1 = [];
  cars2 = [];
  challanEntryList = [];
  constructor() {
    this.challanEntryList = [{ period: 'April 2017 - 38', challanName: 'April Challan-Factory', bsrCode: '350218', challanAmt: '5000.00', educationAmt: '199.00', taxAmt: '5199.00', payDate: '2017-04-07', dateDeposite: '2017-04-07', voucherNo: '' },
    { period: 'April 2017 - 38', challanName: 'April Challan HO', bsrCode: '350218', challanAmt: '5000.00', educationAmt: '199.00', taxAmt: '5199.00', payDate: '2017-04-07', dateDeposite: '2017-04-07', voucherNo: '' },
    ]
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
