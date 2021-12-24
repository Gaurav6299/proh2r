import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { DataTable } from 'primeng/components/datatable/datatable';
declare var $: any;
@Component({
  selector: 'app-org-sub-departments',
  templateUrl: './org-sub-departments.component.html',
  styleUrls: ['./org-sub-departments.component.scss']
})
export class OrgSubDepartmentsComponent implements OnInit {
  @ViewChild("dt1") dt: DataTable;
  subDepartments = [];
  columns = [
    { field: 'subDeptName', header: 'Sub Deparment Name' },
    { field: 'subDeptCode', header: 'Sub Deparment Code' },
    { field: 'actions', header: 'Actions' },
  ];
  notificationMsg: any;
  constructor(public dialog: MatDialog, private serviceApi: ApiCommonService) {
    this.getAllSubDepartments();
  }
  getAllSubDepartments() {
    this.subDepartments = [];
    this.serviceApi.get("/v1/organization/sub-department").subscribe(res => {
      this.subDepartments = res;
    }, (err) => {

    }, () => {
      this.dt.reset();
    })

  }
  updateSubdepartment(row: any) {
    console.log(row);
    const dialogRef = this.dialog.open(AddUpdateSubDepartmentComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { "subDeptId": row.subDeptId, "subDeptName": row.subDeptName, "subDeptCode": row.subDeptCode }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed....................' + result.message);
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message !== null) {
          this.notificationMsg = result.message;
          this.successNotification(this.notificationMsg);
          this.getAllSubDepartments();
        }
      }
    });

  }

  openAddUpdateSubDepartmentDialog() {
    const dialogRef = this.dialog.open(AddUpdateSubDepartmentComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed....................' + result.message);
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message !== null) {
          this.notificationMsg = result.message;
          this.successNotification(this.notificationMsg);
          this.getAllSubDepartments();
        }
      }
    });
  }

  openDeleteDepartmentDialog(data: any) {
    console.log(data);
    const dialogRef = this.dialog.open(DeleteSubDepartmentComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { subDeptId: data.subDeptId, message: this.notificationMsg }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed....................' + result.message);
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message !== null) {
          this.notificationMsg = result.message;
          this.successNotification(this.notificationMsg);
          this.getAllSubDepartments();
        }
      }
    });

  }
  ngOnInit() {
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

}

@Component({
  templateUrl: 'add-update-sub-department.component.html',
})
export class AddUpdateSubDepartmentComponent implements OnInit {
  action: String;
  message: any;
  error: any;
  subDepartmentFormGroup: FormGroup;
  constructor(public dialogRef: MatDialogRef<AddUpdateSubDepartmentComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService, private _fb: FormBuilder) {
    this.subDepartmentFormGroup = this._fb.group({
      "subDeptName": [null, Validators.required],
      "subDeptId": [],
      "subDeptCode": []
    });
    if (data != undefined) {
      this.subDepartmentFormGroup.controls.subDeptId.setValue(data.subDeptId);
      this.subDepartmentFormGroup.controls.subDeptName.setValue(data.subDeptName);
      this.subDepartmentFormGroup.controls.subDeptCode.setValue(data.subDeptCode);
    }
  }
  ngOnInit() {

  }
  close(): void {
    this.data.message = this.message;
    this.dialogRef.close(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createSubDepartment() {
    if (this.subDepartmentFormGroup.valid) {
      this.serviceApi.post("/v1/organization/sub-department", this.subDepartmentFormGroup.value).subscribe(res => {
        if (res != null) {
          this.message = res.message;
          this.close();
        }
      }, err => {
        console.log('Something gone Wrong');
        console.log('err -->' + err);
        // this.warningNotification(err.message);
      }, () => {

      });
    } else {
      Object.keys(this.subDepartmentFormGroup.controls).forEach(field => { // {1}
        const control = this.subDepartmentFormGroup.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }

  updateSubDepartment() {
    if (this.subDepartmentFormGroup.valid) {
      this.serviceApi.put("/v1/organization/sub-department/" + this.subDepartmentFormGroup.controls.subDeptId.value, this.subDepartmentFormGroup.value).subscribe(res => {
        if (res != null) {
          this.message = res.message;
          this.close();
        }
      }, err => {
        console.log('Something gone Wrong');
        console.log('err -->' + err);
        // this.warningNotification(err.message);
      }, () => {

      });
    } else {
      Object.keys(this.subDepartmentFormGroup.controls).forEach(field => { // {1}
        const control = this.subDepartmentFormGroup.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }

}

@Component({
  templateUrl: 'delete-sub-department.component.html',
})
export class DeleteSubDepartmentComponent implements OnInit {
  message: any;
  constructor(public dialogRef: MatDialogRef<DeleteSubDepartmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    console.log(this.data);
  }
  deleteDepartment() {
    this.serviceApi.delete('/v1/organization/sub-department/' + this.data.subDeptId).subscribe(
      res => {
        console.log('Department Delete Saved...' + JSON.stringify(res));
        if (res != null) {
          this.message = res.message;
          this.close();
        } else {
        }
      }, err => {
        console.log('Something gone Wrong');
        console.log('err -->' + err);
        // this.warningNotification(err.message);
      }, () => {
        // this.getAllCategories();
      });

  }
  ngOnInit() {
  }
  close(): void {
    this.data.message = this.message;
    this.dialogRef.close(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}