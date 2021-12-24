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
import { ActivatedRoute } from '@angular/router';
declare var $: any;


@Component({
  selector: 'app-processed-employees',
  templateUrl: './processed-employees.component.html',
  styleUrls: ['./processed-employees.component.scss']
})
export class ProcessedEmployeesComponent implements OnInit, AfterViewInit {
  columns = [
    { field: 'empCode', header: 'Employee Code' },
    { field: 'empName', header: 'Employee Name' },
    { field: 'empJoiningDate', header: 'Joining Date' },
  ];
  @Input() runPayrollId: any;
  processedEmployeeList = [];
  selectedRows = [];
  constructor(private serviceApi: ApiCommonService, public dialog: MatDialog) { }
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
    this.processedEmployeeList = [];
    this.serviceApi.get('/v1/payroll/runPayroll/' + this.runPayrollId + '/PROCESSED').subscribe(
      res => {
        if (res != undefined) {
          this.processedEmployeeList = res;
        }
      },
      err => {
      },
      () => { }
    );
  }

  reRunSelectedEmpPayroll() {
    if (this.selectedRows.length == 0) {
      this.warningNotification("Please select employee first.");
      return;
    }

    const body = {
      "employeeList": this.selectedRows.map(employee => employee.empCode),
      "employeeStatus": "RE-RUN",
      "runPayrollId": this.runPayrollId
    }

    this.serviceApi.put('/v1/payroll/runPayroll/changeState', body).subscribe(
      res => {
        this.selectedRows = [];
        this.getData();
      },
      err => {
      },
      () => { }
    );

  }

}

@Component({
  selector: 'app-selected-employees-rerun-dialog',
  templateUrl: 'selected-employees-rerun-dialog-component.html',
  styleUrls: ['./selected-employees-rerun-dialog-component.scss']
})
export class SelectedEmployeesRerunDialogComponent {

  dataValue: any;
  error = 'Error Message';
  action: any;

  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<SelectedEmployeesRerunDialogComponent>,
    private http: Http,
    private apiCommonService: ApiCommonService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('data-->' + data);
    this.dataValue = data;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  reRunPayroll() {
    console.log('Enter for Update and Make UnHold Employees');
    console.log(JSON.stringify(this.dataValue));
    const body = this.dataValue.data;
    const status = 'PENDING';
    this.apiCommonService.put('/v1/payroll/runpayroll/' + status, body).subscribe(
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
@Component({
  selector: 'app-upload-selected-employees-rerun-dialog',
  templateUrl: 'upload-selected-employees-rerun-dialog-component.html',
  styleUrls: ['./selected-employees-rerun-dialog-component.scss']
})
export class UploadSelectedEmployeesRerunDialogComponent {


  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<UploadSelectedEmployeesRerunDialogComponent>,
    private http: Http,
    private apiCommonService: ApiCommonService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('data-->' + data);

  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  employeeOnHold() {
    console.log('locationIdlocationId -->' + this.data.locationId);
    const bearerData = '';

    this.apiCommonService.delete('/v1/organization/orgLocation/' + this.data.locationId).subscribe(
      res => {
        console.log('resposne --> ' + res);
      },
      error => {
        console.log('err -->' + error);
      }
    );

  }

}
