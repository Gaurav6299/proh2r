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
import { ApiCommonService } from '../../../../../../../../services/api-common.service';
import { error } from 'selenium-webdriver';
import { concat } from 'rxjs/operators/concat';
import { ActivatedRoute } from '@angular/router';
import { PendingEmployeesComponent } from '../pending-employees/pending-employees.component';

declare var $: any;

@Component({
  selector: 'app-employees-on-hold',
  templateUrl: './employees-on-hold.component.html',
  styleUrls: ['./employees-on-hold.component.scss']
})
export class EmployeesOnHoldComponent implements OnInit, AfterViewInit {
  columns = [
    { field: 'empCode', header: 'Employee Code' },
    { field: 'empName', header: 'Employee Name' },
    { field: 'empJoiningDate', header: 'Joining Date' }
  ];
  @Input() runPayrollId: any;
  onHoldEmployeeList = [];
  selectedRows = [];
  notificationMsg: any;
  constructor(private serviceApi: ApiCommonService, public dialog: MatDialog,) { }
  successNotification(successMessage: any) {
    $.notifyClose();
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
    $.notifyClose();
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

  ngOnInit() { }
  ngAfterViewInit() {
    console.log(this.runPayrollId);
    this.getData();
  }

  getData() {
    this.onHoldEmployeeList = [];
    this.serviceApi.get('/v1/payroll/runPayroll/' + this.runPayrollId + '/ON_HOLD').subscribe(
      res => {
        if (res != undefined) {
          this.onHoldEmployeeList = res;
        }
      },
      err => {
      },
      () => { }
    );
  }

  putSelectedEmpUnHold() {
    if (this.selectedRows.length == 0) {
      this.warningNotification('Select an employee first');
    } else {
      let empList = [];
      this.selectedRows.forEach(element => {
        empList.push(element.empCode);
      });
      let dialogRef = this.dialog.open(EmployeeUnHoldDialogComponent, {
        width: '600px',
        panelClass: 'custom-dialog-container',
        data: {
          empCodeList: empList,
          runPayrollId: this.runPayrollId,
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result !== undefined) {
          if (result.message) {
            if (result.status === 'Response') {
              this.notificationMsg = result.message;
              this.successNotification(this.notificationMsg);
              this.getData();
            } else if (result.status === 'Error') {
              this.notificationMsg = result.message;
              this.warningNotification(this.notificationMsg);
            }
          }
          this.selectedRows = [];
        }
      });
    }
  }


}

@Component({
  selector: 'app-employee-un-hold-dialog',
  templateUrl: 'employee-un-hold-dialog-component.html',
  styleUrls: ['./employee-un-hold-dialog-component.scss']
})
export class EmployeeUnHoldDialogComponent {

  dataValue: any;
  error = 'Error Message';
  action: any;
  empCodeList: any;
  runPayrollId: any;

  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<EmployeeUnHoldDialogComponent>,
    private apiCommonService: ApiCommonService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      console.log('data-->' + data);
      this.empCodeList = data.empCodeList;
      this.runPayrollId = data.runPayrollId;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  updateEmployeeUnHold() {
    console.log('Enter for Update and Make UnHold Employees');
    const body = {
      "employeeList": this.empCodeList,
      "employeeStatus": "ACTIVE",
      "runPayrollId": this.runPayrollId
    };
    this.apiCommonService.put('/v1/payroll/runPayroll/changeState', body).subscribe(
      res => {
        console.log('Enter Successfully Makes Un Hold');
        this.action = 'Response';
        this.error = res.message;
        this.close();

      }, err => {
        console.log('there is something error.....  ' + err.message);
        this.action = 'Error';
        this.error = err.message;
        this.close();
      }, () => {
      }
    );

  }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }


}


