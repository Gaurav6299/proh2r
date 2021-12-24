import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiCommonService } from '../../../../services/api-common.service';
import { DataTable } from 'primeng/primeng';
declare var $: any;
@Component({
  selector: 'app-identification-labels',
  templateUrl: './identification-labels.component.html',
  styleUrls: ['./identification-labels.component.scss']
})
export class IdentificationLabelsComponent implements OnInit {
  @ViewChild("dt1") dt: DataTable;
  lableData = [];
  // displayedColumns = ['labelName', 'labelDescription', 'actions'];
  columns = [
    { field: 'labelName', header: 'Label Name' },
    { field: 'labelDescription', header: 'Description' },
    { field: 'actions', header: 'Actions' },
  ]
  dataSource: MatTableDataSource<Element>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  identificationLableList = []
  notificationMsg: String;
  constructor(public dialog: MatDialog, private serviceApi: ApiCommonService) { }

  ngOnInit() {
    this.getAllIdentificationLabels();
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
  getAllIdentificationLabels() {
    console.log('Inside getAllIdentificationLabels...');
    this.identificationLableList = [];
    this.serviceApi.get('/v1/assets/label/list').
      subscribe(
        res => {
          console.log('identification----' + JSON.stringify(res));
          res.forEach(element => {
            this.identificationLableList.push({
              identificationLabelId: element.identificationLabelId,
              labelName: element.labelName,
              labelDescription: element.labelDescription
            });
          });
        },
        (err) => {

        },
        () => {
          this.dt.reset();
        });
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  //open dialog for add asset categories
  openAddLabelDialog() {
    const dialogRef = this.dialog.open(AddUpdateLabelComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { action: 'add', message: this.notificationMsg, title: "Add Label" }
    });
    dialogRef.afterClosed().subscribe(result => {
      //  console.log('The dialog was closed....................' + result.message);
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          console.log('Result value ..... ' + result.message);
          this.successNotification(result.message);
          this.getAllIdentificationLabels();
        }
      }
    });
  }
  //open dialog for update asset categories
  openUpdateLabelDialog(data: any) {
    console.log('Label Info-----' + data.labelName);
    const dialogRef = this.dialog.open(AddUpdateLabelComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { action: 'update', message: this.notificationMsg, labelInfo: data, title: "Update Label" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          console.log('Result value ..... ' + result.message);
          this.successNotification(result.message);
          this.getAllIdentificationLabels();
        }
      }
    });
  }
  //open dialog for delete asset categories
  openDeleteLabelDialog(data: any) {
    const dialogRef = this.dialog.open(DeleteLabelComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { labelInfo: data }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          console.log('Result value ..... ' + result.message);
          this.successNotification(result.message);
          this.getAllIdentificationLabels();
        }
      }
    });
  }
}
export interface LabelElement {
  labelName: any;
  labelDescription: any;
  actions: any;
}
const ELEMENT_DATA: LabelElement[] = [
  {
    labelName: 'any',
    labelDescription: 'any',
    actions: 'any',
  }
];

// ---------------- Add/Update label model start ------------------------
@Component({
  templateUrl: 'add-update-label.component.html',
})
export class AddUpdateLabelComponent implements OnInit {
  action: string;
  message: any;
  error: any;
  title: any;
  isValidFormSubmitted = true;
  identificationLableList = [];
  identificationlabel: FormGroup;
  constructor(public dialogRef: MatDialogRef<AddUpdateLabelComponent>, private serviceApi: ApiCommonService, private _fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.action = data.action;
    this.title = this.data.title;

  }

  ngOnInit() {
    if (this.action === 'add') {
      this.identificationlabel = this._fb.group(
        {
          identificationLabelId: ['0'],
          labelName: ['', Validators.required],
          labelDescription: [''],
        }
      );
    } else if (this.action === 'update') {
      this.identificationlabel = this._fb.group(
        {
          identificationLabelId: [this.data.labelInfo.identificationLabelId],
          labelName: [this.data.labelInfo.labelName],
          labelDescription: [this.data.labelInfo.labelDescription],
        }
      );
    }
  }
  onCreateLabel() {
    if (this.identificationlabel.valid) {
      this.isValidFormSubmitted = true;
      console.log('form value ' + JSON.stringify(this.identificationlabel.value));
      const body = {
        // 'identificationLabelId': this.identificationlabel.controls.identificationLabelId.value,
        'labelName': this.identificationlabel.controls.labelName.value,
        'labelDescription': this.identificationlabel.controls.labelDescription.value,
      };
      console.log('Body ---------- Json data-------   ' + JSON.stringify(body));
      return this.serviceApi.post('/v1/assets/label/create', body).
        subscribe(
          res => {
            console.log('Description Label Successfully...' + JSON.stringify(res));
            this.message = res.message;
            this.close();
          },
          err => {
          });
    } else {
      Object.keys(this.identificationlabel.controls).forEach(field => {
        const control = this.identificationlabel.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }

  onUpdateLabel() {
    console.log('form value ' + JSON.stringify(this.identificationlabel.value));
    const body = {
      'identificationLabelId': this.identificationlabel.controls.identificationLabelId.value,
      'labelName': this.identificationlabel.controls.labelName.value,
      'labelDescription': this.identificationlabel.controls.labelDescription.value,
    };
    if (this.identificationlabel.valid) {
      this.isValidFormSubmitted = true;
      const val = this.identificationlabel.controls.identificationLabelId.value;
      console.log('Body ---------- Json data-------   ' + JSON.stringify(body));
      return this.serviceApi.put('/v1/assets/label/update/' + val, body).
        subscribe(
          res => {
            console.log('Update Description Successfully...' + JSON.stringify(res));
            this.message = res.message;
            this.close();
          },
          err => {
          });
    } else {
      Object.keys(this.identificationlabel.controls).forEach(field => {
        const control = this.identificationlabel.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }

  close(): void {
    this.data.message = this.message;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    this.dialogRef.close(this.data);
  }
}
// ---------------- Add/Update label model end ------------------------

// ---------------- Delete label model start ------------------------
@Component({
  templateUrl: 'delete-label.component.html',
})
export class DeleteLabelComponent implements OnInit {
  message: any;
  status: any;
  error = 'Error Message';
  action: any;
  // identificationLabelId: any;
  constructor(public dialogRef: MatDialogRef<DeleteLabelComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private serviceApi: ApiCommonService) {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() { }
  onDelete() {
    const val = this.data.labelInfo.identificationLabelId;
    return this.serviceApi.delete('/v1/assets/label/' + val)
      .subscribe(
        res => {
          console.log('Description Delete Successfully...' + JSON.stringify(res));
          this.message = res.message;
          this.close();
        }, err => {
          console.log('there is something error.....  ' + err.message);
          this.action = 'Error';
          this.error = err.message;
          this.close();
        });
  }
  close(): void {
    this.data.message = this.message;
    this.dialogRef.close(this.data);
  }
}
// ---------------- Delete label model end ------------------------