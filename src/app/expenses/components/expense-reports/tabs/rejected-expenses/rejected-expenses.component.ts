import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { DataTable, SelectItem } from 'primeng/primeng';
import { ExpensesService } from '../../../../expenses.service';
import { ApiCommonService } from '../../../../../../app/services/api-common.service';
import { KeycloakService } from '../../../../../keycloak/keycloak.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { environment } from '../../../../../../environments/environment';
declare var $: any;

@Component({
  selector: 'app-rejected-expenses',
  templateUrl: './rejected-expenses.component.html',
  styleUrls: ['./rejected-expenses.component.scss']
})

export class RejectedExpensesComponent implements OnInit {
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
  rejectedRequest = [];
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
  ngOnInit() {
    this.service.getExpenseRejectedRequest().subscribe((data) => {
      if (data != null) {
        this.rejectedRequest = [];
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
          this.rejectedRequest.push({
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
    // });
  }
  showHistoryDialog(expDetails: any) {
    let dialogRef = this.dialog.open(ShowExpenseRejectedHistoryDialogComponent, {
      width: '700px',
      panelClass: 'custom-dialog-container',
      data: expDetails,
    });
  }
  showExpenseReport(expId: any) {
    this.id = expId;
    this.rejectedRequest.forEach(element => {
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
}

@Component({
  templateUrl: 'show-history-dialog.html',
})
export class ShowExpenseRejectedHistoryDialogComponent {
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
    public innerDialog: MatDialog,
    public dialogRef: MatDialogRef<ShowExpenseRejectedHistoryDialogComponent>,
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
    let dialogRef = this.innerDialog.open(ShowExpenseRejectedDialogComponent, {
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
export class ShowExpenseRejectedDialogComponent {
  constructor(public innerDialog: MatDialog,
    public dialogRef: MatDialogRef<ShowExpenseRejectedDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }
  download() {
    window.location.href = environment.storageServiceBaseUrl + this.data.expenseAttachmentId;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
