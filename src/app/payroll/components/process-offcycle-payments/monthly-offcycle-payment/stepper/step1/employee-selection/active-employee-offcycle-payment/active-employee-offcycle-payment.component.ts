import { ChangeDetectionStrategy, Component, OnInit, Output, EventEmitter, Input, ViewChild, Inject } from '@angular/core';
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
import { OffcycleDataServiceService, Element } from '../../../../../../../service/offcycle-data-service.service';
import { ApiCommonService } from '../../../../../../../../services/api-common.service';
declare var $: any;

@Component({
  selector: 'app-active-employee-offcycle-payment',
  templateUrl: './active-employee-offcycle-payment.component.html',
  styleUrls: ['./active-employee-offcycle-payment.component.scss']
})
export class ActiveEmployeeOffcyclePaymentComponent implements OnInit, AfterViewInit {

  @Output() stepEvent = new EventEmitter<string>();

  public variableAllowanceForm: FormGroup;
  displayedColumns = ['select', 'empCode', 'empName', 'empJoiningDate'];


  dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
  selection = new SelectionModel<Element>(true, []);
  showHideFilter: any;

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



  myControlYear = new FormControl();
  selectedYear = new FormControl();
  years = [];
  yearsData = this.years;

  myControlEmployeeStatus = new FormControl();
  selectedEmployeeStatus = new FormControl();
  status = [];
  statusData = this.status;

  myControlCostCenter = new FormControl();
  selectedCostCenter = new FormControl();
  costCenters = [];
  costCenterData = this.costCenters;


  employeeDataTableList = [];
  activeEmployeeList = [];
  selectedEmployeeList = [];

  notificationMsg: any;
  action: any;

  constructor(private fb: FormBuilder, private http: Http,
    private offcycleData: OffcycleDataServiceService,
    private serviceApi: ApiCommonService) {
    // this.getAllEmployeeList();
    this.getAllActiveEmployees();
  }

  successNotification(successMessage: any) {
    $.notify({
      icon: 'check_circle',
      message: successMessage,
    },
      {
        type: 'success',
        timer: 4000,
        placement: {
          from: 'top',
          align: 'center'
        }
      });
  }
  warningNotification(warningMessage: any) {
    $.notify({
      icon: 'error',
      message: warningMessage,
    },
      {
        type: 'warning',
        timer: 4000,
        placement: {
          from: 'top',
          align: 'center'
        }
      });
  }

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

  getAllActiveEmployees() {
    console.log('Enter to Get All Employee Lists From Database');
    this.serviceApi.get('/v1/payroll/processoffcyclepayments/employees/' + 'Active').subscribe(
      res => {
        res.forEach(element1 => {
          this.activeEmployeeList.push({
            empPayrollOffcycleRecord: element1.empPayrollOffcycleRecord,
            empCode: element1.empCode,
            empName: element1.empName,
            empJoiningDate: element1.empJoiningDate,
            empProcessOffcycleStatus: element1.empProcessOffcycleStatus,
            empOffcycleVarAllowances: element1.empOffcycleVarAllowances,
            empOffcyleVarDeductions: element1.empOffcyleVarDeductions,
            totalRReimbursableAmount: element1.totalRReimbursableAmount,
          });
        });
        this.dataSource = new MatTableDataSource(this.activeEmployeeList);
      }, err => {
        console.log('Enter in the Error Block');
      });
  }

  // getAllEmployeeList() {
  //   console.log('Enter to Get All Employee Lists From Database');
  //   this.serviceApi.get('/v1/employee/').subscribe(
  //     res => {
  //       res.forEach(element1 => {
  //         this.employeeDataTableList.push({
  //           employeeCode: element1.empCode,
  //           employeeName: element1.empFirstName + ' ' + element1.empLastName,
  //           empJoiningDate: element1.empJoiningDate
  //         });
  //       });
  //       this.dataSource = new MatTableDataSource(this.employeeDataTableList);
  //     }, err => {
  //       console.log('Enter in the Error Block');
  //     });
  // }


  applyFilter(filterValue: string) {
    console.log('hello' + filterValue);
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => {
        this.selection.select(row);
        console.log('row-->' + JSON.stringify(row));
      });
  }

  onNoClick(): void {
  }

  onProceed() {
    console.log('On Click Procees Button Selected Employee for Offcyce Payement Process -->' + this.selection.selected);
    this.stepEvent.emit('2');
    this.offcycleData.changeData(this.selection.selected);
  }

  onProceedOffCyclePayments() {
    console.log('Enter in the Processed Next Function');
    for (let i = 0; i < this.selection.selected.length; i++) {
      console.log('>>>>>>> ::::: ' + this.selection.selected[i]);
      this.selectedEmployeeList.push(this.selection.selected[i]);
    }
    const body = this.selectedEmployeeList;

    console.log(JSON.stringify(body));
    this.serviceApi.post('/v1/payroll/processoffcyclepayments/', body).subscribe(
      res => {
        if (res != null) {
          console.log('Data Save Successfully');
          this.stepEvent.emit('2');
        }
      }, err => {
        console.log('Something Wrong');
      }, () => {

      }
    );
  }

}

const ELEMENT_DATA: Element[] = [];
