import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DataTable } from 'primeng/primeng';
declare var $: any;

@Component({
  selector: 'app-org-designations',
  templateUrl: './org-designations.component.html',
  styleUrls: ['./org-designations.component.scss']
})
export class OrgDesignationsComponent implements OnInit {
  @ViewChild("dt1") dt: DataTable;
  // displayedColumns = ['designationName', 'actions'];
  columns = [
    { field: 'designationName', header: 'Designation' },
    { field: 'actions', header: 'Actions' },
  ];
  dataSource: MatTableDataSource<Element>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  designationList = [];
  notificationMsg: any;

  constructor(public dialog: MatDialog, private serviceApi: ApiCommonService) { }

  ngOnInit() {
    this.getAllDesignation();
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
  applyFilter(filterValue: string) {
    console.log('hello' + filterValue);
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  getAllDesignation() {
    console.log('Enter inside getAllDesignations ')
    this.designationList = [];
    this.serviceApi.get('/v1/organization/getAll/designations')
      .subscribe(
        res => {
          if (res != null) {
            res.forEach(element => {
              console.log('Responce :: ' + element);
              this.designationList.push({
                'designationId': element.id,
                'designationName': element.designationName
              });
            });
          } else {
            console.log('There is no any response from Database');
          }
        },
        err => {
        },
        () => {
          this.dt.reset();
        });
  }
  //add
  openAddDesignationDialog() {
    const dialogRef = this.dialog.open(AddUpdateDesignationComponent, {
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
          this.getAllDesignation();
        }
      }
    });
  }


  //update
  openUpdateDesignationDialog(data: any) {
    console.log('Inside openUpdateDesignationDialog-----' + data.designationId);
    const dialogRef = this.dialog.open(AddUpdateDesignationComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { action: 'update', message: this.notificationMsg, designationInfo: data }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed....................' + result.message);
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message !== null) {
          this.notificationMsg = result.message;
          this.successNotification(this.notificationMsg);
          this.getAllDesignation();
        }
      }
    });
  }

  //delete
  openDeleteDesignationDialog(data: any) {
    const dialogRef = this.dialog.open(DeleteDesignationComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { designationId: data, message: this.notificationMsg }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed....................' + result.message);
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message !== null) {
          this.notificationMsg = result.message;
          this.successNotification(this.notificationMsg);
          this.getAllDesignation();
        }
      }
    });

  }
}

export interface DesignationsElement {
  desinationName: string;
}
const ELEMENT_DATA: DesignationsElement[] = [];

// ---------------- Add/Update department model start ------------------------

@Component({
  templateUrl: 'add-update-designation.component.html',
})
export class AddUpdateDesignationComponent implements OnInit {
  public createDesignationForm: FormGroup;
  action: String;
  message: any;
  constructor(public dialogRef: MatDialogRef<AddUpdateDesignationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService, private _fb: FormBuilder) {
    this.action = data.action;
    if (data.action == 'add') {
      this.createDesignationForm = this._fb.group({
        designationId: ['0'],
        designationName: ['', [Validators.required]],
      });
    } else if (data.action == 'update') {
      console.log('department Id for updation----' + data.designationInfo.designationId);
      this.createDesignationForm = this._fb.group({
        designationId: [data.designationInfo.designationId],
        designationName: [data.designationInfo.designationName, [Validators.required]]
      });
    }
  }
  ngOnInit() {
  }

  addDesigantion() {
    console.log('Enter in the addDesigantion :::::')
    console.log('Designation Name -----' + this.createDesignationForm.controls.designationName.value);
    console.log('Form Validate -----' + this.createDesignationForm.valid);
    if (this.createDesignationForm.valid) {
      const body = {
        'id': this.createDesignationForm.controls.designationId.value,
        'designationName': this.createDesignationForm.controls.designationName.value,
      };
      console.log('Designation Body ::::' + JSON.stringify(body));
      this.serviceApi.post('/v1/organization/save/designations', body)
        .subscribe(
          res => {
            console.log('Desigantion Successfully Saved...' + JSON.stringify(res));
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
      Object.keys(this.createDesignationForm.controls).forEach(field => {
        const control = this.createDesignationForm.get(field);
        control.markAsTouched({ onlySelf: true })
      })
    }
  }
  updateDesigantion() {
    console.log('Enter in the updateDesigantion ::::: ' + this.createDesignationForm.controls.designationName.value);
    console.log('Desigantion Name -----' + this.createDesignationForm.controls.designationName.value);
    console.log('Form Validate -----' + this.createDesignationForm.valid);
    if (this.createDesignationForm.valid) {
      const body = {
        // 'id': this.createDesignationForm.controls.designationId.value,
        'designationName': this.createDesignationForm.controls.designationName.value,
      };
      console.log('Desigantion  Data :::: ' + JSON.stringify(body));
      this.serviceApi.put('/v1/organization/update/designations/' + this.createDesignationForm.controls.designationId.value, body).subscribe(
        res => {
          console.log('Desigantion update Saved...' + JSON.stringify(res));
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
      Object.keys(this.createDesignationForm.controls).forEach(field => {
        const control = this.createDesignationForm.get(field);
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
  templateUrl: 'delete-designation.component.html',
})
export class DeleteDesignationComponent implements OnInit {
  message: any;
  constructor(public dialogRef: MatDialogRef<DeleteDesignationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    console.log('Designation Id for deletion----' + data.designationId);
  }
  deleteDesignation() {
    this.serviceApi.delete('/v1/organization/delete/designations/' + this.data.designationId).subscribe(
      res => {
        console.log('Designation Delete Saved...' + JSON.stringify(res));
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

