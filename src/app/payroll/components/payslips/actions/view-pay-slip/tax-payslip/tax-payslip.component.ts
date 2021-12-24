import { ChangeDetectionStrategy, Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import 'rxjs/add/operator/map';
import { RequestOptions } from '@angular/http';
import { Headers } from '@angular/http';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { element } from 'protractor';

@Component({
  selector: 'app-tax-payslip',
  templateUrl: './tax-payslip.component.html',
  styleUrls: ['./tax-payslip.component.scss']
})
export class TaxPayslipComponent implements OnInit {

  employeeName: any;
  employeeCode: any;
  city: any;
  state: any;
  panNumber: any;
  joiningDate: any;
  resignationDate: any;
  totalDays: any;
  daysPaid: any;
  absentDays: any;
  tableDataArray = [];

  constructor(private fb: FormBuilder, private http: Http) {
    this.getPayslipDetails();
  }

  ngOnInit() {
  }

  getPayslipDetails() {
    this.http.get('assets/data/processPayroll/taxPayslip.json').map(res => res.json()).subscribe(
      res => {
        console.log('Enter in the Sucess Function');
        this.employeeCode = res.employeeCode;
        this.employeeName = res.employeeName;
        this.city = res.city;
        this.state = res.state;
        this.panNumber = res.panNumber;
        this.joiningDate = res.joiningDate;
        this.resignationDate = res.resignationDate;
        this.totalDays = res.totalDays;
        this.daysPaid = res.daysPaid;
        this.absentDays = res.absentDays;
        this.tableDataArray = res.payslipData;
        // this.tableDataArray.push(res.payslipData);

      }, err => {
        console.log('Something  gone wrong');
      }
    );
  }
}
