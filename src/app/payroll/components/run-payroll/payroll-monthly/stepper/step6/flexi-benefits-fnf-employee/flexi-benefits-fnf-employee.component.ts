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

@Component({
  selector: 'app-flexi-benefits-fnf-employee',
  templateUrl: './flexi-benefits-fnf-employee.component.html',
  styleUrls: ['./flexi-benefits-fnf-employee.component.scss']
})
export class FlexiBenefitsFnfEmployeeComponent implements OnInit {

  @Input() public uploadVariablePaysEmployeeList;
  public variableAllowanceForm: FormGroup;



  dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
  displayedColumns = ['employeeCode', 'employeeName', 'eligibiltyCurrentCycle',
  'paidViaOffcycle', 'additionalAmount', 'taxablePaidAmt', 'recordId'];
  selection = new SelectionModel<Element>(true, []);
  showHideFilter: any;
  actionSelected = new FormControl();
  /* location  start*/
  myControl = new FormControl();
  selectedWorkLocation = new FormControl();
  options = [
    { value: 'noida', viewValue: 'Noida' },
    { value: 'delhi', viewValue: 'Delhi' },
    { value: 'agara', viewValue: 'Agara' },
    { value: 'mumbai', viewValue: 'Mumbai' }
  ];
  optionsData = this.options;
  /* location  end*/



  /* year  start*/
  myControlYear = new FormControl();
  selectedYear = new FormControl();
  years = [
    { value: 'January', viewValue: 'January' },
    { value: 'February', viewValue: 'February' },
    { value: 'March', viewValue: 'March' },
    { value: 'April', viewValue: 'April' },
    { value: 'May', viewValue: ' May' },
    { value: 'June', viewValue: ' June' },
    { value: 'July', viewValue: ' July' },
    { value: 'August', viewValue: ' August' },
    { value: 'September', viewValue: ' September' },
    { value: 'October', viewValue: ' October' },
    { value: 'November', viewValue: ' November' },
    { value: 'December', viewValue: 'December' },
  ];
  yearsData = this.years;
  /* year  end*/



  /* employee status  start*/
  myControlEmployeeStatus = new FormControl();
  selectedEmployeeStatus = new FormControl();
  status = [
    { value: 'Incomplete', viewValue: 'Incomplete' },
    { value: 'Active', viewValue: 'Active' },
    { value: 'OnHold', viewValue: 'OnHold' },
    { value: 'Terminated', viewValue: 'Terminated' }
  ];
  statusData = this.status;
  /* employee status   end*/


  /* Cost Cetnter start*/
  myControlCostCenter = new FormControl();
  selectedCostCenter = new FormControl();

  costCenters = [
    { value: 'Finance', viewValue: 'Finance' },
    { value: 'Accounts', viewValue: 'Accounts' },
    { value: 'Marketing', viewValue: 'Marketing' },
    { value: 'Sales', viewValue: 'Sales' },
    { value: 'HR', viewValue: 'HR' }
  ];
  costCenterData = this.costCenters;
  /* Cost Cetnter status   end*/


  constructor(public dialog: MatDialog, private fb: FormBuilder,
    private http: Http) {
  }

  ngOnInit() {
    this.variableAllowanceForm = this.fb.group({
      workLocations: [],
      years: [],
      employeeStatus: [],
      costCenter: []
    });
  }


  /*****below method call when select multple location***** */
  searchLocation(data: any) {
    console.log('my method called' + data);
    this.optionsData = this.options.filter(option =>
      option.value.toLowerCase().indexOf(this.myControl.value.toLowerCase()) === 0);
  }

  selectLocation() {
    console.log('selected Employee called');
    this.variableAllowanceForm.controls.workLocations.setValue(this.selectedWorkLocation.value);
  }
  /*****multiple location clossed here***** */


  /*****below method call when select multple years***** */
  searchYear(data: any) {
    console.log('my method called' + data);
    this.yearsData = this.years.filter(option =>
      option.value.toLowerCase().indexOf(this.myControlYear.value.toLowerCase()) === 0);
  }

  selectYear() {
    console.log('selected Employee called');

    this.variableAllowanceForm.controls.workLocations.setValue(this.selectedYear.value);
  }
  /*****multiple years clossed here***** */



  /*****below method call when select employee status ***** */
  searchEmployeeStatus(data: any) {
    console.log('searchEmployeeStatus called' + data);
    this.statusData = this.status.filter(option =>
      option.value.toLowerCase().indexOf(this.myControlEmployeeStatus.value.toLowerCase()) === 0);
  }

  selectEmployeeStatus() {
    console.log('selected Employee called');
    this.variableAllowanceForm.controls.employeeStatus.setValue(this.selectedEmployeeStatus.value);
  }
  /****employee status  clossed here***** */



  /*****below method call when select cost center ***** */
  searchCostCenter(data: any) {
    console.log('my method called' + data);
    this.costCenterData = this.costCenters.filter(option =>
      option.value.toLowerCase().indexOf(this.myControlCostCenter.value.toLowerCase()) === 0);
  }

  selectCostCenter() {
    console.log('selected Employee called');

    this.variableAllowanceForm.controls.costCenter.setValue(this.selectedCostCenter.value);
  }
  /****employee status  clossed here***** */

  applyFilter(filterValue: string) {
    console.log('hello' + filterValue);
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  onProceed() {
    console.log('On complete process');
  }

  onNoClick(): void {
  }

  onClickReimbursableAmountDialog(data: any) {
    console.log('Employee On Delete-->' + data);
    const dialogRef = this.dialog.open(RunPayrollReimbursableRecordFnfEmpComponent, {
      width: '700px',
      // data: { actionId: data.actionId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}




// ---------------- Start Of Process Offcycle Payements Upload Dailog Model
@Component({
  templateUrl: 'reimbursable-records-dialog.html',
  styleUrls: ['dialog-model.scss']
})
export class RunPayrollReimbursableRecordFnfEmpComponent implements OnInit {

  displayedColumns = ['category', 'eligibleAmount', 'reimbursableAmount'];
  dataSource = new MatTableDataSource(ELEMENT_DATA_DIALOG);

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<RunPayrollReimbursableRecordFnfEmpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('data-->' + data);
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}


export interface ReimbursableAmountDialogElement {
  reimbursementRecordId: number;
  category: string;
  eligibleAmount: number;
  reimbursableAmount: number;
}
const ELEMENT_DATA_DIALOG: ReimbursableAmountDialogElement[] = [
  // {reimbursementRecordId: 1, category: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  // {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  // {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  // {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'}
];


export interface Element {
  recordId: string;
  employeeCode: string;
  employeeName: string;
  eligibiltyCurrentCycle: string;
  paidViaOffcycle: string;
  additionalAmount: string;
  taxablePaidAmt: string;
  joiningDate: string;
  totalVariableAllowance: string;
  totalVariableDeduction: string;
  reimburableAmount: string;
}

const ELEMENT_DATA: Element[] = [
  {
    recordId: '0',
    employeeCode: '1138',
    employeeName: 'Anand Kumar',
    eligibiltyCurrentCycle: '0',
    paidViaOffcycle: '0',
    additionalAmount: '0',
    taxablePaidAmt: '0',
    joiningDate: '22-09-2017',
    totalVariableAllowance: '0',
    totalVariableDeduction: '0',
    reimburableAmount: '0'
  },
  {
    recordId: '1',
    employeeCode: '1122',
    employeeName: 'Dheeraj Chaudhary',
    eligibiltyCurrentCycle: '0',
    paidViaOffcycle: '0',
    additionalAmount: '0',
    taxablePaidAmt: '0',
    joiningDate: '22-02-2016',
    totalVariableAllowance: '0',
    totalVariableDeduction: '0',
    reimburableAmount: '0'
  }
];
