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
import { validateConfig } from '@angular/router/src/config';
import { ApiCommonService } from '../../../../services/api-common.service';
import { Router } from '@angular/router';
import { KeycloakService } from '../../../../keycloak/keycloak.service';
import * as moment from 'moment';
import { environment } from '../../../../../environments/environment';
import { DataTable } from 'primeng/primeng';
import { delay } from 'rxjs/operators';
declare var $: any;


@Component({
  selector: 'app-payroll-history',
  templateUrl: './payroll-history.component.html',
  styleUrls: ['./payroll-history.component.scss']
})
export class PayrollHistoryComponent implements OnInit, AfterViewInit {
  year: number;
  month: string;
  monthList = ['JANUARY', 'FEBRUARY', 'MARCH',
    'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
  showHideFilter = false;
  @ViewChild("dt1") dt: DataTable;
  columns = [
    { field: 'payrollPeriod', header: 'Payroll Period' },
    { field: 'payrollDate', header: 'Date' },
    { field: 'payrollDetails', header: 'Payroll Details' },
    { field: 'payrollStatus', header: 'Status' },
    { field: 'actions', header: 'Actions' }
  ]
  getProcessHistoryList = [];
  dataSource: MatTableDataSource<Element>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  payrollMonthHistoryList = [];
  payrollAppoverId: any;
  approverStatus = false;
  notificationMsg: any;
  action: any;
  selectedMonth: any;
  selectedYear: any
  showHideApprovalButton: any;
  showHideApprovalPassDialogue: any;
  error: any;
  runPayrollButtonHide: boolean = true;

  constructor(public dialog: MatDialog, private fb: FormBuilder, private http:
    Http, private router: Router, private serviceApi: ApiCommonService) {
    this.getALLPayrollHistory();
    this.getLeaveGeneralSettings();
    const rolesArr = KeycloakService.getUserRole();
    console.log('Has Role ------' + JSON.stringify(KeycloakService.getUserRole()));
  }

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
  payrollApprovalDialog(element: any, action: any) {
    console.log(this.showHideApprovalPassDialogue);
    console.log(action);
    if (this.showHideApprovalPassDialogue) {
      const dialogRef = this.dialog.open(PayrollApprovalDialogComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: {}
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          if (result === 'success') {
            this.serviceApi.put('/v1/payroll/runPayroll/action/' + element.runPayrollId + '/' + action, null)
              .subscribe(
              res => {
                if (res != null) {
                  console.log('Enter Successfully Makes Un Hold');
                  this.action = 'Response';
                  this.error = res.message;
                  this.getPayrollProcessHistory();
                  this.successNotification(this.error);
                }
              }, err => {
                console.log('there is something error.....  ' + err.message);
                this.action = 'Error';
                this.error = err.message;
              }, () => {

              });
          }
        }
      });
    } else {
      this.serviceApi.put('/v1/payroll/runPayroll/action/' + element.runPayrollId + '/' + action, null)
        .subscribe(
        res => {
          if (res != null) {
            console.log('Enter Successfully Makes Un Hold');
            this.action = 'Response';
            this.error = res.message;
            this.getPayrollProcessHistory();
            this.successNotification(this.error);
          }
        }, err => {
          console.log('there is something error.....  ' + err.message);
          this.action = 'Error';
          this.error = err.message;
        }, () => {

        });
    }
  }
  ngOnInit() {
    this.getPayrollProcessHistory();
  }
  getPayrollProcessHistory() {
    this.getProcessHistoryList = [];
    this.serviceApi.get('/v1/payroll/runPayroll/payrollHistory').subscribe(res => {
      this.showHideApprovalButton = res.showHideApprovalButton;
      this.showHideApprovalPassDialogue = res.showHideApprovalPassDialogue;
      this.runPayrollButtonHide = true;
      res.runPayrollList.forEach(element => {
        if (element.payrollStatus != "COMPLETE_APPROVED") {
          this.runPayrollButtonHide = false;
        } else {
          this.runPayrollButtonHide = true;
        }
        this.getProcessHistoryList.push({
          runPayrollId: element.runPayrollId,
          payrollDate: element.payrollDate,
          payrollPeriod: element.payrollPeriod,
          payrollStatus: element.payrollStatus,
          payslipGenStatus: element.payslipGenStatus,
          payrollDetails: element.payrollDetails,
          monthYear: element.payrollPeriod
        });
      });
    },
      (err) => {
      }, () => {
        this.dt.reset();
      });
  }


  updateProcesshistory(id: any) {
    console.log(id.payrollPeriod);
    const str: string = id.payrollPeriod;
    const monthYear = str.split('-', 2);
    this.selectedMonth = monthYear[0];
    this.selectedYear = monthYear[1];
    this.router.navigate(['/payroll/payroll-monthly/' + this.selectedMonth + '/' + this.selectedYear + '/' + id.runPayrollId]);
  }

  download(element: any) {
    this.serviceApi.get("/v1/payroll/runPayroll/salaryRegister/" + element.runPayrollId).subscribe(res => {
      window.open(environment.storageServiceBaseUrl + res.url);
    })
  }

  generatePayslips(element: any) {
    this.serviceApi.post('/v1/payroll/payslips/generate/' + element.payrollPeriod, null).pipe(delay(500)).subscribe(res => {
      console.log('Enter Successfully Makes Un Hold');
      this.action = 'Response';
      this.error = res.message;
      // this.getPayrollProcessHistory();
      this.successNotification(this.error);
    },
      (err) => {
      }, () => {
        this.getPayrollProcessHistory();
      });
  }

  unlock(element:any){
    console.log(this.showHideApprovalPassDialogue);
    if (this.showHideApprovalPassDialogue) {
      const dialogRef = this.dialog.open(PayrollApprovalDialogComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: {}
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          if (result === 'success') {
            this.serviceApi.put('/v1/payroll/runPayroll/unlockPayroll/' + element.runPayrollId, null)
              .subscribe(
              res => {
                if (res != null) {
                  console.log('Enter Successfully Makes Un Hold');
                  this.action = 'Response';
                  this.error = res.message;
                  this.getPayrollProcessHistory();
                  this.successNotification(this.error);
                }
              }, err => {
                console.log('there is something error.....  ' + err.message);
                this.action = 'Error';
                this.error = err.message;
              }, () => {

              });
          }
        }
      });
    } else {
      this.serviceApi.put('/v1/payroll/runPayroll/unlockPayroll/' + element.runPayrollId, null)
        .subscribe(
        res => {
          if (res != null) {
            console.log('Enter Successfully Makes Un Hold');
            this.action = 'Response';
            this.error = res.message;
            this.getPayrollProcessHistory();
            this.successNotification(this.error);
          }
        }, err => {
          console.log('there is something error.....  ' + err.message);
          this.action = 'Error';
          this.error = err.message;
        }, () => {

        });
    }
  }



  checkMonthChecker(data: any) {
    console.log(data);
    if (data === '01') {
      return 'JANUARY';
    } else if (data === '02') {
      return 'FEBRUARY';
    } else if (data === '03') {
      return 'MARCH';
    } else if (data === '04') {
      return 'APRIL';
    } else if (data === '05') {
      return 'MAY';
    } else if (data === '06') {
      return 'JUNE';
    } else if (data === '07') {
      return 'JULY';
    } else if (data === '08') {
      return 'AUGUST';
    } else if (data === '09') {
      return 'SEPTEMBER';
    } else if (data === '10') {
      return 'OCTOBER';
    } else if (data === '11') {
      return 'NOVEMBER';
    } else if (data === '12') {
      return 'DECEMBER';
    }
  }

  getALLPayrollHistory() {
    this.payrollMonthHistoryList = [];
    console.log('Enter to Get all Payroll History');
    // this.serviceApi.get('/v1/payroll/runpayroll/history/').subscribe(
    //   res => {
    //     if (res != null) {
    //       res.forEach(element => {
    //         let pendingEmployees;
    //         let onHoldmployees;
    //         let fNfemployees;
    //         let processedEployees;
    //         if (element.payrollDetailsVO != null) {
    //           processedEployees = element.payrollDetailsVO.processedEmployeeCount;
    //           fNfemployees = element.payrollDetailsVO.fnfEmployeeCount;
    //           pendingEmployees = element.payrollDetailsVO.pendingEmployeeCount;
    //           onHoldmployees = element.payrollDetailsVO.onHoldEmployeeCount;
    //         } else {
    //         }

    //         const showDate = element.payrollProcessedDate.split('/');
    //         const monthName = this.checkMonthChecker(showDate[1]);
    //         this.payrollMonthHistoryList.push({
    //           payrollProcessedDate: element.payrollProcessedDate,
    //           payrollParocessViewDate: monthName + ',' + ' ' + showDate[2],
    //           payrollRunDate: element.payrollRunDate,
    //           totalCoveredEmployee: element.totalCoveredEmployee,
    //           runPayrollStatus: element.runPayrollStatus,
    //           payrollDetailsVO: element.payrollDetailsVO,
    //           totalGrossedPay: element.totalGrossedPay,
    //           processedEployees: processedEployees,
    //           fNfemployees: fNfemployees,
    //           pendingEmployees: pendingEmployees,
    //           onHoldmployees: onHoldmployees,
    //           actionId: '',
    //         });
    //       });
    //       this.dataSource = new MatTableDataSource<Element>(this.payrollMonthHistoryList);
    //     }
    //   }, err => {

    //   }, () => {

    //   });
  }

  getLeaveGeneralSettings() {
    // this.serviceApi.get('/v1/payroll/settings/general').subscribe(
    //   res => {
    //     const loginEmpCode = KeycloakService.getUsername();
    //     const payrollApprover = res.payrollApproverEmpCode.split('-');
    //     const p = payrollApprover[1].trim();
    //     if (loginEmpCode === p) {
    //       this.approverStatus = true;
    //     } else {
    //     }
    //   });
  }

  selectMonthYearDialog() {
    console.log('Select Month Year Dialog-->');
    const dialogRef = this.dialog.open(PayrollMonthYearComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log('The dialog was closed');
    });
  }

  approveRunningPayroll(element: any) {
    console.log('Rn Payroll On Approver-->' + element);
    const dialogRef = this.dialog.open(ApproverRunningPayrollDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { data: element }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log('The dialog was closed');
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          console.log('Result value ..... ' + result.message);
          if (result.status === 'Response') {
            this.notificationMsg = result.message;
            this.successNotification(this.notificationMsg);
          }
          // tslint:disable-next-line:one-line
          else if (result.status === 'Error') {
            this.notificationMsg = result.message;
            // this.warningNotification(this.notificationMsg);
          }
        }
        // tslint:disable-next-line:one-line
        this.getALLPayrollHistory();
      }
    });
  }
  rejectRunningPayroll(element: any) {
    console.log('Rn Payroll On Approver-->' + element);
    const dialogRef = this.dialog.open(RejectRunningPayrollDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { data: element }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log('The dialog was closed');
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          console.log('Result value ..... ' + result.message);
          if (result.status === 'Response') {
            this.notificationMsg = result.message;
            this.successNotification(this.notificationMsg);
          }
          // tslint:disable-next-line:one-line
          else if (result.status === 'Error') {
            this.notificationMsg = result.message;
            // this.warningNotification(this.notificationMsg);
          }
        }
        // tslint:disable-next-line:one-line
        this.getALLPayrollHistory();
      }
    });
  }

  generateSalaryRegister(data: any) {
    console.log('Employee On Delete-->' + data);
    const dialogRef = this.dialog.open(GeneratePayrollComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log('The dialog was closed');
      console.log('The dialog was closed');
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          console.log('Result value ..... ' + result.message);
          if (result.status === 'Response') {
            this.notificationMsg = result.message;
            this.successNotification(this.notificationMsg);
          }
          // tslint:disable-next-line:one-line
          else if (result.status === 'Error') {
            this.notificationMsg = result.message;
            // this.warningNotification(this.notificationMsg);
          }
        }
        // tslint:disable-next-line:one-line
        this.getALLPayrollHistory();
      }
    });

  }

  uploadPriviousMonthSalary(data: any) {
    console.log('Employee On Delete-->' + data);
    const dialogRef = this.dialog.open(UploadPriviousMonthSalaryComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      // data: { actionId: data.actionId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  editPayrollRecord(data: any) {
      const date = new Date(moment(data.payrollProcessedDate, 'DD/MM/YYYY').toString());
      console.log('month -->' + date.getMonth());
      const monthName = this.monthList[date.getMonth()];
      this.router.navigate(['/payroll/payroll-monthly/' + monthName + '/' + date.getFullYear()]);
  }

  deletePayrollRecord(data: any) {
    console.log('Employee On Delete-->' + data);
    const dialogRef = this.dialog.open(DeletePayrollDetailsComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { id: data.runPayrollId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          console.log('Result value ..... ' + result.message);
          if (result.status === 'Response') {
            this.notificationMsg = result.message;
            this.successNotification(this.notificationMsg);
          }
          // tslint:disable-next-line:one-line
          else if (result.status === 'Error') {
            this.notificationMsg = result.message;
            // this.warningNotification(this.notificationMsg);
          }
        }
        // tslint:disable-next-line:one-line
        this.getPayrollProcessHistory();
      }
    });
  }

  payrollUnlockFunction(element: any) {
  
      console.log('Employee On Delete-->' + element);
      const dialogRef = this.dialog.open(GeneratedPayrollLockComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: { data: element }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result !== undefined) {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            console.log('Result value ..... ' + result.message);
            if (result.status === 'Response') {
              this.notificationMsg = result.message;
              this.successNotification(this.notificationMsg);
            }
            // tslint:disable-next-line:one-line
            else if (result.status === 'Error') {
              this.notificationMsg = result.message;
              // this.warningNotification(this.notificationMsg);
            }
          }
          // tslint:disable-next-line:one-line
          this.getPayrollProcessHistory();
        }
      });
  }

  ngAfterViewInit() {
    // this.dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }
  applyFilter(filterValue: string) {
    console.log('hello' + filterValue);
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}


// ---------------- Generate Payroll By Clicking Generate Payroll model start ------------------------
@Component({
  templateUrl: 'generate-payroll-dialog-component.html',
  styleUrls: ['payroll-dialog-model.scss']
})
export class GeneratePayrollComponent implements OnInit {
  monthList = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

  action: any;
  error = 'Error Message';
  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<GeneratePayrollComponent>,
    private serviceApi: ApiCommonService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('data-->' + data);
  }

  ngOnInit() {
  }



  generatePayrollExcel() {
    const date = new Date(moment(this.data.payrollProcessedDate, 'DD/MM/YYYY').toString());
    console.log('month -->' + date.getMonth());
    const monthName = this.monthList[date.getMonth()];
    // https://stackoverflow.com/questions/43276726/how-to-properly-download-excel-file-with-angular2
    this.serviceApi.get2('/v1/payroll/runpayroll/generatePayrollReportExcel/' + monthName + '/' + date.getFullYear())
      .subscribe(
      res => {
        console.log('res ==>');
        console.log(res);
        console.log('start download:', res.url);
        const url = window.open(environment.storageServiceBaseUrl + res.url);
        // const a = document.createElement('a');
        // document.body.appendChild(a);
        // a.setAttribute('style', 'display: none');
        // a.href = url;
        // a.download = res.filename;
        // a.click();
        // window.URL.revokeObjectURL(url);
        // a.remove(); // remove the element
        // this.action = 'Response';
        // this.error = 'Excel generate successfully';
      },
      err => {
        console.log('download error:', JSON.stringify(err));
      },
      () => {
        console.log('Generate Excel Execute Successfully');
        this.close();
      }
      );

  }

  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }



  onNoClick() {
    this.dialogRef.close();
  }
}
// ---------------------- End Of Generate Payroll model end ------------------------..


@Component({
  templateUrl: 'approveRunPayroll.dialog.component.html',
  styleUrls: ['payroll-dialog-model.scss']
})
export class ApproverRunningPayrollDialogComponent implements OnInit {

  dataValue: any;
  error = 'Error Message';
  action: any;


  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<ApproverRunningPayrollDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    console.log('data-->' + data);
    this.dataValue = data.data;
  }

  ngOnInit() {
  }

  approveConfirm() {
    console.log(' >>>>> Request For Delete Record data ---->' + this.data);
    const val = this.dataValue.payrollProcessedDate;
    const body = this.dataValue;
    const status = 'COMPLETE_APPROVED';
    console.log('>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<</v1/payroll/runpayroll/rejectionOrApprover/01%2F04%2F2018/Approved ' + val);
    this.serviceApi.post('/v1/payroll/runpayroll/rejectionOrApprover/' + status, body)
      .subscribe(
      res => {
        if (res != null) {
          console.log('Enter Successfully Makes Un Hold');
          this.action = 'Response';
          this.error = res.message;
          this.close();
        }

      }, err => {
        console.log('there is something error.....  ' + err.message);
        this.action = 'Error';
        this.error = err.message;
        this.close();
      }, () => {

      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }

}


//
@Component({
  templateUrl: 'rejectRunPayroll.dialog.component.html',
  styleUrls: ['payroll-dialog-model.scss']
})
export class RejectRunningPayrollDialogComponent implements OnInit {

  dataValue: any;
  error = 'Error Message';
  action: any;


  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<RejectRunningPayrollDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    console.log('data-->' + data);
    this.dataValue = data;
  }

  ngOnInit() {
  }

  rejectConfirm() {
    console.log(' >>>>> Request For Delete Record data ---->' + this.data.actionId);
    const val = this.dataValue.payrollProcessedDate;
    const body = this.dataValue.data;
    const status = 'COMPLETE_REJECTED';
    console.log('>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<< ' + body);
    this.serviceApi.post('/v1/payroll/runpayroll/rejectionOrApprover/' + status, body)
      .subscribe(
      res => {
        if (res != null) {
          console.log('Enter Successfully Rejection');
          this.action = 'Response';
          this.error = res.message;
          this.close();
        }

      }, err => {
        console.log('there is something error.....  ' + err.message);
        this.action = 'Error';
        this.error = err.message;
        this.close();
      }, () => {
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
}
// 
// ---------------- Upload Previous Month Salary model start ------------------------
@Component({
  templateUrl: 'upload-monthly-salary-component.html',
  styleUrls: ['payroll-dialog-model.scss']
})
export class UploadPriviousMonthSalaryComponent implements OnInit {
  fileToUpload: File = null;
  groupByList = [
    { value: 'Employees', viewValue: 'Employees' },
    { value: 'Gender', viewValue: 'Gender' },
    { value: 'Marital Status', viewValue: 'Marital Status' },
    { value: 'Work Location', viewValue: 'Work Location' },
    { value: 'Blood Group', viewValue: 'Blood Group' },
    { value: 'Cost Center', viewValue: 'Cost Center' }
  ];

  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<UploadPriviousMonthSalaryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('data-->' + data);
  }

  ngOnInit() {
  }

  onDelete(value: any) {
    console.log(' >>>>> Request For Delete Record data ---->' + this.data.actionId);
    const val = this.data.actionId;
    console.log('>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<< ' + val);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    //alert('File we have to Upload :' + this.fileToUpload);
  }
}
// ---------------------- Upload Previous Month Salary model end ------------------------


// ---------------- Payroll Details delete model start ------------------------
@Component({
  templateUrl: 'payroll-delete-dialog.html',
  styleUrls: ['payroll-dialog-model.scss']
})
export class DeletePayrollDetailsComponent implements OnInit {

  dataValue: any;
  error = 'Error Message';
  action: any;

  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<DeletePayrollDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    console.log('data-->' + data);
    this.dataValue = data;
  }

  ngOnInit() {
  }

  deletePayrollRecordFromDB() {
    console.log(' >>>>> Request For Delete Record data ---->' + this.data.id);
    // const val = this.dataValue.payrollProcessedDate;
    // const body = this.dataValue.data;

    this.serviceApi.delete('/v1/payroll/runPayroll/deletePayroll/' + this.dataValue.id)
      .subscribe(
      res => {
        console.log('record save===' + res);
        this.action = 'Response';
        this.error = res.message;
        this.close()
      },
      err => {
        console.log('there is something error');
        this.action = 'Error';
        this.error = err.message;
      }
      );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
}
// ---------------------- Fixed Allowance delete model end ------------------------


@Component({
  templateUrl: 'generated-payroll-lock.html',
  styleUrls: ['payroll-dialog-model.scss']
})
export class GeneratedPayrollLockComponent implements OnInit {

  dataValue: any;
  error = 'Error Message';
  action: any;

  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<GeneratedPayrollLockComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    console.log('data-->' + data);
    this.dataValue = data;
  }

  ngOnInit() {
  }

  unlockConfirm() {
    console.log(' >>>>> Request For Delete Record data ---->' + this.dataValue.runPayrollId);
    const runPayrollId = this.dataValue.runPayrollId;
     this.serviceApi.put('/v1/payroll/runPayroll/unlockPayroll/'+runPayrollId, null)
      .subscribe(
      res => {
        if (res != null) {
          console.log('Payroll successfully unlock');
          this.action = 'Response';
          this.error = res.message;
          this.close();
        }

      }, err => {
        console.log('there is something error.....  ' + err.message);
        this.action = 'Error';
        this.error = err.message;
        // this.close();
      }, () => {
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }


}




// @Component({
//   templateUrl: 'approveRunPayroll.dialog.component.html',
//   styleUrls: ['payroll-dialog-model.scss']
// })
// export class ApproverRunningPayrollDialogComponent implements OnInit {

//   dataValue: any;
//   error = 'Error Message';
//   action: any;


//   constructor(
//     private _fb: FormBuilder,
//     public dialogRef: MatDialogRef<ApproverRunningPayrollDialogComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
//     console.log('data-->' + data);
//     this.dataValue = data.data;
//   }

//   ngOnInit() {
//   }

//   approveConfirm() {
//     console.log(' >>>>> Request For Delete Record data ---->' + this.data);
//     const val = this.dataValue.payrollProcessedDate;
//     const body = this.dataValue;
//     const status = 'COMPLETE_APPROVED';
//     console.log('>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<' + val);
//     this.serviceApi.post('/v1/payroll/runpayroll/rejectionOrApprover/' + status, body)
//      .subscribe(
//       res => {
//         if (res != null) {
//           console.log('Enter Successfully Makes Un Hold');
//           this.action = 'Response';
//           this.error = res.message;
//           this.close();
//         }

//       }, err => {
//         console.log('there is something error.....  ' + err.message);
//         this.action = 'Error';
//         this.error = err.message;
//         this.close();
//       }, () => {

//       });
//   }

//   onNoClick(): void {
//     this.dialogRef.close();
//   }
//   close(): void {
//     this.data.message = this.error;
//     this.data.status = this.action;
//     this.dialogRef.close(this.data);
//   }

// }

@Component({
  templateUrl: 'payroll-monthYear-dialog.html',
  styleUrls: ['payroll-monthYear-dialog.scss']
})
export class PayrollMonthYearComponent implements OnInit {
  monthList = ['', 'JANUARY', 'FEBRUARY', 'MARCH',
    'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
  monthYear = new FormControl();
  year: number;
  month: string;
  action: string;
  error: any;
  constructor(
    private _fb: FormBuilder,
    private router: Router,
    public dialogRef: MatDialogRef<PayrollMonthYearComponent>,
    private serviceApi: ApiCommonService
  ) {
  }

  ngOnInit() {

  }

  selectMonthYear() {
    console.log(' >>>>>   monthYear ---->' + this.monthYear);
    const value1: string = this.monthYear.value;
    let monthYear = value1.split('-');

    this.year = +monthYear[0];
    let month = +monthYear[1];
    this.month = this.monthList[month];
    let monthYearData = this.month + "-" + this.year;

    this.serviceApi.post('/v1/payroll/runPayroll/' + monthYearData, null).subscribe(
      res => {
        if (res != null) {
          console.log('Payroll successfully cancelled');
          this.action = 'Response';
          this.router.navigate(['/payroll/payroll-monthly/' + this.month + '/' + this.year + '/' + res]);
          this.dialogRef.close();
        }
      }, err => {
        console.log('there is something error.....  ' + err.message);
        this.action = 'Error';
        this.error = err.message;
        this.dialogRef.close();
        // this.warningNotification(this.error);
      }, () => {
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

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  templateUrl: 'payrollApproval-dialog.component.html',
})
export class PayrollApprovalDialogComponent implements OnInit {
  actions: any;
  error: any;
  message
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
  password: any;
  constructor(public dialogRef: MatDialogRef<PayrollApprovalDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService, private fb: FormBuilder, ) { }

  ngOnInit() { }

  validate() {

    console.log(this.password);
    const body = {
      "password": this.password
    };

    this.serviceApi.post('/v1/payroll/runPayroll/validatePassword', body).subscribe(
      res => {
        this.dialogRef.close("success");
      }, err => {
        console.log('there is something error.....  ' + err.message);
        this.actions = 'Error';
        this.error = err.message;
        // this.warningNotification(this.error);
      }, () => {
      }
    );

  }

  close(): void {
    this.data.message = this.message;
    this.data.status = this.actions;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    console.log(this.data);
    this.dialogRef.close(this.data);
  }
}



export interface Element {
  payrollProcessedDate: string;
  payrollRunDate: string;
  totalCoveredEmployee: string;
  runPayrollStatus: string;
  payrollDetailsVO: any;

  processedEployees: string;
  fNfemployees: string;
  pendingEmployees: string;
  onHoldmployees: string;

  totalGrossedPay: string;
  actionId: any;
}


