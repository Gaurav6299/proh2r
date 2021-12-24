import { Component, OnInit, Inject, Input, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Http } from '@angular/http';
import { ApiCommonService } from '../../../services/api-common.service';
import { DataTable } from 'primeng/primeng';
import { environment } from '../../../../environments/environment';
import { BulkEmployeeInviteResponeModelComponent } from '../../../employees/components/employees-main/employees-main.component';
declare var $: any;

@Component({
  selector: 'app-leave-balance',
  templateUrl: './leave-balance.component.html',
  styleUrls: ['./leave-balance.component.scss']
})
export class LeaveBalanceComponent implements OnInit {
  @ViewChild("dt1") dt: DataTable;
  employeeList = [];
  leaveBalanceList = [];
  showLeaveBalances: any;
  leaveRecords = [];
  leaveCategory = [];
  empLeaveCycleList = [];
  employeeListCopy = [];
  leaveBalance: FormGroup;
  employeeLists = [];
  myControl = new FormControl();
  options = [];
  optionsData = this.options;
  // tslint:disable-next-line:max-line-length
  // displayedColumns = ['startMonth', 'endMonth', 'openingBalance', 'accruedBalanceLeaves', 'takenLeaves', 'remainingLeaves', 'endingBalance'];

  columns = [
    { field: 'startMonth', header: 'Start Month' },
    { field: 'endMonth', header: 'End Month' },
    { field: 'openingBalance', header: 'Opening Balance' },
    { field: 'accruedBalanceLeaves', header: 'Accrued Balance' },
    { field: 'takenLeaves', header: 'Leaves Taken' },
    { field: 'usableBalance', header: 'Leaves Remaining' },
    { field: 'endingBalance', header: 'Closing Balance' },
  ]
  dataSource: MatTableDataSource<Element>;
  constructor(private http: Http, public dialog: MatDialog, private serviceApi: ApiCommonService, private fb: FormBuilder) {
    // Al Employee List
    this.leaveBalance = this.fb.group({
      employeeName: [null, Validators.required],
      leaveCycle: ['', Validators.required],
      leaveName: ['', Validators.required]
    });
    this.getAllEmployeeList();
    // Employee Leave Cycle
    this.serviceApi.get('/v1/leave/balance/leaveCycle').
      subscribe(
      res => {
        console.log('Inside Leave cycle....' + JSON.stringify(res));
        res.forEach(element => {
          this.empLeaveCycleList.push(
            { leaveCycleId: element.leaveCycleId, leaveCycleName: element.leaveCycleName });
        });
      });
  }
  ngOnInit() { }

  getAllEmployeeList() {
    this.employeeList = [];
    this.serviceApi.get('/v1/employee/filterEmployees').subscribe(
      res => {
        res.forEach(element => {
          this.employeeList.push({
            fullName: element.empFirstName.trim() + ' ' + element.empLastName.trim() + ' - ' + element.empCode,
            value: element.empCode
          });
        });
        this.employeeLists = this.employeeList;
        this.employeeListCopy = this.employeeList;
      });

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
  bulkUploadLeaveBalanceDialog() {
    const dialogRef = this.dialog.open(BulkUploadLeaveBalanceDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { leaveCycles: this.empLeaveCycleList }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.status === 'Response') {
          let dialogRef = this.dialog.open(BulkEmployeeInviteResponeModelComponent, {
            // width: '500px',
            panelClass: 'custom-dialog-container',
            data: {
              res: result.response,
              title: "Leave Balance Update Status Report"
            }
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined) {
              console.log('Result value ..... ' + JSON.stringify(result));
              if (result.message) {
                console.log('Result value ..... ' + result.message);
                if (result.status === 'Response') {
                  // this.notificationMsg = result.message;
                  // this.successNotification(this.notificationMsg);
                }
                else if (result.status === 'Error') {
                  // this.notificationMsg = result.message;
                }
              }
              // this.getEmployeeDirectoryData();
            }
          });

        } else {
          this.warningNotification(result.response);
        }

      }
    });
  }
  onChangeEmployee() {
    this.myControl.reset();
    this.employeeList = this.employeeListCopy;
    this.leaveBalance.controls.leaveCycle.setValue('');
    this.leaveBalance.controls.leaveName.setValue('');
  }
  onChangeCategory(categoryName: any) {
    console.log('Inside Onchange Leave Category......' + categoryName);
    this.leaveBalanceList = [];
    this.leaveRecords.forEach(element => {
      if (categoryName === element.leaveName) {
        this.leaveBalanceList = element.leaveBalanceList;
      }
    });
  }

  checkLeaveBalance() {
    if (this.leaveBalance.valid) {
      // this.dataSource = new MatTableDataSource<Element>(this.leaveBalanceList);
      this.showLeaveBalances = true;
    } else {
      this.showLeaveBalances = false;
      Object.keys(this.leaveBalance.controls).forEach(field => { // {1}
        const control = this.leaveBalance.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }
  getLeaveBalance() {
    this.leaveBalance.controls.leaveName.setValue('');
    this.leaveCategory = [];
    // tslint:disable-next-line:max-line-length
    if (this.leaveBalance.controls.employeeName.valid && this.leaveBalance.controls.leaveCycle.valid) {
      this.serviceApi.get('/v1/leave/balance/' + this.leaveBalance.controls.employeeName.value + '/' + this.leaveBalance.controls.leaveCycle.value)
        .subscribe(
        res => {
          console.log('-------------  Leave Balance Informations --------------- ' + JSON.stringify(res));
          res.forEach(element => {
            this.leaveCategory.push(element.leaveName);
          });
          this.leaveRecords = res;
        },
        error => {
          console.log('there is something json');
        }, () => {
          // this.dt.reset();
        }
        );
    }
  }

  searchEmployeeName(data: any) {
    // alert(this.myControl.value);
    if (this.myControl.value != null) {
      //   console.log('my method called' + data);
      this.employeeList = this.employeeLists.filter(option =>
        option.fullName.toLowerCase().indexOf(this.myControl.value.toLowerCase()) !== -1);
      // } else {
      console.log('Enter in the backSpace' + this.myControl);
      // this.myControl.reset();
      // this.getAllEmployeeList();
      // this.employeeList = this.employeeLists.filter(option =>
      //   option.fullName.toLowerCase().indexOf(this.myControl.value.toLowerCase()) === 0);
    }
  }
}

export interface Element {
  openingBalance: any;
  accruedBalanceLeaves: any;
  takenLeaves: any;
  endingBalance: any;
  startMonth: any;
  endMonth: any;
}

@Component({
  templateUrl: './bulk-upload-leave-balance-dialog.html',
})
export class BulkUploadLeaveBalanceDialogComponent implements OnInit {
  leaveCycles = [];
  leavecategories = [];
  action: any;
  error: any;
  form: FormGroup;
  selectedFiles: any;
  selectedFilesName: any;
  response: any;
  currentFileUpload: any;
  constructor(public dialogRef: MatDialogRef<BulkUploadLeaveBalanceDialogComponent>, private serviceApi: ApiCommonService, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any) {

    this.leaveCycles = data.leaveCycles;
  }

  ngOnInit() {

    this.form = this.fb.group({
      // employeeName: ['', Validators.required],
      leaveCycle: [, Validators.required],
      leaveCategory: [, Validators.required]
    });

    this.serviceApi.get('/v1/leave/settings/leaveCategories').subscribe(
      res => {
        console.log('Inside Leave cycle....' + JSON.stringify(res));
        res.forEach(element => {
          if (element.typeOfLeave == "General_Leave") {
            this.leavecategories = [...this.leavecategories,
            {
              categoryId: element.categoryId,
              leaveName: element.leaveName
            }]
          }
        });
      });
  }


  downloadFormat() {
    if (this.form.valid) {
      this.serviceApi.get('/v1/leave/balance/download/balanced-sheet/' + this.form.value.leaveCategory + '/' + this.form.value.leaveCycle).subscribe(
        res => {
          console.log('Inside Leave cycle....' + JSON.stringify(res));
          window.open(environment.storageServiceBaseUrl + res.url);
        });
    } else {
      Object.keys(this.form.controls).forEach(field => {
        const control = this.form.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }
  uploadFormat() {
    $('#uploadFile').click();
  }
  selectFile(event) {
    this.selectedFiles = event.target.files;
    this.currentFileUpload = this.selectedFiles.item(0);
    this.selectedFilesName = this.selectedFiles.item(0).name;
    // console.log(this.selectedFiles.item(0).name);
  }

  upload() {
    if (this.form.valid) {
      const formData = new FormData();
      const file = <File>this.currentFileUpload;
      formData.append("leaveCategoryId", this.form.value.leaveCategory);
      formData.append("leaveCycle", this.form.value.leaveCycle);
      if (file !== undefined) { formData.append("file", file, file.name); }

      this.serviceApi.putWithFormData('/v1/leave/balance/bulkUpload', formData).subscribe(
        res => {
          console.log('Applied Leave Successfully...' + JSON.stringify(res));
          this.action = 'Response';
          this.response = res;
          this.close();
        },
        err => {
          console.log('there is something error.....  ' + err.message);
          this.action = 'Error';
          this.response = err.message;
          // this.close();
        });


    } else {
      Object.keys(this.form.controls).forEach(field => {
        const control = this.form.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }

  close(): void {
    this.data.response = this.response;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
