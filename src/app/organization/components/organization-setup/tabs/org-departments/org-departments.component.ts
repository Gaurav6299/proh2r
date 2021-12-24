import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { DataTable } from 'primeng/primeng';
declare var $: any;
@Component({
  selector: 'app-org-departments',
  templateUrl: './org-departments.component.html',
  styleUrls: ['./org-departments.component.scss']
})
export class OrgDepartmentsComponent implements OnInit {
  @ViewChild("dt1") dt: DataTable;
  // Columns = ['deptName', 'actions'];
  columns = [
    { field: 'deptName', header: 'Deparments Name' },
    { field: 'deptCode', header: 'Deparments Code' },
    { field: 'actions', header: 'Actions' },
  ];
  // dataSource: MatTableDataSource<Element>;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;
  subDepartments = [];
  departmentList = [];
  notificationMsg: any;
  constructor(public dialog: MatDialog, private serviceApi: ApiCommonService) { }

  ngOnInit() {
    this.getAllDepartments();
    this.getAllSubDepartments();
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

  getAllDepartments() {
    console.log('Enter inside getAllDepartment ')
    this.departmentList = [];
    this.serviceApi.get('/v1/organization/departments/getAll')
      .subscribe(
      res => {
        if (res != null) {
          res.forEach(element => {
            console.log('Responce :: ' + element);
            this.departmentList.push({
              'deptId': element.deptId,
              'deptName': element.deptName,
              "subDepartmentDTO": element.subDepartmentDTO,
              "deptCode": element.deptCode
            });
          });
        } else {
          console.log('There is no any response from Database');
        }
      },
      err => { },
      () => {
        this.dt.reset();
      });
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

  //add
  openAddDepartmentDialog() {
    const dialogRef = this.dialog.open(AddUpdateDepartmentComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { action: 'add', message: this.notificationMsg }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed....................' + result.message);
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message !== null) {
          this.notificationMsg = result.message;
          this.successNotification(this.notificationMsg);
          this.getAllDepartments();
        }
      }
    });
  }

  assignSubDepartment(row: any) {
    console.log(row);
    const dialogRef = this.dialog.open(AssignSubDepartmentComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { subDepartments: this.subDepartments, row: row }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed....................' + result.message);
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message !== undefined) {
          this.notificationMsg = result.message;
          this.successNotification(this.notificationMsg);
          this.getAllDepartments();
          this.getAllSubDepartments();
        }
      }
    });

  }


  //update
  openUpdateDepartmentDialog(data: any) {
    console.log(data);
    const dialogRef = this.dialog.open(AddUpdateDepartmentComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { action: 'update', message: this.notificationMsg, departmentInfo: data, deptCode: data.deptCode }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed....................' + result.message);
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message !== null) {
          this.notificationMsg = result.message;
          this.successNotification(this.notificationMsg);
          this.getAllDepartments();
        }
      }
    });
  }

  //delete
  openDeleteDepartmentDialog(data: any) {
    const dialogRef = this.dialog.open(DeleteDepartmentComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { deptId: data, message: this.notificationMsg }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed....................' + result.message);
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message !== null) {
          this.notificationMsg = result.message;
          this.successNotification(this.notificationMsg);
          this.getAllDepartments();
        }
      }
    });

  }

}
export interface DepartmentsElement {
  deptName: string;
}

const ELEMENT_DATA: DepartmentsElement[] = [];

@Component({
  templateUrl: 'add-update-department.component.html',
})
export class AddUpdateDepartmentComponent implements OnInit {
  public createDepartmentForm: FormGroup;
  action: String;
  message: any;
  constructor(public dialogRef: MatDialogRef<AddUpdateDepartmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService, private _fb: FormBuilder) {
    this.action = data.action;
    if (data.action == 'add') {
      this.createDepartmentForm = this._fb.group({
        deptId: ['0'],
        deptName: ['', [Validators.required]],
        deptCode: [null]
      });
    } else if (data.action == 'update') {
      console.log('department Id for updation----' + data.departmentInfo.deptId);
      this.createDepartmentForm = this._fb.group({
        deptId: [data.departmentInfo.deptId],
        deptName: [data.departmentInfo.deptName, [Validators.required]],
        deptCode: [data.deptCode]
      });
    }
  }
  ngOnInit() {
  }

  addDepartment() {
    console.log('Enter in the addDepartment :::::')
    console.log('Department Name -----' + this.createDepartmentForm.controls.deptName.value);
    console.log('Form Validate -----' + this.createDepartmentForm.valid);
    if (this.createDepartmentForm.valid) {
      const body = {
        'deptId': this.createDepartmentForm.controls.deptId.value,
        'deptName': this.createDepartmentForm.controls.deptName.value,
        'deptCode': this.createDepartmentForm.controls.deptCode.value,
        'subDepartmentDTO': []
      };
      console.log(' Department Body ::::' + JSON.stringify(body));
      this.serviceApi.post('/v1/organization/departments/save', body)
        .subscribe(
        res => {
          console.log('Department Successfully Saved...' + JSON.stringify(res));
          if (res != null) {
            this.message = res.message;
            this.close();
          } else {
          }
        },
        err => {
          console.log('Something gone Wrong');
          console.log('err -->' + err);
        },
        () => {

        });
    } else {
      Object.keys(this.createDepartmentForm.controls).forEach(field => {
        const control = this.createDepartmentForm.get(field);
        control.markAsTouched({ onlySelf: true })
      })
    }
  }
  updateDepartment() {
    console.log('Enter in the updateDepartment ::::: ' + this.createDepartmentForm.controls.deptName.value);
    console.log('Department Name -----' + this.createDepartmentForm.controls.deptName.value);
    console.log('Form Validate -----' + this.createDepartmentForm.valid);
    if (this.createDepartmentForm.valid) {
      const body = {
        'deptId': this.createDepartmentForm.controls.deptId.value,
        'deptName': this.createDepartmentForm.controls.deptName.value,
        'deptCode': this.createDepartmentForm.controls.deptCode.value,
        'subDepartmentDTO': this.data.departmentInfo.subDepartmentDTO
      };
      console.log('Department  Data :::: ' + JSON.stringify(body));
      this.serviceApi.put('/v1/organization/departments/update/' + this.createDepartmentForm.controls.deptId.value, body).subscribe(
        res => {
          console.log('Department update Saved...' + JSON.stringify(res));
          if (res != null) {
            this.message = res.message;
            this.close();
          } else {
          }
        }, err => {
          console.log('Something gone Wrong');
          console.log('err -->' + err);
        }, () => {
          // this.getAllCategories();
        });
    } else {
      Object.keys(this.createDepartmentForm.controls).forEach(field => {
        const control = this.createDepartmentForm.get(field);
        control.markAsTouched({ onlySelf: true })
      })
    }
  }
  close(): void {
    this.data.message = this.message;
    this.dialogRef.close(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
// ---------------- Add/Update asset categories model end ------------------------

// ---------------- Delete asset categories model start ------------------------
@Component({
  templateUrl: 'delete-department.component.html',
})
export class DeleteDepartmentComponent implements OnInit {
  message: any;
  constructor(public dialogRef: MatDialogRef<DeleteDepartmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    console.log('department Id for deletion----' + data.deptId);
  }
  deleteDepartment() {
    this.serviceApi.delete('/v1/organization/departments/delete/' + this.data.deptId).subscribe(
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
// ---------------- Delete asset categories model end ------------------------



@Component({
  templateUrl: 'assign-sub-department.component.html',
})
export class AssignSubDepartmentComponent implements OnInit {
  action: any;
  message: any;
  subDepartments = [];
  mySelectedSubDepartmentList = [];
  selectedUserList = new FormControl();
  deptIds = [];
  bandIds = [];
  empCodes = [];
  error: any;
  subDepartmentAssignments = [];
  constructor(public dialogRef: MatDialogRef<AssignSubDepartmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService, private _fb: FormBuilder) {
    this.subDepartmentAssignments = data.row.subDepartmentDTO;
    this.subDepartments = data.subDepartments;
    console.log(data);
    data.row.subDepartmentDTO.forEach(subDepartment => {
      console.log(subDepartment);
      this.mySelectedSubDepartmentList.push(subDepartment);
    });

  }
  ngOnInit() {
    this.selectedUserList.setValidators([Validators.required]);
  }

  assigSubDepartment() {
    console.log(this.selectedUserList.value);
    const body = {
      "deptName": this.data.row.deptName,
      "deptCode": this.data.row.deptCode,
      "subDepartmentDTO": this.selectedUserList.value
    }
    this.serviceApi.put('/v1/organization/departments/update/' + this.data.row.deptId, body).subscribe(res => {
      this.message = res.message;
      this.close();
    }, err => {
      console.log('there is something error.....  ' + err.message);
      this.action = 'Error';
      this.error = err.message;
      this.close();
    }, () => {

    });
  }


  close(): void {
    this.data.message = this.message;
    this.dialogRef.close(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close(this.data);
  }
}
