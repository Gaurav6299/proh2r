import { ChangeDetectionStrategy, Component, OnInit, Input, ViewChild, Inject, ChangeDetectorRef, ViewChildren, ElementRef, QueryList, Output, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import 'rxjs/add/operator/map';
import { RequestOptions } from '@angular/http';
import { Headers } from '@angular/http';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTable, MatInput } from '@angular/material';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { ApiCommonService } from '../../../../../../../../services/api-common.service';
import { RunPayroll } from '../../../../../../../service/run-payroll.service';
import { ActivatedRoute } from '@angular/router';
import { matchCellWidths } from 'fullcalendar/src/util';
import { DataTable } from 'primeng/primeng';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-pending-employees',
  templateUrl: './pending-employees.component.html',
  styleUrls: ['./pending-employees.component.scss']
})
export class PendingEmployeesComponent implements OnInit, AfterViewInit {
  columns = [
    { field: 'empCode', header: 'Employee Code' },
    { field: 'empName', header: 'Employee Name' },
    { field: 'empJoiningDate', header: 'Joining Date' },
  ];
  @Input() runPayrollId: any;
  @Output() messageEvent = new EventEmitter();
  pendingEmployeeList = [];
  selectedRows = [];
  notificationMsg: any;
  action: string;
  error: any;
  // @ViewChild("dt1") dt: DataTable;
  constructor(private runPayroll: RunPayroll, private serviceApi: ApiCommonService, public dialog: MatDialog, private router: Router) { }

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

  cancel() {
    this.runPayroll.changeData(1);
    this.router.navigate(['/payroll/run-payroll']);
  }

  ngOnInit() { }

  ngAfterViewInit() {
    console.log(this.runPayrollId);
    this.getData();
  }


  getData() {
    this.pendingEmployeeList = [];
    this.serviceApi.get('/v1/payroll/runPayroll/' + this.runPayrollId + '/ACTIVE').subscribe(
      res => {
        if (res != undefined) {
          this.pendingEmployeeList = res;
        }
      },
      err => {
      },
      () => { }
    );
  }

  putSelectedEmpOnHold() {
    if (this.selectedRows.length == 0) {
      this.warningNotification('Select an employee first');
    } else {
      let empList = [];
      this.selectedRows.forEach(element => {
        empList.push(element.empCode);
      });
      let dialogRef = this.dialog.open(EmployeeOnHoldDialogComponent, {
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


  onProceed() {
    if (this.selectedRows.length == 0) {
      this.warningNotification('Select an employee first');
    } else {
      let empList = [];
      this.selectedRows.forEach(element => {
        empList.push(element.empCode);
      });
      const body = {
        "employeeList": empList,
        "runPayrollId": this.runPayrollId
      }
      this.serviceApi.post('/v1/payroll/runPayroll/saveEmployees', body).subscribe(
        res => {
          console.log('Enter Successfully');
          let currentStep;
          this.runPayroll.currentStep.subscribe(step => currentStep = step);
          let step = ++currentStep
          this.runPayroll.changeData(step);
          this.selectedRows = [];
          this.messageEvent.emit('continue-' + step);
        },
        error => {
          console.log('err -->' + error);
          console.log('there is something error.....  ' + error.message);
          this.warningNotification(error.message);
        }
      );
    }
  }

  close() {
    throw new Error('Method not implemented.');
  }

}

@Component({
  selector: 'app-employee-on-hold-dialog',
  templateUrl: 'employee-on-hold-dialog-component.html',
  styleUrls: ['./employee-on-hold-dialog-component.scss']
})
export class EmployeeOnHoldDialogComponent {
  error = 'Error Message';
  action: any;
  monthList = ['', 'JANUARY', 'FEBRUARY', 'MARCH',
    'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
  empCodeList = [];
  runPayrollId: any;
  dataValue: any;
  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<EmployeeOnHoldDialogComponent>,
    private http: Http,
    private apiCommonService: ApiCommonService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('data-->' + data);
    this.empCodeList = data.empCodeList;
    this.runPayrollId = data.runPayrollId;

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  employeeOnHold() {
    console.log('locationIdlocationId -->' + this.empCodeList);
    const body = {
      "employeeList": this.empCodeList,
      "employeeStatus": "ON_HOLD",
      "runPayrollId": this.runPayrollId
    };
    // tslint:disable-next-line:max-line-length
    this.apiCommonService.put('/v1/payroll/runPayroll/changeState', body).subscribe(
      res => {
        console.log('Enter Successfully Makes Un Hold');
        this.action = 'Response';
        this.error = res.message;
        this.close();
      },
      error => {
        console.log('err -->' + error);
        console.log('there is something error.....  ' + error.message);
        this.action = 'Error';
        this.error = error.message;
        this.close();
      }
    );

  }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }


}
