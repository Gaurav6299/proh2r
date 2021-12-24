import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { DataTable, SelectItem } from 'primeng/primeng';
import { ExpensesService } from '../../../../expenses.service';
import { ApiCommonService } from '../../../../../../app/services/api-common.service';
import { KeycloakService } from '../../../../../keycloak/keycloak.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../../../environments/environment';
declare var $: any;

@Component({
  selector: 'app-pending-expenses',
  templateUrl: './pending-expenses.component.html',
  styleUrls: ['./pending-expenses.component.scss']
})
export class PendingExpensesComponent implements OnInit {
  @ViewChild("dt1") dt: DataTable;
  @Output() messageEvent = new EventEmitter<string>();
  workLocations: SelectItem[] = [];
  bands: SelectItem[] = [];
  departments: SelectItem[] = [];
  designations: SelectItem[] = [];
  bulkActions: any;
  commentList: any;
  id: any;
  status: any;
  totalReimbursable: any;
  title: any;
  totalBillable: any;
  submittedOn: any;
  advanceReceived: any;
  panelFirstWidth: any;
  panelFirstHeight: any;
  pendingRequest = [];
  expRecords = [];
  templateList = [];
  categoryList = [];
  checkedRowData = [];
  action: any;
  notificationMsg: any;
  expStatus: any;
  selectedRows = [];
  filterByEmp: SelectItem[] = [];
  filterByStatus: SelectItem[] = [];
  locationLabel: any = environment.tenantId=='26' ? 'HQ Location':'Location';
  expenseStatus = [
    { statusName: 'Level 1 Approval Pending', statusValue: 'LEVEL1PENDING' },
    { statusName: 'Level 2 Approval Pending', statusValue: 'LEVEL2PENDING' },
    { statusName: 'Level 1 Cancellation Pending', statusValue: 'LEVEL1CANCEL' },
    { statusName: 'Level 2 Cancellation Pending', statusValue: 'LEVEL2CANCEL' },
    { statusName: 'Approved', statusValue: 'APPROVED' },
    { statusName: 'Cancelled', statusValue: 'CANCELLED' },
    { statusName: 'Rejected', statusValue: 'REJECTED' },
    { statusName: 'Deleted', statusValue: 'DELETED' }];

  columns = [
    { field: 'expenseReportName', header: 'Report Title' },
    { field: 'empName', header: 'Employee Name' },
    { field: 'location', header: this.locationLabel },
    { field: 'band', header: 'Band' },
    { field: 'department', header: 'Department' },
    { field: 'designation', header: 'Designation' },
    { field: 'totalAmount', header: 'Total Amount' },
    { field: 'advanceAmount', header: 'Advance Received' },
    { field: 'reimburseAmount', header: 'Reimbursable' },
    { field: 'billableAmount', header: 'Billable' },
    { field: 'expenseStatus', header: 'Status' },
    { field: 'actions', header: 'Actions' }
  ]
  selection = new SelectionModel<Element>(true, []);
  constructor(private service: ExpensesService, public dialog: MatDialog, private serviceApi: ApiCommonService) {
    var rolesArr = KeycloakService.getUserRole();
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
  onChangebulkActions(value: any) {
    console.log(this.selectedRows)
    if (value === 'approveMultipleRequest') {
      if (this.checkedRowData.length > 0) {
        let dialogRef = this.dialog.open(ApproveRejectMultipleRequestDialogComponent, {
          width: '500px',
          panelClass: 'custom-dialog-container',
          data: {
            reqType: 'approveMultiple',
            checkedRowData: this.checkedRowData
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          if (result !== undefined) {
            if (result.status === 'Response') {
              console.log(result);
              this.notificationMsg = result.message;
              this.selection.clear();
              this.checkedRowData = [];
              this.successNotification(this.notificationMsg);
              this.messageEvent.emit();
            } else if (result.status === 'Error') {
              this.notificationMsg = result.message;
            }
          }
        });
      } else {
        this.checkedRowData = [];
        this.selection.clear();
        this.warningNotification('Select a report first');
      }
    }
    if (value === 'rejectMultiple') {
      let dialogRef = this.dialog.open(ApproveRejectMultipleRequestDialogComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: value
      });
    }
  }
  ngOnInit() {
    this.service.getExpensePendingRequest().subscribe((data) => {
      if (data != null) {
        this.pendingRequest = [];
        data.forEach(element => {
          let found1 = this.workLocations.filter(obj => obj.value === element.location)
          if (!found1.length) {
            this.workLocations.push({ label: element.location, value: element.location })
          }

          let found2 = this.bands.filter(obj => obj.value === element.band)
          if (!found2.length) {
            this.bands.push({ label: element.band, value: element.band })
          }

          let found3 = this.departments.filter(obj => obj.value === element.department)
          if (!found3.length) {
            this.departments.push({ label: element.department, value: element.department })
          }

          let found4 = this.designations.filter(obj => obj.value === element.designation)
          if (!found4.length) {
            this.designations.push({ label: element.designation, value: element.designation })
          }

          this.expStatus = '';
          this.expenseStatus.forEach(statusInfo => {
            if (element.expenseStatus === statusInfo.statusValue) {
              this.expStatus = statusInfo.statusName;
            }
          });
          if (!this.filterByEmp.some(empName => empName.label === element.empName)) {
            this.filterByEmp.push({
              label: element.empName, value: element.empName
            });
          }
          let expensesList = [];
          element.expensesList.forEach(element1 => {
            let expensesFieldList = [];
            element1.expensesFieldList.forEach(element2 => {
              expensesFieldList.push({
                "expensesFieldId": element2.expensesFieldId,
                "fieldName": element2.fieldName,
                "fieldValue": element2.fieldValue
              })
            });

            expensesList.push({
              "expensesId": element1.expensesId,
              "expenseName": element1.expenseName,
              "amount": element1.amount,
              "isReImbursable": element1.isReImbursable,
              "isBillable": element1.isBillable,
              "expenseComments": element1.expenseComments,
              "expenseReason": element1.expenseReason,
              "expenseAttachment": element1.expenseAttachment,
              "expenseAttachmentId": element1.expenseAttachmentId,
              "expenseIncurredDate": element1.expenseIncurredDate,
              "templateCategoryId": element1.templateCategoryId,
              "expensesFieldList": expensesFieldList
            });
          });
          this.pendingRequest.push({
            "expenseRepId": element.expenseId,
            "empCode": element.empCode,
            "expenseReportName": element.expenseReportName,
            "totalAmount": element.totalAmount,
            "reimburseAmount": element.reimburseAmount,
            "billableAmount": element.billableAmount,
            "advanceAmount": element.advanceAmount,
            "expenseStatus": this.expStatus,
            "empName": element.empName,
            "location": element.location,
            "band": element.band,
            "department": element.department,
            "designation": element.designation,
            "expensesList": expensesList

          });
        });
        this.dt.reset();
      }
    });
    // this.serviceApi.get('/v1/advance/application/get/advance/expense/data?empCode=' + KeycloakService.getUsername()).subscribe(res => {
    //   if (res.shouldAdvanceAmountFlowToExpense == false) {
    //     this.columns.splice(this.columns.findIndex(val => val.field=='advanceAmount'),1);
    //   }
    // })
  }
  showHistoryDialog(expDetails: any) {
    let dialogRef = this.dialog.open(ShowExpensePendingHistoryDialogComponent, {
      width: '700px',
      panelClass: 'custom-dialog-container',
      data: expDetails,
    });
  }
  showExpenseReport(expId: any) {
    this.id = expId;
    this.pendingRequest.forEach(element => {
      if (element.expReportId === expId) {
        this.status = element.status;
        this.totalReimbursable = element.totalReimbursable;
        this.title = element.title;
        this.totalBillable = element.totalBillable;
        this.submittedOn = element.submittedOn;
        this.advanceReceived = element.advanceReceived;
      }
    });
  }
  approveSingleExpense(expId: any) {
      this.action = '';
      console.log('Inside Bulk Reject');
      const dialogRef = this.dialog.open(ApproveSingleExpense, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: { expId: expId, message: this.notificationMsg, status: this.action }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            console.log('Result value ..... ' + result.message);
            if (result.status === 'Response') {
              this.notificationMsg = result.message;
              this.successNotification(this.notificationMsg);
              this.messageEvent.emit();
            }
            else if (result.status === 'Error') {
              this.notificationMsg = result.message;
            }
          }
        }
      });
  }
  rejectSingleExpense(expId: any) {
      this.action = '';
      console.log('Inside Bulk Reject');
      const dialogRef = this.dialog.open(RejectSingleExpense, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: { expId: expId, message: this.notificationMsg, status: this.action }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result !== undefined) {
            console.log('Result value ..... ' + JSON.stringify(result));
            if (result.message) {
              console.log('Result value ..... ' + result.message);
              if (result.status === 'Response') {
                this.notificationMsg = result.message;
                this.successNotification(this.notificationMsg);
                this.messageEvent.emit();
              }
              else if (result.status === 'Error') {
                this.notificationMsg = result.message;
              }
            }
          }
        }
      });
  }
}

@Component({
  templateUrl: 'show-history-dialog.html',
})
export class ShowExpensePendingHistoryDialogComponent {
  expensesList = [];
  expenseReport = [];
  @ViewChild("dt1") dt: DataTable;
  dataColumns = [
    { field: 'expenseIncurredDate', header: 'Incurred Date' },
    { field: 'expenseName', header: 'Category' },
    { field: 'amount', header: 'Amount' },
    { field: 'isReImbursable', header: 'Reimbursable' },
    { field: 'isBillable', header: 'Billable' },
    { field: 'expenseAttachment', header: 'Attachment' },
    { field: 'actions', header: 'Actions' }
  ]
  shouldAdvanceAmountFlowToExpense: any = false;
  constructor(
    private _fb: FormBuilder,
    public innerDialog: MatDialog,
    public dialogRef: MatDialogRef<ShowExpensePendingHistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {

    this.data.expensesList.forEach(element => {
      let expensesFieldList = [];
      element.expensesFieldList.forEach(element2 => {
        expensesFieldList.push({
          "expensesFieldId": element2.expensesFieldId,
          "fieldName": element2.fieldName,
          "fieldValue": element2.fieldValue
        })
      });
      this.expensesList.push({
        "expensesId": element.expensesId,
        "expenseName": element.expenseName,
        "amount": element.amount,
        "isReImbursable": element.isReImbursable,
        "isBillable": element.isBillable,
        "expenseComments": element.expenseComments,
        "expenseReason": element.expenseReason,
        "expenseAttachment": element.expenseAttachment,
        "expenseAttachmentId": element.expenseAttachmentId,
        "expenseIncurredDate": element.expenseIncurredDate,
        "templateCategoryId": element.templateCategoryId,
        "expensesFieldList": expensesFieldList
      });
    });
    this.serviceApi.get('/v1/advance/application/get/advance/expense/data?empCode=' + KeycloakService.getUsername()).subscribe(res => {
      this.shouldAdvanceAmountFlowToExpense = res.shouldAdvanceAmountFlowToExpense
    })
  }

  showHistoryDialog(element: any) {
    let dialogRef = this.innerDialog.open(ShowExpensePendingDialogComponent, {
      width: '700px',
      panelClass: 'custom-dialog-container',
      data: element,
    });
  }

  download(data: any) {
    window.location.href = environment.storageServiceBaseUrl + data.expenseAttachmentId;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  templateUrl: 'show-expense-dialog.html',
})
export class ShowExpensePendingDialogComponent {
  constructor(public innerDialog: MatDialog,
    public dialogRef: MatDialogRef<ShowExpensePendingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  download() {
    window.location.href = environment.storageServiceBaseUrl + this.data.expenseAttachmentId;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
@Component({
  templateUrl: './approve-single-expense.html',
})
export class ApproveSingleExpense implements OnInit {
  action: any;
  error: any;
  approveSingleExpApplication: FormGroup;
  constructor(public dialogRef: MatDialogRef<ApproveSingleExpense>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder, private serviceApi: ApiCommonService) {
    this.approveSingleExpApplication = this._fb.group(
      {
        usrComment: ['', Validators.required],
      });
  }
  approveAppliation() {
    if (this.approveSingleExpApplication.valid) {
      console.log('Comment Value.......' + this.approveSingleExpApplication.controls.usrComment.value);
      return this.serviceApi.put('/v1/expense/application/admin/' + this.data.expId + '/action?action=APPROVE&&comments=' + this.approveSingleExpApplication.controls.usrComment.value, null).
        subscribe(
          res => {
            console.log('Approve Successfully...' + JSON.stringify(res));
            this.action = 'Response';
            this.error = res.message;
            this.close();
          },
          err => {
            console.log('there is something error.....  ' + err.message);
            this.action = 'Error';
            this.error = err.message;
            this.close();
          });
    } else {

      Object.keys(this.approveSingleExpApplication.controls).forEach(field => {
        const control = this.approveSingleExpApplication.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }
  ngOnInit() {
  }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    this.dialogRef.close(this.data);
  }
}
@Component({
  templateUrl: './reject-single-exp-request.html',
})
export class RejectSingleExpense implements OnInit {
  action: any;
  error: any;
  rejectSingleApplication: FormGroup;
  leaveId: any;
  constructor(public dialogRef: MatDialogRef<RejectSingleExpense>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder, private serviceApi: ApiCommonService) {
    this.rejectSingleApplication = this._fb.group(
      {
        usrComment: ['', Validators.required],
      });
  }
  rejectRequest() {
    if (this.rejectSingleApplication.valid) {
      console.log('Comment Value.......' + this.rejectSingleApplication.controls.usrComment.value);
      return this.serviceApi.put('/v1/expense/application/admin/' + this.data.expId + '/action?action=REJECT&&comments=' + this.rejectSingleApplication.controls.usrComment.value, null).
        subscribe(
          res => {
            console.log('Applied Leave Successfully...' + JSON.stringify(res));
            this.action = 'Response';
            this.error = res.message;
            this.close();
          },
          err => {
            console.log('there is something error.....  ' + err.message);
            this.action = 'Error';
            this.error = err.message;
            this.close();
          });
    }
    else {
      Object.keys(this.rejectSingleApplication.controls).forEach(field => { // {1}
        const control = this.rejectSingleApplication.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }

  }
  ngOnInit() {

  }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    this.dialogRef.close(this.data);
  }
}
@Component({
  templateUrl: 'approve-reject-multiple-request.html',
})
export class ApproveRejectMultipleRequestDialogComponent {
  requestType: any;
  action: any;
  error: any;
  checkedRowData = [];
  multiActionDialog: FormGroup;
  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<ApproveRejectMultipleRequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    console.log('Request Type ----- ' + this.checkedRowData);
    this.requestType = data.reqType;
    data.checkedRowData.forEach(element => {
      this.checkedRowData.push(element.expenseRepId);
    });
    this.multiActionDialog = this._fb.group({
      usrComment: ['', Validators.required]
    });
  }
  ngOnInit() {
  }
  approveMultiRequest() {
    if (this.multiActionDialog.valid) {
      console.log('Comment Value.......' + this.multiActionDialog.controls.usrComment.value);
      console.log('Comment Value.......' + this.multiActionDialog.controls.usrComment.value);
      const body = {
        "action": "APPROVE",
        "comment": this.multiActionDialog.controls.usrComment.value,
        "reqIds": this.checkedRowData,
      }
      this.serviceApi.put('/v1/expense/application/bulkAction', body).subscribe(
        res => {
          console.log('Applied Leave Successfully...' + JSON.stringify(res));
          this.action = 'Response';
          this.error = res.message;
          this.close();
        },
        err => {
          console.log('there is something error.....  ' + err.message);
          this.action = 'Error';
          this.error = err.message;
          this.close();
        });
    }
  }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}


