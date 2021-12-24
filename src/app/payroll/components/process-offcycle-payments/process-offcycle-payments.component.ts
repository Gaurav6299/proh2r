import { ChangeDetectionStrategy, Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import 'rxjs/add/operator/map';
import { RequestOptions } from '@angular/http';
import { Headers } from '@angular/http';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTable } from '@angular/material';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { validateConfig } from '@angular/router/src/config';
import { DatePipe } from '@angular/common/src/pipes';


@Component({
  selector: 'app-process-offcycle-payments',
  templateUrl: './process-offcycle-payments.component.html',
  styleUrls: ['./process-offcycle-payments.component.scss']
})
export class ProcessOffcyclePaymentsComponent implements OnInit, AfterViewInit {
  ELEMENT_DATA: any;

  showHideFilter = false;
  displayedColumns = ['generatedDate', 'payrollCycle', 'grossAllowance',
    'grossDeduction', 'netPayment', 'OffcycleDetails', 'batchStatus', 'actionId'];
  dataSource: MatTableDataSource<Element>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  date: any;
  tableData = [];

  constructor(public dialog: MatDialog, private fb: FormBuilder, private http: Http) {
    this.getAllTableData();
    this.date = new Date();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  applyFilter(filterValue: string) {
    console.log('hello' + filterValue);
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }


  processPayrollLockRecord(data: any) {
    console.log('Employee On Delete-->' + data);
    const dialogRef = this.dialog.open(ProcessOffcycleLoackComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { actionId: data.actionId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  generateOffcyclePayrollRecord(data: any) {
    console.log('Enter in the Methid which Used to generate The Payroll -->' + data);
    const dialogRef = this.dialog.open(GenerateProcessOffcycleComponent, {
      width: '700px',
      data: { actionId: data.actionId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }


  getAllTableData() {
    console.log('<------------------ Enter to get all table data Method---------------------->');
    this.http.get('assets/data/processPayroll/processPayrollData.json').map(res => res.json()).
      subscribe(
      res => {
        console.log('<------------------  Here enter to take the value from Response ---------------------->');
        res.forEach(element => {
          this.tableData.push(
            {
              generatedDate: element.generatedDate,
              payrollCycle: element.payrollCycle,
              grossAllowance: element.grossAllowance,
              grossDeduction: element.grossDeduction,
              netPayment: element.netPayment,
              OffcycleDetails: element.OffcycleDetails,
              batchStatus: element.batchStatus,
              actionId: element.actionId
            });

        });
        this.dataSource = new MatTableDataSource(this.tableData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      () => {
        console.log('Enter into Else Bloack');
      }
      );
  }

}



// ---------------- Process Offcycle Payments Lock model start ------------------------
@Component({
  templateUrl: 'process-payroll-lock.html',
  styleUrls: ['process-Offcycle-dialog-model.scss']
})
export class ProcessOffcycleLoackComponent implements OnInit {

  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<ProcessOffcycleLoackComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('data-->' + data);
  }

  ngOnInit() {
  }

  processOffcyclePayrollLock() {
    console.log(' >>>>> Request For Delete Record data ---->' + this.data.actionId);
    const val = this.data.actionId;
    console.log('>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<< ' + val);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
// ---------------------- Process Offcycle Payments Lock model end ------------------------


// ----------------Generate Process Offcycle Payments Lock model start ------------------------
@Component({
  templateUrl: 'generateOffcyle-payroll-dialog.html',
  styleUrls: ['process-Offcycle-dialog-model.scss']
})
export class GenerateProcessOffcycleComponent implements OnInit {

  hideShowDivForSpecificEemployee: any;
  showHideTypeSelectionField: any;
  myControl = new FormControl();

  groupByList = [
    { value: 'Employees', viewValue: 'Employees' },
    { value: 'Gender', viewValue: 'Gender' },
    { value: 'Marital Status', viewValue: 'Marital Status' },
    { value: 'Work Location', viewValue: 'Work Location' },
    { value: 'Blood Group', viewValue: 'Blood Group' },
    { value: 'Cost Center', viewValue: 'Cost Center' }
  ];

  selectEmployeeForPayroll = new FormControl();
  date: any;
  employeesList = [];

  optionsData = this.employeesList;
  generateOffcyclePayementForm: FormGroup;
  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<GenerateProcessOffcycleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private http: Http) {
    this.date = 'FEB-2018';
    console.log('data-->' + data);
    this.getAllEmployeesList();
    this.generateOffcyclePayementForm = this._fb.group(
      {
        actionId: [data.actionId],
        selectedGroup: [],
        employeeType: [],
        selectedEmployees: []
      }
    );
  }

  ngOnInit() {

  }

  clickradioforallemployee() {
    this.hideShowDivForSpecificEemployee = false;
  }

  searchGratuityComponents(data: any) {
    console.log('my method called' + data);
    this.optionsData = this.employeesList.filter(option =>
      option.value.toLowerCase().indexOf(this.myControl.value.toLowerCase()) === 0);
  }

  /*****below method call click on specific radio button***** */
  fospecificeEmployee() {
    this.hideShowDivForSpecificEemployee = true;
  }
  /*****above code clossed here***** */
  onNoClick(): void {
    this.dialogRef.close();
  }

  selectGroupTypeForGenerate(data: any) {
    console.log('Enter For Selection Of Group Type want to Generate Salary Payrol >>> ' + data.value);
    if (data.value === 'Employees') {
      this.showHideTypeSelectionField = true;
    } else {
      this.showHideTypeSelectionField = false;
      this.hideShowDivForSpecificEemployee = false;
    }
  }

  setEmployeesForGeneratePayroll() {
    this.generateOffcyclePayementForm.controls.selectedEmployees.setValue(this.selectEmployeeForPayroll.value);
  }


  onClickGenerateOffcyclePayment() {
    console.log('---' + this.generateOffcyclePayementForm.controls.selectedEmployees.value);
  }


  getAllEmployeesList() {
    console.log(' >>>>>> Enter to take employee List for process offcycle Payments ');
    this.http.get('assets/data/allEmployeeList.json').map(res => res.json()).subscribe(
      res => {
        res.forEach(element => {
          this.employeesList.push({ value: element.employeeName, viewValue: element.employeeName });
        });
      }, err => {
        console.log('There is Something Error in the Retriving Employee List');
      });
  }

}
// ---------------------- Generate Process Offcycle Payments Lock model end ------------------------




// -----------------Fixed Allowance Data table interface start------------
export interface Element {
  generatedDate: string;
  payrollCycle: string;
  grossAllowance: string;
  grossDeduction: string;
  netPayment: string;
  OffcycleDetails: string;
  batchStatus: string;
  actionId: number;
}
