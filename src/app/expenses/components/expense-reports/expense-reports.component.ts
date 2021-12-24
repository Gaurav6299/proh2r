import { Component, OnInit, Inject, Input, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatCheckboxChange, MatCheckbox } from '@angular/material';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Http } from '@angular/http';
import { SelectionModel } from '@angular/cdk/collections';
import { ApiCommonService } from '../../../../app/services/api-common.service';
import { KeycloakService } from '../../../keycloak/keycloak.service';
import { DataTable, SelectItem } from 'primeng/primeng';
import { environment } from '../../../../environments/environment';
import { delay } from 'rxjs/operators';
import { ExpensesService } from '../../expenses.service';
declare var $: any;
@Component({
  selector: 'app-expense-reports',
  templateUrl: './expense-reports.component.html',
  styleUrls: ['./expense-reports.component.scss']
})
export class ExpenseReportsComponent implements OnInit {
  @ViewChild("dt1") dt: DataTable;
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
  expReports = [];
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
  expenseStatus = [
    { statusName: 'Level 1 Approval Pending', statusValue: 'LEVEL1PENDING' },
    { statusName: 'Level 2 Approval Pending', statusValue: 'LEVEL2PENDING' },
    { statusName: 'Level 1 Cancellation Pending', statusValue: 'LEVEL1CANCEL' },
    { statusName: 'Level 2 Cancellation Pending', statusValue: 'LEVEL2CANCEL' },
    { statusName: 'Approved', statusValue: 'APPROVED' },
    { statusName: 'Cancelled', statusValue: 'CANCELLED' },
    { statusName: 'Rejected', statusValue: 'REJECTED' },
    { statusName: 'Deleted', statusValue: 'DELETED' }];
  displayedColumns = ['select', 'reportTitle', 'employeeName', 'submittedOn', 'reimbursable', 'billable', 'status', 'actions'];

  columns = [
    { field: 'expenseReportName', header: 'Report Title' },
    { field: 'empName', header: 'Employee Name' },
    { field: 'location', header: 'Location' },
    { field: 'band', header: 'Band' },
    { field: 'department', header: 'Department' },
    { field: 'designation', header: 'Designation' },
    { field: 'reimburseAmount', header: 'Reimbursable' },
    { field: 'billableAmount', header: 'Billable' },
    { field: 'expenseStatus', header: 'Status' },
    { field: 'actions', header: 'Actions' }
  ]
  dataSource: MatTableDataSource<Element>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns1 = ['expId', 'date', 'category', 'merchant', 'amount', 'status', 'receipt', 'actions'];
  dataSource1 = new MatTableDataSource<Element1>(ELEMENT_DATA1);
  selection = new SelectionModel<Element>(true, []);
  isLeftVisible: any;
  constructor(private expenseService: ExpensesService, public dialog: MatDialog, private serviceApi: ApiCommonService) {
    this.getAllExpApplication();
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
  // getAllExpApplication() {
  //   this.selectedRows = [];
  //   this.expReports = [];
  //   this.serviceApi.get('/v1/expense/application/').subscribe(
  //     res => {
  //       console.log('Get expense Application----' + JSON.stringify(res));
  //       res.forEach(element => {
  //         let found1 = this.workLocations.filter(obj => obj.value === element.location)
  //         if (!found1.length) {
  //           this.workLocations.push({ label: element.location, value: element.location })
  //         }

  //         let found2 = this.bands.filter(obj => obj.value === element.band)
  //         if (!found2.length) {
  //           this.bands.push({ label: element.band, value: element.band })
  //         }

  //         let found3 = this.departments.filter(obj => obj.value === element.department)
  //         if (!found3.length) {
  //           this.departments.push({ label: element.department, value: element.department })
  //         }

  //         let found4 = this.designations.filter(obj => obj.value === element.designation)
  //         if (!found4.length) {
  //           this.designations.push({ label: element.designation, value: element.designation })
  //         }

  //         this.expStatus = '';
  //         this.expenseStatus.forEach(statusInfo => {
  //           if (element.expenseStatus === statusInfo.statusValue) {
  //             this.expStatus = statusInfo.statusName;
  //           }
  //         });
  //         if (!this.filterByEmp.some(empName => empName.label === element.empName)) {
  //           this.filterByEmp.push({
  //             label: element.empName, value: element.empName
  //           });
  //         }
  //         if (!this.filterByStatus.some(expenseStatus => expenseStatus.label === element.expenseStatus)) {
  //           this.filterByStatus.push({
  //             label: element.expenseStatus, value: this.expStatus
  //           });
  //         }
  //         let expensesList = [];
  //         element.expensesList.forEach(element1 => {
  //           let expensesFieldList = [];
  //           element1.expensesFieldList.forEach(element2 => {
  //             expensesFieldList.push({
  //               "expensesFieldId": element2.expensesFieldId,
  //               "fieldName": element2.fieldName,
  //               "fieldValue": element2.fieldValue
  //             })
  //           });

  //           expensesList.push({
  //             "expensesId": element1.expensesId,
  //             "expenseName": element1.expenseName,
  //             "amount": element1.amount,
  //             "isReImbursable": element1.isReImbursable,
  //             "isBillable": element1.isBillable,
  //             "expenseComments": element1.expenseComments,
  //             "expenseReason": element1.expenseReason,
  //             "expenseAttachment": element1.expenseAttachment,
  //             "expenseAttachmentId": element1.expenseAttachmentId,
  //             "expenseIncurredDate": element1.expenseIncurredDate,
  //             "templateCategoryId": element1.templateCategoryId,
  //             "expensesFieldList": expensesFieldList
  //           });
  //         });
  //         this.expReports.push({
  //           "expenseRepId": element.expenseId,
  //           "empCode": element.empCode,
  //           "expenseReportName": element.expenseReportName,
  //           "totalAmount": element.totalAmount,
  //           "reimburseAmount": element.reimburseAmount,
  //           "billableAmount": element.billableAmount,
  //           "advanceAmount": element.advanceAmount,
  //           "expenseStatus": this.expStatus,
  //           "empName": element.empName,
  //           "location": element.location,
  //           "band": element.band,
  //           "department": element.department,
  //           "designation": element.designation,
  //           "expensesList": expensesList

  //         });
  //       });
  //     },
  //     error => {
  //       console.log('there is something json');
  //     },
  //     () => {
  //       // this.month = 'January-2018';
  //       this.bulkActions = '';
  //       this.dt.reset();
  //     }
  //   );
  // }
  getAllExpApplication() {
    this.expenseService.clearData();
    const url = '/v1/expense/application/';
    return this.serviceApi.get(url)
      .subscribe(res => {
        this.expenseService.sendExpenseData(res.filter(x => (x.expenseStatus).toString().includes('LEVEL')), res.filter(x => (x.expenseStatus).toString() == "APPROVED"), res.filter(x => (x.expenseStatus).toString() == "CANCELLED"), res.filter(x => (x.expenseStatus).toString() == "REJECTED"))
        return;
      });
  }
  onTabChange(event) {
    console.log(event);
    if ($('.divtoggleDiv').length > 0) {
      this.panelFirstWidth = $('.divtoggleDiv')[0].offsetWidth;
      this.panelFirstHeight = $('.paneDiv')[0].offsetHeight;
      $('.divtoggleDiv')[1].style.display = 'none';
    }
  }
  message: string;
  receiveMessage($event) {
    this.message = $event;
    this.getAllExpApplication();
  }
  // editExpenseApplication(expDetails: any) {
  //     let dialogRef = this.dialog.open(EditAllSingleExpenseDialogComponent, {
  //       width: '500px',
  //       panelClass: 'custom-dialog-container',
  //       data: {
  //         message: this.notificationMsg,
  //         status: this.action,
  //         category: expDetails.category,
  //         expReportId: expDetails.expReportId,
  //         empCode: expDetails.empCode,
  //         expStatus: expDetails.status,
  //         totalReimbursable: expDetails.totalReimbursable,
  //         title: expDetails.title,
  //         totalBillable: expDetails.totalBillable,
  //         incurredDate: expDetails.incurredDate,
  //         advanceReceived: expDetails.advanceReceived,
  //         description: expDetails.description,
  //         empName: expDetails.empName,
  //         expenseAttachment: expDetails.expenseAttachment,
  //         expenseAttachmentPath: expDetails.expenseAttachmentPath,
  //         expenseAttachmentId: expDetails.expenseAttachmentId,
  //       }
  //     });
  //     // dialogRef.close();
  //     dialogRef.afterClosed().subscribe(result => {
  //       if (result !== undefined) {
  //         //  console.log('Result value ..... ' + JSON.stringify(result));
  //         if (result.message) {
  //           console.log('Result value ..... ' + result.message);
  //           if (result.status === 'Response') {
  //             this.notificationMsg = result.message;
  //             this.successNotification(this.notificationMsg);
  //             this.getAllExpApplication();
  //           }
  //           // tslint:disable-next-line:one-line
  //           else if (result.status === 'Error') {
  //             this.notificationMsg = result.message;
  //             // this.warningNotification(this.notificationMsg);
  //           }
  //         }

  //       }
  //     });
  // }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(element: any, event: any) {
    let id;
    this.isAllSelected() ?
      (this.selection.clear(), this.checkedRowData = []) :
      this.dataSource.data.forEach(
        row => {
          this.selection.select(row);
        });
    this.getRowMultipleData(this.dataSource.data, event.checked);
  }
  getRowData(element: any, event: any) {
    if (event.checked) {
      console.log('if');
      this.checkedRowData.push(
        element.expReportId
      );
    } else {
      for (let i = 0; i < this.checkedRowData.length; i++) {
        if (this.checkedRowData[i] === element.expReportId) {
          this.checkedRowData.splice(i, 1);
        } else {
          console.log('Not Matched');
        }
      }
    }
  }
  getRowMultipleData(elements: any, event: any) {
    console.log(event);
    if (event) {
      this.checkedRowData = [];

      console.log('Enter in Select Multiple Records');
      elements.forEach(element1 => {
        this.checkedRowData.push(
          element1.expReportId
        );
      });
      console.log(JSON.stringify(this.checkedRowData));
    } else {
      console.log('Enter in un Select Multiple Records');
      this.checkedRowData = [];
      console.log(JSON.stringify(this.checkedRowData));
    }

  }
  onChangebulkActions(value: any) {
    console.log(this.selectedRows)
    if (value === 'addSingleExp') {
      let dialogRef = this.dialog.open(AddSingleExpenseDialogComponent, {
        width: '800px',
        panelClass: 'custom-dialog-container',
        data: {
          message: this.notificationMsg,
          status: this.action,
        }
      });
      // dialogRef.close();
      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          //  console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            console.log('Result value ..... ' + result.message);
            if (result.status === 'Response') {
              this.notificationMsg = result.message;
              this.successNotification(this.notificationMsg);

              this.getAllExpApplication();
            }
            // tslint:disable-next-line:one-line
            else if (result.status === 'Error') {
              this.notificationMsg = result.message;
              // this.warningNotification(this.notificationMsg);
            }
          }

        }
      });
    }
    if (value === 'addMultipleExp') {
      let dialogRef = this.dialog.open(AddMultipleExpenseDialogComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
      });
    }
    // if (value === 'approveMultipleRequest') {
    //   if (this.checkedRowData.length > 0) {
    //     let dialogRef = this.dialog.open(ApproveRejectMultipleRequestDialogComponent, {
    //       width: '500px',
    //       panelClass: 'custom-dialog-container',
    //       data: {
    //         reqType: 'approveMultiple',
    //         checkedRowData: this.checkedRowData
    //       }
    //     });
    //     dialogRef.afterClosed().subscribe(result => {
    //       console.log('The dialog was closed');
    //       if (result !== undefined) {
    //         if (result.status === 'Response') {
    //           console.log(result);
    //           this.notificationMsg = result.message;
    //           this.selection.clear();
    //           this.checkedRowData = [];
    //           this.successNotification(this.notificationMsg);
    //           this.getAllExpApplication();
    //         } else if (result.status === 'Error') {
    //           this.notificationMsg = result.message;
    //           // this.warningNotification(this.notificationMsg);
    //         }
    //       }
    //     });
    //   } else {
    //     this.checkedRowData = [];
    //     this.selection.clear();
    //     this.warningNotification('Select a report first');
    //   }
    // }
    // if (value === 'rejectMultiple') {
    //   let dialogRef = this.dialog.open(ApproveRejectMultipleRequestDialogComponent, {
    //     width: '500px',
    //     panelClass: 'custom-dialog-container',
    //     data: value
    //   });
    // }
  }

  ngOnInit() {
    this.commentList = [{ dateTime: '08-02-2018, 15:50:12 ', message: 'Admin says this message' }];
  }

  showHistoryDialog(expDetails: any) {
    // let dialogRef = this.dialog.open(ShowExpenseHistoryDialogComponent, {
    //   width: '700px',
    //   panelClass: 'custom-dialog-container',
    //   data: expDetails,
    // });
  }
  approveSingleExpense(expId: any) {
    //   this.action = '';
    //   console.log('Inside Bulk Reject');
    //   const dialogRef = this.dialog.open(ApproveSingleExpense, {
    //     width: '500px',
    //     panelClass: 'custom-dialog-container',
    //     data: { expId: expId, message: this.notificationMsg, status: this.action }
    //   });
    //   dialogRef.afterClosed().subscribe(result => {
    //     if (result !== undefined) {
    //       console.log('Result value ..... ' + JSON.stringify(result));
    //       if (result.message) {
    //         console.log('Result value ..... ' + result.message);
    //         if (result.status === 'Response') {
    //           this.notificationMsg = result.message;
    //           this.successNotification(this.notificationMsg);

    //           this.getAllExpApplication();
    //         }
    //         // tslint:disable-next-line:one-line
    //         else if (result.status === 'Error') {
    //           this.notificationMsg = result.message;
    //           // this.warningNotification(this.notificationMsg);
    //         }
    //       }
    //       // tslint:disable-next-line:one-line
    //     }
    //   });
  }
  rejectSingleExpense(expId: any) {
    //   this.action = '';
    //   console.log('Inside Bulk Reject');
    //   const dialogRef = this.dialog.open(RejectSingleExpense, {
    //     width: '500px',
    //     panelClass: 'custom-dialog-container',
    //     data: { expId: expId, message: this.notificationMsg, status: this.action }
    //   });
    //   dialogRef.afterClosed().subscribe(result => {
    //     if (result !== undefined) {
    //       console.log('Result value ..... ' + JSON.stringify(result));
    //       if (result !== undefined) {
    //         console.log('Result value ..... ' + JSON.stringify(result));
    //         if (result.message) {
    //           console.log('Result value ..... ' + result.message);
    //           if (result.status === 'Response') {
    //             this.notificationMsg = result.message;
    //             this.successNotification(this.notificationMsg);

    //             this.getAllExpApplication();
    //           }
    //           // tslint:disable-next-line:one-line
    //           else if (result.status === 'Error') {
    //             this.notificationMsg = result.message;
    //             // this.warningNotification(this.notificationMsg);
    //           }
    //         }
    //         // tslint:disable-next-line:one-line
    //       }
    //     }
    //   });
  }
  cancelExpApplication(expId: any) {
    //   this.action = '';

    //   const dialogRef = this.dialog.open(DeleteLeaveRequest, {
    //     width: '500px',
    //     panelClass: 'custom-dialog-container',
    //     data: { expId: expId, message: this.notificationMsg, status: this.action }
    //   });
    //   dialogRef.afterClosed().subscribe(result => {
    //     if (result !== undefined) {
    //       console.log('Result value ..... ' + JSON.stringify(result));
    //       if (result.message) {
    //         console.log('Result value ..... ' + result.message);
    //         if (result.status === 'Response') {
    //           this.notificationMsg = result.message;
    //           this.successNotification(this.notificationMsg);

    //           this.getAllExpApplication();
    //         }
    //         // tslint:disable-next-line:one-line
    //         else if (result.status === 'Error') {
    //           this.notificationMsg = result.message;
    //           // this.warningNotification(this.notificationMsg);
    //         }
    //       }
    //       // tslint:disable-next-line:one-line
    //     }
    //   });
  }
  applyFilter(filterValue: string) {
    console.log('hello' + filterValue);
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  // showExpenseReport(expId: any) {
  //   this.id = expId;
  //   this.expReports.forEach(element => {
  //     if (element.expReportId === expId) {
  //       this.status = element.status;
  //       this.totalReimbursable = element.totalReimbursable;
  //       this.title = element.title;
  //       this.totalBillable = element.totalBillable;
  //       this.submittedOn = element.submittedOn;
  //       this.advanceReceived = element.advanceReceived;
  //       this.dataSource1 = new MatTableDataSource<Element1>(element.expRecords);
  //     }
  //   });
  // }
}

// -------------- Show history dialog start ----------------------------
// @Component({
//   selector: 'app-show-history-dialog',
//   templateUrl: 'show-history-dialog.html',
//   styleUrls: ['./dialog.scss']
// })
// export class ShowExpenseHistoryDialogComponent {
//   expensesList = [];
//   expenseReport = [];
//   @ViewChild("dt1") dt: DataTable;
//   @ViewChild(MatPaginator) paginator: MatPaginator;
//   dataColumns = [
//     { field: 'expenseIncurredDate', header: 'Incurred Date' },
//     { field: 'expenseName', header: 'Category' },
//     { field: 'amount', header: 'Amount' },
//     { field: 'isReImbursable', header: 'Reimbursable' },
//     { field: 'isBillable', header: 'Billable' },
//     { field: 'expenseAttachment', header: 'Attachment' },
//     { field: 'actions', header: 'Actions' }
//   ]
//   constructor(
//     private _fb: FormBuilder,
//     public innerDialog: MatDialog,
//     public dialogRef: MatDialogRef<ShowExpenseHistoryDialogComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: any) {

//     this.data.expensesList.forEach(element => {
//       let expensesFieldList = [];
//       element.expensesFieldList.forEach(element2 => {
//         expensesFieldList.push({
//           "expensesFieldId": element2.expensesFieldId,
//           "fieldName": element2.fieldName,
//           "fieldValue": element2.fieldValue
//         })
//       });
//       this.expensesList.push({
//         "expensesId": element.expensesId,
//         "expenseName": element.expenseName,
//         "amount": element.amount,
//         "isReImbursable": element.isReImbursable,
//         "isBillable": element.isBillable,
//         "expenseComments": element.expenseComments,
//         "expenseReason": element.expenseReason,
//         "expenseAttachment": element.expenseAttachment,
//         "expenseAttachmentId": element.expenseAttachmentId,
//         "expenseIncurredDate": element.expenseIncurredDate,
//         "templateCategoryId": element.templateCategoryId,
//         "expensesFieldList": expensesFieldList
//       });
//     }
//     );

//   }

//   showHistoryDialog(element: any) {
//     let dialogRef = this.innerDialog.open(ShowExpenseDialogComponent, {
//       width: '700px',
//       panelClass: 'custom-dialog-container',
//       data: element,
//     });
//   }

//   download(data: any) {
//     window.location.href = environment.storageServiceBaseUrl + data.expenseAttachmentId;
//   }
//   onNoClick(): void {
//     this.dialogRef.close();
//   }
// }
// -------------- Show history dialog end ----------------------------

// -------------- Show expense dialog start ----------------------------
// @Component({
//   selector: 'app-show-expense-dialog',
//   templateUrl: 'show-expense-dialog.html',
//   styleUrls: ['./dialog.scss']
// })
// export class ShowExpenseDialogComponent {
//   constructor(
//     private _fb: FormBuilder,
//     public innerDialog: MatDialog,
//     public dialogRef: MatDialogRef<ShowExpenseDialogComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: any) {
//   }

//   download() {
//     window.location.href = environment.storageServiceBaseUrl + this.data.expenseAttachmentId;
//   }
//   onNoClick(): void {
//     this.dialogRef.close();
//   }
// }

// -------------- Show expense dialog end -----------------------------




// ---------------- Delete history ------------------------------
// @Component({
//   templateUrl: './delete-expense-request.html',
//   styleUrls: ['./dialog.scss']
// })
// tslint:disable-next-line:component-class-suffix
// export class DeleteLeaveRequest implements OnInit {
//   action: any;
//   error: any;

//   constructor(public dialogRef: MatDialogRef<DeleteLeaveRequest>, @Inject(MAT_DIALOG_DATA) public data: any,
//     private _fb: FormBuilder, private serviceApi: ApiCommonService, private http: Http) {
//     // this.rejectIndividualLeavesRequest = this._fb.group(
//     //   {
//     //     usrComment: [],
//     //   });

//   }


//   cancelRequest() {
//     this.serviceApi.put('/v1/expense/application/admin/' + this.data.expId + '/action?action=CANCEL&&comments=' + '', null).
//       subscribe(
//         res => {
//           console.log('Cancel expense Successfully...' + JSON.stringify(res));
//           this.action = 'Response';
//           this.error = res.message;
//           this.close();
//         },
//         err => {
//           console.log('there is something error.....  ' + err.message);
//           this.action = 'Error';
//           this.error = err.message;
//           this.close();
//         });
//   }
//   ngOnInit() {

//   }
//   close(): void {
//     this.data.message = this.error;
//     this.data.status = this.action;
//     this.dialogRef.close(this.data);
//   }
//   onNoClick(): void {
//     this.dialogRef.close(this.data);
//   }
// }
// // --------------- Add Multiple Expense Dialog Start -----------------------
@Component({
  selector: 'app-add-multiple-expense-dialog',
  templateUrl: 'add-multiple-expense-dialog.html',
  styleUrls: ['./dialog.scss']
})
export class AddMultipleExpenseDialogComponent {
  templateList = [];
  categoryList = [];
  templateValue: any;
  expensesList = [];
  displayedColumnsForAddMulExp = ['date', 'category', 'merchant', 'amount', 'reimbursable', 'actions'];
  dataSourceForAddMulExp = new MatTableDataSource<ElementForAddMulExp>(ELEMENT_DATA4);
  constructor(private http: Http,
    public dialogRef: MatDialogRef<AddMultipleExpenseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.http.get('assets/data/expense/category.json').map(res => res.json()).subscribe(
      res => {
        console.log('-------------  Template-Category Informations --------------- ');
        res.forEach(element => {
          this.templateList.push({
            templateName: element.templateName,
            templateValue: element.templateValue,
            categoryList: element.categoryList
          });
        });
      },
      error => {
        console.log('there is something json');
      },
      // () => {
      //   // this.month = 'January-2018';
      //   // this.getAttendanceByMonth(this.month);
      // }
    );
    this.expensesList.push(1);
    this.dataSourceForAddMulExp = new MatTableDataSource<ElementForAddMulExp>(this.expensesList);
  }
  onChangeTemplate(value: any) {
    this.templateList.forEach(element => {
      if (value === element.templateValue) {
        this.categoryList = element.categoryList;
      }
    });
  }
  addMoreExpenses() {
    console.log('Add More Expenses-------------');
    this.expensesList.push(1);
    this.dataSourceForAddMulExp = new MatTableDataSource<ElementForAddMulExp>(this.expensesList);
  }
  deleteExpenses() {
    console.log('Add More Expenses-------------');
    this.expensesList.splice(this.expensesList.length - 1, 1);
    this.dataSourceForAddMulExp = new MatTableDataSource<ElementForAddMulExp>(this.expensesList);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
// -------------------------- Multiple Expense end-----------------
// ------------------------ Approve Multiple Request Dialog Start ------------------

// @Component({
//   selector: 'app-approve-reject-multiple-request',
//   templateUrl: 'approve-reject-multiple-request.html',
//   styleUrls: ['./dialog.scss']
// })
// export class ApproveRejectMultipleRequestDialogComponent {
//   requestType: any;
//   action: any;
//   error: any;

//   checkedRowData = [];
//   multiActionDialog: FormGroup;
//   constructor(
//     private _fb: FormBuilder,
//     public dialogRef: MatDialogRef<ApproveRejectMultipleRequestDialogComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
//     // this.checkedRowData = data.checkedData;
//     console.log('Request Type ----- ' + this.checkedRowData);
//     this.requestType = data.reqType;
//     data.checkedRowData.forEach(element => {
//       this.checkedRowData.push(element.expReportId);
//     });
//     this.multiActionDialog = this._fb.group({
//       usrComment: ['', Validators.required]
//     });
//   }
//   ngOnInit() {
//   }
//   approveMultiRequest() {
//     if (this.multiActionDialog.valid) {
//       console.log('Comment Value.......' + this.multiActionDialog.controls.usrComment.value);
//       // tslint:disable-next-line:max-line-length
//       console.log('Comment Value.......' + this.multiActionDialog.controls.usrComment.value);
//       const body = {
//         "action": "APPROVE",
//         "comment": this.multiActionDialog.controls.usrComment.value,
//         "reqIds": this.checkedRowData,
//       }
//       this.serviceApi.put('/v1/expense/application/bulkAction', body).subscribe(
//         res => {
//           console.log('Applied Leave Successfully...' + JSON.stringify(res));
//           this.action = 'Response';
//           this.error = res.message;
//           this.close();
//         },
//         err => {
//           console.log('there is something error.....  ' + err.message);
//           this.action = 'Error';
//           this.error = err.message;
//           this.close();
//         });
//     }
//   }

//   close(): void {
//     this.data.message = this.error;
//     this.data.status = this.action;
//     this.dialogRef.close(this.data);
//   }

//   onNoClick(): void {
//     this.dialogRef.close();
//   }
// }

// -----------------------  Approve Multiple Request Dialog End ----------------
// --------------- Add Single Expense Report Dialog Start -----------------------
@Component({
  selector: 'app-add-expense-report-dialog',
  templateUrl: 'add-expense-report-dialog.html',
  styleUrls: ['./dialog.scss']
})
export class AddSingleExpenseDialogComponent implements OnInit {
  empCode = KeycloakService.getUsername();
  categoryList = [];
  employeeList = [];
  expensesList = [];
  action: any;
  error: any;
  dialog: any;
  notificationMsg: any;
  shouldAdvanceAmountFlowToExpense: any = false;
  public newExpenseReport: FormGroup;
  @ViewChild("dt1") dt: DataTable;
  dataSource: MatTableDataSource<ExpenseRequestsData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataColumns = [
    { field: 'expenseIncurredDate', header: 'Incurred Date' },
    { field: 'expenseName', header: 'Category' },
    { field: 'amount', header: 'Amount' },
    { field: 'isReImbursable', header: 'Reimbursable' },
    { field: 'isBillable', header: 'Billable' },
    { field: 'actions', header: 'Actions' }
  ]
  constructor(private http: Http, private _fb: FormBuilder,
    public dialogRef: MatDialogRef<AddSingleExpenseDialogComponent>, public innerDialog: MatDialog, private serviceApi: ApiCommonService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.serviceApi.get('/v1/employee/filterEmployees').pipe(delay(500)).
      subscribe(
        // this.http.get('assets/data/Leave/leaveTemplate.json').subscribe
        // (
        res => {
          console.log('employee List----' + JSON.stringify(res));
          res.forEach(element => {
            this.employeeList = [...this.employeeList, {
              fullName: element.empFirstName + ' ' + element.empLastName + ' - ' + element.empCode,
              value: element.empCode
            }];
          });
        });


  }
  onChangeEmployee(selectedEmp: any) {
    this.categoryList = [];
    // this.newExpenseReport.controls.category.setValue([]);
    this.serviceApi.get('/v1/expense/application/expensecategories/' + selectedEmp).
      subscribe(
        // this.http.get('assets/data/Leave/leaveTemplate.json').subscribe
        // (
        res => {
          console.log('category----' + JSON.stringify(res));
          res.forEach(element => {
            this.categoryList.push({
              expenseTemplateCategoryId: element.expenseTemplateCategoryId,
              expenseCategoryName: element.expenseName,
              expenseCategoryType: element.expenseType,
              expenseCategoryFields: element.expenseCategoryFields,
              templateCategoriesFields: element.templateCategoriesFields
            });
          });
        });
        this.getAdvanceBalance();
  }
  ngOnInit() {
    console.log('Inside Has regularization reason....');
    this.newExpenseReport = this._fb.group({
      selectEmployee: [null, Validators.required],
      expenseReportName: ['', Validators.required],
      advancedAmount: [0],
      expensesList: []
    });
  }
  getAdvanceBalance() {
    if (this.newExpenseReport.controls.selectEmployee.value) {
      this.serviceApi.get('/v1/advance/application/get/advance/expense/data?empCode=' + this.newExpenseReport.controls.selectEmployee.value).subscribe(res => {
        this.shouldAdvanceAmountFlowToExpense = res.shouldAdvanceAmountFlowToExpense
      })
    }
    else {
      this.shouldAdvanceAmountFlowToExpense = false;
    }
  }


  addNewExpense() {
    if (this.newExpenseReport.controls.selectEmployee.valid) {
      let dialogRef1 = this.innerDialog.open(AddExpenseDialogComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: {
          message: this.notificationMsg,
          status: this.action,
          categoryList: this.categoryList,
          empCode: this.newExpenseReport.controls.selectEmployee.value
        }
      });
      // dialogRef.close();
      dialogRef1.afterClosed().subscribe(result => {
        if (result !== undefined) {
          //  console.log('Result value ..... ' + JSON.stringify(result));
          // if (result.message) {
          console.log('Result value ..... ' + result);
          if (result.status === 'Response') {
            // this.notificationMsg = result.message;
            // this.successNotification(this.notificationMsg);
            let expensesFieldList = [];
            result.formData.expensesFieldList.forEach(element => {
              expensesFieldList.push({
                expensesFieldId: element.fieldId,
                fieldName: element.fieldName,
                fieldType: element.fieldType,
                dropDownList: element.dropDownList,
                fromDate: element.fromDate,
                toDate: element.toDate,
                fieldValue: element.fieldValue,
                isMandatoryForSubmission: element.isMandatoryForSubmission,
              })
            });
            this.expensesList.push({
              amount: result.formData.amount,
              expenseAttachment: result.formData.expenseAttachment,
              expenseAttachmentId: result.formData.expenseAttachmentId,
              expenseIncurredDate: result.formData.expenseIncurredDate,
              expenseName: result.formData.expenseName,
              expenseReason: result.formData.expenseReason,
              expensesFieldList: expensesFieldList,
              isBillable: result.formData.isBillable,
              isReImbursable: result.formData.isReImbursable,
              templateCategoryId: result.formData.categoryId,
              expensesId: '0',
              expenseTempFields: result.formData.expenseTempFields,
              quantity: result.formData.quantity,
              distance: result.formData.distance,
              hour: result.formData.hour,
              rate: result.formData.rate,
              category: result.formData.category
            });
            this.dt.reset();
            // this.dataSource = new MatTableDataSource(this.expensesList);
            // this.getAllExpApplication();
          }
          // tslint:disable-next-line:one-line
          else if (result.status === 'Error') {
            // this.notificationMsg = result.message;
            // this.warningNotification(this.notificationMsg);
            if (result.formData.expenseAttachmentId) {
              this.serviceApi.delete('/v1/expense/application/delete/doc?dockey=' + result.formData.expenseAttachmentId).
                subscribe(res => {
                  console.log('Successful...');
                },
                  err => {
                    console.log('Unsuccessful...');
                  })
            }
          }
          // }

        }
      });
    }
  }
  updateExpense(element: any) {
    if (this.newExpenseReport.controls.selectEmployee.valid) {
      let index = this.expensesList.indexOf(element);
      let dialogRef1 = this.innerDialog.open(EditExpenseDialogComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: {
          message: this.notificationMsg,
          status: this.action,
          categoryList: this.categoryList,
          empCode: this.newExpenseReport.controls.selectEmployee.value,
          formData: element
        }
      });
      // dialogRef.close();
      dialogRef1.afterClosed().subscribe(result => {
        if (result !== undefined) {
          //  console.log('Result value ..... ' + JSON.stringify(result));
          // if (result.message) {
          console.log('Result value ..... ' + result);
          if (result.status === 'Response') {
            // this.notificationMsg = result.message;
            // this.successNotification(this.notificationMsg);
            let expensesFieldList = [];
            result.formData.expensesFieldList.forEach(element => {
              expensesFieldList.push({
                expensesFieldId: element.fieldId,
                fieldName: element.fieldName,
                dropDownList: element.dropDownList,
                fromDate: element.fromDate,
                toDate: element.toDate,
                fieldValue: element.fieldValue,
                isMandatoryForSubmission: element.isMandatoryForSubmission,
              })
            });
            this.expensesList.splice(index, 1, {
              amount: result.formData.amount,
              expenseAttachment: result.formData.expenseAttachment,
              expenseAttachmentId: result.formData.expenseAttachmentId,
              expenseIncurredDate: result.formData.expenseIncurredDate,
              expenseName: result.formData.expenseName,
              expenseReason: result.formData.expenseReason,
              expensesFieldList: expensesFieldList,
              isBillable: result.formData.isBillable,
              isReImbursable: result.formData.isReImbursable,
              templateCategoryId: result.formData.categoryId,
              expensesId: '0',
              expenseTempFields: result.formData.expenseTempFields,
              quantity: result.formData.quantity,
              distance: result.formData.distance,
              hour: result.formData.hour,
              rate: result.formData.rate,
              category: result.formData.category
            });
            // this.dataSource = new MatTableDataSource(this.expensesList);
            // this.getAllExpApplication();
          }
          // tslint:disable-next-line:one-line
          else if (result.status === 'Error') {
            // this.notificationMsg = result.message;
            // this.warningNotification(this.notificationMsg);
          }
          // }

        }
      });
    }
  }
  deleteExpense(data: any) {
    console.log(data);
    if (data.expenseAttachmentId) {
      this.serviceApi.delete('/v1/expense/application/delete/doc?dockey=' + data.expenseAttachmentId).
        subscribe(res => {
          console.log('Successful...');
        },
          err => {
            console.log('Unsuccessful...');
          })
    }
    let index = this.expensesList.indexOf(data);
    console.log(index);
    this.expensesList.splice(index, 1);
  }
  onSubmitRequest() {
    if (this.newExpenseReport.valid) {
      let expensesListData = []
      this.expensesList.forEach(element => {
        let expensesFieldList = [];
        element.expensesFieldList.forEach(element1 => {
          expensesFieldList.push({
            expensesFieldId: 0,
            fieldName: element1.fieldName,
            fieldValue: element1.fieldValue,
          })
        });
        expensesListData.push({
          amount: element.amount,
          expenseAttachment: element.expenseAttachment,
          expenseAttachmentId: element.expenseAttachmentId,
          expenseIncurredDate: element.expenseIncurredDate,
          expenseName: element.expenseName,
          expenseReason: element.expenseReason,
          expensesFieldList: expensesFieldList,
          isBillable: element.isBillable,
          isReImbursable: element.isReImbursable,
          templateCategoryId: element.templateCategoryId,
          expensesId: '0',
        })
      });
      console.log('form value ' + JSON.stringify(this.newExpenseReport.value));
      var body = {
        "advanceAmount": this.newExpenseReport.controls.advancedAmount.value,
        "empCode": this.newExpenseReport.controls.selectEmployee.value,
        "expenseReportName": this.newExpenseReport.controls.expenseReportName.value,
        "expensesList": expensesListData
      };
      console.log('Body ---------- Json data-------   ' + JSON.stringify(body));
      return this.serviceApi.post('/v1/expense/application/admin/', body).
        subscribe(
          res => {
            console.log('Applied Leave Successfully...' + JSON.stringify(res));
            this.action = 'Response';
            if (res.error == true && res.expensesErrors.length > 0) {
              let dialogRef = this.innerDialog.open(ShowErroreDialogComponent, {
                width: '700px',
                panelClass: 'custom-dialog-container',
                data: res.expensesErrors,
              });
            } else {
              this.error = res.message;
              this.close();
            }
          },
          err => {
            console.log('there is something error.....  ' + err.message);
            this.action = 'Error';
            console.log(err);
          });
    }
    else {
      console.log("slkjfl");
      Object.keys(this.newExpenseReport.controls).forEach(field => { // {1}
        const control = this.newExpenseReport.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }

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
// --------------- Add Single Expense Report Dialog End -------------------

// // --------------- Add Single Expense Dialog Start -----------------------
@Component({
  selector: 'app-add-single-expense-dialog',
  templateUrl: 'add-single-expense-dialog.html',
  styleUrls: ['./dialog.scss']
})
export class AddExpenseDialogComponent {
  categoryList = [];
  action: any;
  error: any;
  tempCategoryFieldList = [];
  amountEnable = true;
  showhideRate = false;
  showhideRateInput = false;
  public newExpenseRequest: FormGroup;
  rate: any;
  type: any;
  empCode: any;
  isHpAdhesives: boolean = environment.tenantId == '26' ? true : false;
  constructor(private http: Http, private _fb: FormBuilder,
    public dialogRef: MatDialogRef<AddExpenseDialogComponent>, private serviceApi: ApiCommonService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('Category -----' + data.category);
    this.categoryList = data.categoryList;
    this.empCode = data.empCode;
  }
  ngOnInit() {
    console.log('Inside Has regularization reason....');
    this.newExpenseRequest = this._fb.group(
      {
        category: [null, Validators.required],
        expenseIncurredDate: ['', Validators.required],
        amount: [null, Validators.required],
        expenseAttachment: [],
        expenseAttachmentId: [],
        expenseComments: [''],
        expenseName: [''],
        expenseReason: [''],
        expenseTempFields: [null],
        quantity: [],
        distance: [],
        hour: [],
        expensesFieldList: this._fb.array([
          // {
          // "expensesFieldId": 0,
          // "fieldName": "string",
          // "fieldValue": "string"
          // }
        ]),
        isBillable: [false],
        isReImbursable: [false],
        categoryId: [],
        rate: []
      }
    );
  }

  getCategoryData(data: any) {
    console.log(data);
    this.tempCategoryFieldList = [];
    this.categoryList.forEach(element => {
      if (element.expenseTemplateCategoryId == data.expenseTemplateCategoryId) {
        if (element.templateCategoriesFields.length > 0) {
          element.templateCategoriesFields.forEach(element1 => {
            this.tempCategoryFieldList.push(element1)
          });
          // this.amountEnable = false;
        }
        let control = <FormArray>this.newExpenseRequest.controls.expensesFieldList;
        control.controls = [];
        if (element.expenseCategoryFields.length > 0) {
          element.expenseCategoryFields.forEach(element2 => {
            let dropDownList = [];
            if (element2.dropDownList.length > 0) {
              dropDownList = element2.dropDownList;
            }
            control.push(this._fb.group({
              fieldId: [element2.fieldId],
              fieldName: [element2.fieldName],
              fieldType: [element2.fieldType],
              dropDownList: [dropDownList],
              fromDate: [],
              toDate: [],
              fieldValue: [],
              isMandatoryForSubmission: ['' + element2.isMandatoryForSubmission],
            }))
          });

        }
        this.newExpenseRequest.controls.categoryId.setValue(element.expenseTemplateCategoryId);
        this.newExpenseRequest.controls.expenseName.setValue(data.expenseCategoryName);
        this.newExpenseRequest.controls.expenseTempFields.reset();
        this.showhideRate = false;
      }
    });
    this.newExpenseRequest.controls.quantity.clearValidators();
    this.newExpenseRequest.controls.hour.clearValidators();
    this.newExpenseRequest.controls.distance.clearValidators();
    this.newExpenseRequest.controls.quantity.setValue(null);
    this.newExpenseRequest.controls.hour.setValue(null);
    this.newExpenseRequest.controls.distance.setValue(null);
    this.newExpenseRequest.controls.amount.setValue(null);
    if (data.expenseCategoryType == 'Per_Day') {
      this.amountEnable = false;
      this.newExpenseRequest.controls.quantity.setValidators(Validators.required);
      this.newExpenseRequest.controls.amount.clearValidators();
      this.newExpenseRequest.controls.amount.updateValueAndValidity();
    } else if (data.expenseCategoryType == 'Time') {
      this.amountEnable = false;
      this.newExpenseRequest.controls.hour.setValidators(Validators.required);
      this.newExpenseRequest.controls.amount.clearValidators();
      this.newExpenseRequest.controls.amount.updateValueAndValidity();
    } else if (data.expenseCategoryType == 'Distance') {
      this.amountEnable = false;
      this.newExpenseRequest.controls.distance.setValidators(Validators.required);
      this.newExpenseRequest.controls.amount.clearValidators();
      this.newExpenseRequest.controls.amount.updateValueAndValidity();
    } else {
      this.amountEnable = true;
    }
    this.newExpenseRequest.controls.quantity.updateValueAndValidity();
    this.newExpenseRequest.controls.hour.updateValueAndValidity();
    this.newExpenseRequest.controls.distance.updateValueAndValidity();
  }
  findRate(value: any) {
    if (this.newExpenseRequest.controls.expenseTempFields.value) {
      this.newExpenseRequest.controls.distance.setValue(null);
      this.newExpenseRequest.controls.amount.setValue(null);
    }
    this.rate = value.fieldValue;
    this.type = value.templateFieldType;
    this.showhideRate = true;
    this.newExpenseRequest.controls.rate.clearValidators();
    if (this.rate != 0) {
      this.showhideRateInput = false;
    } else {
      this.showhideRateInput = true;
      this.newExpenseRequest.controls.rate.setValidators(Validators.required);
    }
    this.newExpenseRequest.controls.rate.updateValueAndValidity();
  }

  calculate(value: any) {
    let amount;
    if (this.rate != 0) {
      amount = this.rate * value;
    } else {
      amount = this.newExpenseRequest.controls.rate.value * value;
    }
    this.newExpenseRequest.controls.amount.setValue(amount);
  }

  calculate1(value: any) {
    let amount;
    if (this.newExpenseRequest.controls.category.value.expenseCategoryType == 'Per_Day') {
      amount = this.newExpenseRequest.controls.quantity.value * value;
    } else if (this.newExpenseRequest.controls.category.value.expenseCategoryType == 'Time') {
      amount = this.newExpenseRequest.controls.hour.value * value;
    } else if (this.newExpenseRequest.controls.category.value.expenseCategoryType == 'Distance') {
      amount = this.newExpenseRequest.controls.distance.value * value;
    }
    this.newExpenseRequest.controls.amount.setValue(amount);
  }

  isChecked(event: any, data: any) {
    console.log(event);
    console.log(data);
    if (data == 'isReImbursable') {
      if (event.checked) {
        this.newExpenseRequest.controls.isReImbursable.setValue(true);
      } else {
        this.newExpenseRequest.controls.isReImbursable.setValue(false);
      }
    }
    if (data == 'isBillable') {
      if (event.checked) {
        this.newExpenseRequest.controls.isBillable.setValue(true);
      } else {
        this.newExpenseRequest.controls.isBillable.setValue(false);
      }
    }


  }


  onFileSelect(event) {
    if (event.target.files.length > 0) {

      if (this.newExpenseRequest.controls.expenseAttachmentId.value) {
        this.serviceApi.delete('/v1/expense/application/delete/doc?dockey=' + this.newExpenseRequest.controls.expenseAttachmentId.value).
          subscribe(res => {
            console.log('Successful...');
            this.newExpenseRequest.controls.expenseAttachmentId.setValue(null);
            this.newExpenseRequest.controls.expenseAttachment.setValue(null);
          },
            err => {
              console.log('Unsuccessful...');
            })
      }


      const file = <File>event.target.files[0];
      const formData = new FormData();
      // formData.append("owner", this.empCode);
      if (file !== undefined) { formData.append("file", file, file.name); }
      this.serviceApi.postWithFormData('/v1/expense/application/upload/doc/' + this.empCode, formData).
        subscribe(
          res => {
            console.log('uplodate file...' + JSON.stringify(res));
            if (res != undefined) {
              this.newExpenseRequest.controls.expenseAttachmentId.setValue(res.url);
              this.newExpenseRequest.controls.expenseAttachment.setValue(res.name);
            }
          },
          err => {
            console.log('there is something error.....  ' + err.message);
          });

    }
  }
  deleteFile() {
    if (this.newExpenseRequest.controls.expenseAttachmentId.value) {
      this.serviceApi.delete('/v1/expense/application/delete/doc?dockey=' + this.newExpenseRequest.controls.expenseAttachmentId.value).
        subscribe(res => {
          console.log('Successful...');
          this.newExpenseRequest.controls.expenseAttachmentId.setValue(null);
          this.newExpenseRequest.controls.expenseAttachment.setValue(null);
        },
          err => {
            console.log('Unsuccessful...');
          });
    }
  }
  onSubmitRequest() {
    if (this.newExpenseRequest.valid) {
      console.log('form value ' + JSON.stringify(this.newExpenseRequest.value));
      this.close();
    }
    else {
      console.log("slkjfl");
      Object.keys(this.newExpenseRequest.controls).forEach(field => { // {1}
        const control = this.newExpenseRequest.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }

  }


  close(): void {
    this.data.status = 'Response';
    this.data.formData = this.newExpenseRequest.value;
    this.dialogRef.close(this.data);
  }

  onNoClick(): void {
    this.data.status = 'Error';
    this.data.formData = this.newExpenseRequest.value;
    this.dialogRef.close(this.data);
  }
}

// --------------- Edit Single Expense Dialog Start -----------------------
@Component({

  templateUrl: 'edit-expense-app.html',
  styleUrls: ['./dialog.scss']
})
export class EditExpenseDialogComponent {
  categoryList = [];
  action: any;
  error: any;
  tempCategoryFieldList = [];
  amountEnable = true;
  showhideRate = false;
  public editExpenseRequest: FormGroup;
  rate: any;
  type: any;
  empCode: any;
  expenseData: any;
  showhideRateInput: boolean = false;
  isHpAdhesives: boolean = environment.tenantId == '26' ? true:false;
  // public editTeamExpenseRequest: FormGroup;
  constructor(private http: Http, private _fb: FormBuilder,
    public dialogRef: MatDialogRef<EditExpenseDialogComponent>, private serviceApi: ApiCommonService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('Category -----' + data.category);
    this.categoryList = data.categoryList;
    this.empCode = data.empCode;
    this.expenseData = data.formData;
  }
  ngOnInit() {
    console.log('Inside Has regularization reason....');
    console.log(this.expenseData);
    let expensesFieldList = this._fb.array([]);
    this.expenseData.expensesFieldList.forEach(element => {
      expensesFieldList.push(this._fb.group({
        fieldId: [element.expensesFieldId],
        fieldName: [element.fieldName],
        fieldType: [element.fieldType],
        dropDownList: [element.dropDownList],
        fromDate: [element.fromDate],
        toDate: [element.toDate],
        fieldValue: [element.fieldValue],
        isMandatoryForSubmission: [element.isMandatoryForSubmission]
      }));
    });

    this.editExpenseRequest = this._fb.group(
      {
        category: [this.expenseData.category, Validators.required],
        expenseIncurredDate: [this.expenseData.expenseIncurredDate, Validators.required],
        amount: [this.expenseData.amount, Validators.required],
        expenseAttachment: [this.expenseData.expenseAttachment],
        expenseAttachmentId: [this.expenseData.expenseAttachmentId],
        expenseComments: [''],
        expenseName: [this.expenseData.expenseName],
        expenseReason: [this.expenseData.expenseReason],
        expenseTempFields: [this.expenseData.expenseTempFields],
        quantity: [this.expenseData.quantity],
        distance: [this.expenseData.distance],
        hour: [this.expenseData.hour],
        expensesFieldList: expensesFieldList,
        isBillable: [this.expenseData.isBillable],
        isReImbursable: [this.expenseData.isReImbursable],
        categoryId: [this.expenseData.templateCategoryId],
        rate: [this.expenseData.rate]
      }
    );
    this.tempCategoryFieldList = [];
    this.categoryList.forEach(element => {
      if (element.expenseCategoryName == this.expenseData.expenseName) {
        if (element.templateCategoriesFields.length > 0) {
          element.templateCategoriesFields.forEach(element1 => {
            this.tempCategoryFieldList.push(element1)
          });
          this.amountEnable = false;
        }
      }
    });
    if (this.expenseData.expenseTempFields != null) { this.findRate(this.expenseData.expenseTempFields) }
  }
  getCategoryData(data: any) {
    console.log(data);
    this.tempCategoryFieldList = [];
    this.categoryList.forEach(element => {
      if (element.expenseTemplateCategoryId == data.expenseTemplateCategoryId) {
        if (element.templateCategoriesFields.length > 0) {
          element.templateCategoriesFields.forEach(element1 => {
            this.tempCategoryFieldList.push(element1)
          });
          // this.amountEnable = false;
        }
        let control = <FormArray>this.editExpenseRequest.controls.expensesFieldList;
        control.controls = [];
        if (element.expenseCategoryFields.length > 0) {
          element.expenseCategoryFields.forEach(element2 => {
            let dropDownList = [];
            if (element2.dropDownList.length > 0) {
              dropDownList = element2.dropDownList;
            }
            control.push(this._fb.group({
              fieldId: [element2.fieldId],
              fieldName: [element2.fieldName],
              fieldType: [element2.fieldType],
              dropDownList: [dropDownList],
              fromDate: [],
              toDate: [],
              fieldValue: [],
              isMandatoryForSubmission: ['' + element2.isMandatoryForSubmission],
            }))
          });

        }
        this.editExpenseRequest.controls.categoryId.setValue(element.expenseTemplateCategoryId);
        this.editExpenseRequest.controls.expenseName.setValue(element.expenseCategoryName);
        this.editExpenseRequest.controls.expenseTempFields.reset();
        this.showhideRate = false;
      }
    });
    this.editExpenseRequest.controls.quantity.clearValidators();
    this.editExpenseRequest.controls.hour.clearValidators();
    this.editExpenseRequest.controls.distance.clearValidators();
    this.editExpenseRequest.controls.quantity.setValue(null);
    this.editExpenseRequest.controls.hour.setValue(null);
    this.editExpenseRequest.controls.distance.setValue(null);
    this.editExpenseRequest.controls.amount.setValue(null);
    if (data.expenseCategoryType == 'Per_Day') {
      this.amountEnable = false;
      this.editExpenseRequest.controls.quantity.setValidators(Validators.required);
      this.editExpenseRequest.controls.amount.clearValidators();
      this.editExpenseRequest.controls.amount.updateValueAndValidity();
    } else if (data.expenseCategoryType == 'Time') {
      this.amountEnable = false;
      this.editExpenseRequest.controls.hour.setValidators(Validators.required);
      this.editExpenseRequest.controls.amount.clearValidators();
      this.editExpenseRequest.controls.amount.updateValueAndValidity();
    } else if (data.expenseCategoryType == 'Distance') {
      this.amountEnable = false;
      this.editExpenseRequest.controls.distance.setValidators(Validators.required);
      this.editExpenseRequest.controls.amount.clearValidators();
      this.editExpenseRequest.controls.amount.updateValueAndValidity();
    } else {
      this.amountEnable = true;
    }
    this.editExpenseRequest.controls.quantity.updateValueAndValidity();
    this.editExpenseRequest.controls.hour.updateValueAndValidity();
    this.editExpenseRequest.controls.distance.updateValueAndValidity();
  }
  findRate(value: any) {
    this.rate = value.fieldValue;
    this.type = value.templateFieldType;
    this.showhideRate = true;
    this.editExpenseRequest.controls.rate.clearValidators();
    if (this.rate != 0) {
      this.showhideRateInput = false;
    } else {
      this.showhideRateInput = true;
      this.editExpenseRequest.controls.rate.setValidators(Validators.required);
    }
    this.editExpenseRequest.controls.rate.updateValueAndValidity();

    this.calculate1(this.rate);
  }

  calculate(value: any) {
    let amount;
    if (this.rate != 0) {
      amount = this.rate * value;
    } else {
      amount = this.editExpenseRequest.controls.rate.value * value;
    }
    this.editExpenseRequest.controls.amount.setValue(amount);
  }

  calculate1(value: any) {
    let amount;
    if (this.editExpenseRequest.controls.category.value.expenseCategoryType == 'Per_Day') {
      amount = this.editExpenseRequest.controls.quantity.value * value;
    } else if (this.editExpenseRequest.controls.category.value.expenseCategoryType == 'Time') {
      amount = this.editExpenseRequest.controls.hour.value * value;
    } else if (this.editExpenseRequest.controls.category.value.expenseCategoryType == 'Distance') {
      amount = this.editExpenseRequest.controls.distance.value * value;
    }
    this.editExpenseRequest.controls.amount.setValue(amount);
  }


  isChecked(event: any, data: any) {
    console.log(event);
    console.log(data);
    if (data == 'isReImbursable') {
      if (event.checked) {
        this.editExpenseRequest.controls.isReImbursable.setValue(true);
      } else {
        this.editExpenseRequest.controls.isReImbursable.setValue(false);
      }
    }
    if (data == 'isBillable') {
      if (event.checked) {
        this.editExpenseRequest.controls.isBillable.setValue(true);
      } else {
        this.editExpenseRequest.controls.isBillable.setValue(false);
      }
    }


  }


  onFileSelect(event) {
    if (event.target.files.length > 0) {

      if (this.editExpenseRequest.controls.expenseAttachmentId.value) {
        this.serviceApi.delete('/v1/expense/application/delete/doc?dockey=' + this.editExpenseRequest.controls.expenseAttachmentId.value).
          subscribe(res => {
            console.log('Successful...');
            this.editExpenseRequest.controls.expenseAttachmentId.setValue(null);
            this.editExpenseRequest.controls.expenseAttachment.setValue(null);
          },
            err => {
              console.log('Unsuccessful...');
            })
      }


      const file = <File>event.target.files[0];
      const formData = new FormData();
      // formData.append("owner", this.empCode);
      if (file !== undefined) { formData.append("file", file, file.name); }
      this.serviceApi.postWithFormData('/v1/expense/application/upload/doc/' + this.empCode, formData).
        subscribe(
          res => {
            console.log('uplodate file...' + JSON.stringify(res));
            if (res != undefined) {
              this.editExpenseRequest.controls.expenseAttachmentId.setValue(res.url);
              this.editExpenseRequest.controls.expenseAttachment.setValue(res.name);
            }
          },
          err => {
            console.log('there is something error.....  ' + err.message);
          });

    }
  }
  deleteFile() {
    if (this.editExpenseRequest.controls.expenseAttachmentId.value) {
      this.serviceApi.delete('/v1/expense/application/delete/doc?dockey=' + this.editExpenseRequest.controls.expenseAttachmentId.value).
        subscribe(res => {
          console.log('Successful...');
          this.editExpenseRequest.controls.expenseAttachmentId.setValue(null);
          this.editExpenseRequest.controls.expenseAttachment.setValue(null);
        },
          err => {
            console.log('Unsuccessful...');
          });
    }
  }
  onSubmitRequest() {
    if (this.editExpenseRequest.valid) {
      console.log('form value ' + JSON.stringify(this.editExpenseRequest.value));
      this.close();
    }
    else {
      console.log("slkjfl");
      Object.keys(this.editExpenseRequest.controls).forEach(field => { // {1}
        const control = this.editExpenseRequest.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }

  }

  close(): void {
    this.data.status = 'Response';
    this.data.formData = this.editExpenseRequest.value;
    this.dialogRef.close(this.data);
  }

  onNoClick(): void {
    this.data.status = 'Error';
    this.data.formData = this.editExpenseRequest.value;
    this.dialogRef.close(this.data);
  }
}
// --------------- Edit Single Expense Dialog End -------------------
// ---------------- Approve Single expense request -----------------
// @Component({
//   templateUrl: './approve-single-expense.html',
//   styleUrls: ['./dialog.scss']
// })
// // tslint:disable-next-line:component-class-suffix
// export class ApproveSingleExpense implements OnInit {
//   action: any;
//   error: any;
//   approveSingleExpApplication: FormGroup;
//   constructor(public dialogRef: MatDialogRef<ApproveSingleExpense>, @Inject(MAT_DIALOG_DATA) public data: any,
//     private _fb: FormBuilder, private serviceApi: ApiCommonService) {

//     this.approveSingleExpApplication = this._fb.group(
//       {
//         usrComment: ['', Validators.required],
//       });
//   }
//   approveAppliation() {
//     if (this.approveSingleExpApplication.valid) {
//       console.log('Comment Value.......' + this.approveSingleExpApplication.controls.usrComment.value);
//       // tslint:disable-next-line:max-line-length
//       return this.serviceApi.put('/v1/expense/application/admin/' + this.data.expId + '/action?action=APPROVE&&comments=' + this.approveSingleExpApplication.controls.usrComment.value, null).
//         subscribe(
//           res => {
//             console.log('Approve Successfully...' + JSON.stringify(res));
//             this.action = 'Response';
//             this.error = res.message;
//             this.close();
//           },
//           err => {
//             console.log('there is something error.....  ' + err.message);
//             this.action = 'Error';
//             this.error = err.message;
//             this.close();
//           });
//     } else {

//       Object.keys(this.approveSingleExpApplication.controls).forEach(field => { // {1}
//         const control = this.approveSingleExpApplication.get(field);            // {2}
//         control.markAsTouched({ onlySelf: true });       // {3}
//       });
//     }

//   }
//   ngOnInit() {

//   }
//   close(): void {
//     this.data.message = this.error;
//     this.data.status = this.action;
//     this.dialogRef.close(this.data);
//   }
//   onNoClick(): void {
//     this.dialogRef.close(this.data);
//   }

// }
// // ----------------Reject single expense request ---------------
// @Component({
//   templateUrl: './reject-single-exp-request.html',
//   styleUrls: ['./dialog.scss']
// })
// // tslint:disable-next-line:component-class-suffix
// export class RejectSingleExpense implements OnInit {
//   action: any;
//   error: any;
//   rejectSingleApplication: FormGroup;
//   leaveId: any;
//   constructor(public dialogRef: MatDialogRef<RejectSingleExpense>, @Inject(MAT_DIALOG_DATA) public data: any,
//     private _fb: FormBuilder, private serviceApi: ApiCommonService, private http: Http) {
//     this.rejectSingleApplication = this._fb.group(
//       {
//         usrComment: ['', Validators.required],
//       });
//   }
//   rejectRequest() {
//     if (this.rejectSingleApplication.valid) {
//       console.log('Comment Value.......' + this.rejectSingleApplication.controls.usrComment.value);
//       // tslint:disable-next-line:max-line-length
//       return this.serviceApi.put('/v1/expense/application/admin/' + this.data.expId + '/action?action=REJECT&&comments=' + this.rejectSingleApplication.controls.usrComment.value, null).
//         subscribe(
//           res => {
//             console.log('Applied Leave Successfully...' + JSON.stringify(res));
//             this.action = 'Response';
//             this.error = res.message;
//             this.close();
//           },
//           err => {
//             console.log('there is something error.....  ' + err.message);
//             this.action = 'Error';
//             this.error = err.message;
//             this.close();
//           });
//     }
//     else {
//       Object.keys(this.rejectSingleApplication.controls).forEach(field => { // {1}
//         const control = this.rejectSingleApplication.get(field);            // {2}
//         control.markAsTouched({ onlySelf: true });       // {3}
//       });
//     }

//   }
//   ngOnInit() {

//   }
//   close(): void {
//     this.data.message = this.error;
//     this.data.status = this.action;
//     this.dialogRef.close(this.data);
//   }
//   onNoClick(): void {
//     this.dialogRef.close(this.data);
//   }

// }


//----------------------------   Error Dialog --------------------------

@Component({
  templateUrl: 'error-dialog.html',
  styleUrls: ['./dialog.scss']
})
export class ShowErroreDialogComponent {
  errorList = [];

  @ViewChild("dt1") dt: DataTable;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataColumns = [
    { field: 'expenseNo', header: 'Expense No.' },
    { field: 'message', header: 'Message' },
    { field: 'applicationStatus', header: 'Status' },
  ]
  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<ShowErroreDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    data.forEach(element => {
      this.errorList.push({
        expenseNo: element.expenseNo,
        message: element.message,
        applicationStatus: element.applicationStatus
      })
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}

export interface ElementForAddMulExp {
  date: any;
  category: any;
  merchant: any;
  amount: any;
  reimbursable: any;
  actions: any;
}

export interface ExpenseRequestsData {
  amount: any;
  expenseAttachment: any;
  expenseAttachmentId: any;
  expenseIncurredDate: any;
  expenseName: any;
  expenseReason: any;
  expensesFieldList: any;
  isBillable: boolean;
  isReImbursable: boolean;
  templateCategoryId: any;
  action: any;
}

const ELEMENT_DATA4: ElementForAddMulExp[] = [
  {
    date: 'any',
    category: 'any',
    merchant: 'any',
    amount: 'any',
    reimbursable: 'any',
    actions: 'any'
  }
];

// --------------- Add Multiple Expense Dialog End -------------------
export interface Element {
  id: any;
  reportTitle: any;
  employeeName: any;
  submittedOn: any;
  reimbursable: any;
  billable: any;
  status: any;
  actions: any;
}

export interface Element1 {
  expId: any;
  date: any;
  category: any;
  merchant: any;
  amount: any;
  status: any;
  receipt: any;
  actions: any;
}
const ELEMENT_DATA1: Element1[] = [];
