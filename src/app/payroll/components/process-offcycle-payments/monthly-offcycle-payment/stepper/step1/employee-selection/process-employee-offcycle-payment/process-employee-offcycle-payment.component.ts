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
  selector: 'app-process-employee-offcycle-payment',
  templateUrl: './process-employee-offcycle-payment.component.html',
  styleUrls: ['./process-employee-offcycle-payment.component.scss']
})
export class ProcessEmployeeOffcyclePaymentComponent implements OnInit, AfterViewInit {

  public variableAllowanceForm: FormGroup;
 
  displayedColumns = ['select', 'employeeCode', 'employeeName', 'joiningDate'];
  dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
  selection = new SelectionModel<Element>(true, []);


/* location  start*/
  myControl = new FormControl();
  actionGetter = new FormControl();
  selectedWorkLocation = new FormControl();

  actionList = [
    {value: 'Bulk Actions', viewValue: 'Bulk Actions'},
    {value: 'Rerun Selected Employees', viewValue: 'Rerun Selected Employees'}
  ];

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
  { value: 'January', viewValue: 'January'},
  { value: 'February', viewValue: 'February'},
  { value: 'March', viewValue: 'March'},
  { value: 'April', viewValue: 'April'},
  { value: 'May', viewValue: ' May'},
  { value: 'June', viewValue: ' June'},
  { value: 'July', viewValue: ' July'},
  { value: 'August', viewValue: ' August'},
  { value: 'September', viewValue: ' September'},
  { value: 'October', viewValue: ' October'},
  { value: 'November', viewValue: ' November'},
  { value: 'December', viewValue: 'December'},
];
yearsData = this.years;
/* year  end*/



/* employee status  start*/
myControlEmployeeStatus = new FormControl();
selectedEmployeeStatus = new FormControl();
status = [
  { value: 'Incomplete', viewValue: 'Incomplete'},
  { value: 'Active', viewValue: 'Active'},
  { value: 'OnHold', viewValue: 'OnHold'},
  { value: 'Terminated', viewValue: 'Terminated'}
];
statusData = this.status;
/* employee status   end*/


/* Cost Cetnter start*/
myControlCostCenter= new FormControl();
selectedCostCenter = new FormControl();
costCenters = [
  { value: 'Finance', viewValue: 'Finance'},
  { value: 'Accounts', viewValue: 'Accounts'},
  { value: 'Marketing', viewValue: 'Marketing'},
  { value: 'Sales', viewValue: 'Sales'},
  { value: 'HR', viewValue: 'HR'}
];
costCenterData = this.costCenters;
/* Cost Cetnter status   end*/


  constructor(public dialog: MatDialog,private fb: FormBuilder, private http: Http) { }

  ngOnInit() {
    this.variableAllowanceForm = this.fb.group({
      workLocations: [],
      years: [],
      employeeStatus: [],
      costCenter: []
    });
  }
  ngAfterViewInit() {

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


  actionRerurnSelectedEmployeeProcessed(data: any) {
    console.log('Employee On Action-->' + data.value);
      if (data.value !== 'Bulk Actions') {
        const dialogRef = this.dialog.open(RerunSelectedEmployeeActionComponent, {
          width: '700px',
          data: { actionId: data.actionId }
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
        });
      }
  }


}



@Component({
  templateUrl: 'rerun-action-dialog-component.html',
  styleUrls: ['dialog-model.scss']
})
export class RerunSelectedEmployeeActionComponent implements OnInit {

  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<RerunSelectedEmployeeActionComponent>,
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
export interface Element {
  employeeCode: string;
  employeeName: string;
  joiningDate: string;

}
const ELEMENT_DATA: Element[] = [
  {
    employeeCode: '1120',
    employeeName: 'Furkan Ali',
    joiningDate: '26-12-2016'
  },
  {
    employeeCode: '1122',
    employeeName: 'Dheeraj Chaudhary',
    joiningDate: '22-02-2016'
  },
  {
    employeeCode: '1115',
    employeeName: 'Zeeshan Siddiqui',
    joiningDate: '25-01-2014'
  }
];
