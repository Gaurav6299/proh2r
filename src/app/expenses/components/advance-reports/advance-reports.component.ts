import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataTable } from 'primeng/primeng';
import { ApiCommonService } from '../../../services/api-common.service';
import { ExpensesService } from '../../expenses.service';
declare var $: any
@Component({
  selector: 'app-advance-reports',
  templateUrl: './advance-reports.component.html',
  styleUrls: ['./advance-reports.component.scss']
})
export class AdvanceReportsComponent implements OnInit {
  @ViewChild("dt1") dt: DataTable;
  employeeList: any = [];
  columns = [
    { field: 'empCode', header: 'Employee Name' },
    { field: 'advanceAmount', header: 'Amount' },
    { field: 'advanceCategoryName', header: 'Category Name' },
    { field: 'comments', header: 'Comments' },
    { field: 'applicationStatus', header: 'Status' },
    { field: 'actions', header: 'Actions' }
  ]
  advancesReports = [];
  advanceCategoryId: any = [];
  panelFirstWidth: any;
  panelFirstHeight: any;
  selectedTab: any;
  empCode: any = null;
  advanceBalance: any = {};
  constructor(public dialog: MatDialog, private serviceApi: ApiCommonService, private expenseService: ExpensesService) { 
    this.getAdvanceRequest();
    this.getEmployees();
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
  teamAdvancesDialog() {
    const dialogRef = this.dialog.open(TeamAdvanceRequestDialogComponent, {
      width: '800px',
      panelClass: 'custom-dialog-container',
      data: { advanceCategoryId: this.advanceCategoryId, employeeList: this.employeeList }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.status === 'Response') {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            this.successNotification(result.message);
            this.getAdvanceRequest();
            this.empCode = null;
          }
        }
      }
    });

  }

  getAdvanceRequest() {
    this.expenseService.clearAdvanceData();
    const url = '/v1/advance/application/admin'
    return this.serviceApi.get(url)
      .subscribe(res => {
        this.expenseService.sendTeamAdvanceData(res.filter(x => (x.applicationStatus).toString().includes('Level')), res.filter(x => (x.applicationStatus).toString() == "Approved"), res.filter(x => (x.applicationStatus).toString() == "Rejected"), res.filter(x => (x.applicationStatus).toString() == "Cancelled"))
        return;
      });
  }
  getEmployees() {
    let arr = [];
    this.serviceApi.get('/v1/employee/filterEmployees').
      subscribe(
        res => {
          res.forEach(element => {
            arr.push({
              fullName: element.empFirstName + ' ' + element.empLastName + ' - ' + element.empCode, 
              value: element.empCode
            });
          });
          this.employeeList = arr;
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
    this.getAdvanceRequest();
  }
  ngOnInit() {
    this.getApprovalStatus();
  }
  getApprovalStatus() {
    this.expenseService.getApprovalStatus().subscribe(val => {
      this.getEmpAdvanceBalances();
    })
  }
  getEmpAdvanceBalances() {
    if (this.empCode!=null) {
      this.serviceApi.get('/v1/advance/application/get/advance/balance?empCode=' + this.empCode).subscribe(res => {
        this.advanceBalance = {
          "totalRemainingAdvance": res.totalRemainingAdvance,
          "totalApprovedAdvance": res.totalApprovedAdvance,
          "totalPendingAdvance": res.totalPendingAdvance,
        }
      })
    }    
  }

}

@Component({
  templateUrl: 'team-advance-request-dialog.html',
})
export class TeamAdvanceRequestDialogComponent implements OnInit {
  @ViewChild("dt1") dt: DataTable;
  actions: any;
  error: any;
  message;
  advanceRequestForm: FormGroup;
  advanceCategoryId = [];
  employeeList = [];
  selectedEmployee: any;
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
  constructor(public dialogRef: MatDialogRef<TeamAdvanceRequestDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService, private fb: FormBuilder) {
    this.advanceCategoryId = this.data.advanceCategoryId;
    this.employeeList = this.data.employeeList
    this.advanceRequestForm = this.fb.group({
      advanceCategoryId: [null, Validators.required],
      empCode: [null, Validators.required],
      advanceAmount: [null, Validators.required],
      comments: [null, Validators.required]
    });
  }
  changeEmployee() {
    let empCode = this.advanceRequestForm.controls.empCode.value;
    this.advanceRequestForm.controls.advanceCategoryId.reset();
    this.advanceRequestForm.controls.advanceAmount.reset();
    this.advanceRequestForm.controls.comments.reset();
    this.selectedEmployee = empCode;
    this.advanceCategoryId = [];
    this.serviceApi.get('/v1/advance/template/assignment/get/assigned/template?empCode=' + empCode).
      subscribe(
        res => {
          if (res.advanceTemplateCategoriesList != null || undefined) {
            res.advanceTemplateCategoriesList.forEach(element => {
              this.advanceCategoryId.push({
                advanceCategoryId: element.advanceCategoryId,
                categoryName: element.categoryName,
              });
            });
          }
        });
  }
  applyAdvanceRequest() {
    if (this.advanceRequestForm.valid) {
      const body = {
        "advanceCategoryId": this.advanceRequestForm.controls.advanceCategoryId.value,
        'empCode':this.advanceRequestForm.controls.empCode.value,
        'advanceAmount': this.advanceRequestForm.controls.advanceAmount.value,
        "comments": this.advanceRequestForm.controls.comments.value,
      }
      return this.serviceApi.post('/v1/advance/application/apply', body).
        subscribe(
          res => {
            this.actions = 'Response';
            this.message = res.message;
            this.close();
          },
          err => {
            console.log('there is something error.....  ' + err.message);
            this.actions = 'Error';
          });

    } else {
      Object.keys(this.advanceRequestForm.controls).forEach(field => {
        const control = this.advanceRequestForm.get(field);
        control.markAsTouched({ onlySelf: true })
      })
    }
  }
  ngOnInit() { }

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