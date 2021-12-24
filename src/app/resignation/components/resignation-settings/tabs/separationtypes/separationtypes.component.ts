import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTable } from 'primeng/primeng';
declare var $: any;
@Component({
  selector: 'app-separationtypes',
  templateUrl: './separationtypes.component.html',
  styleUrls: ['./separationtypes.component.scss']
})
export class SeparationtypesComponent implements OnInit {
  @ViewChild("dt1") dt: DataTable;
  // displayedColumns = ['seperationType', 'description', 'visibilityStatus', 'actions'];
  columns = [
    { field: 'seperationType', header: 'Seperation Type' },
    { field: 'description', header: 'Description' },
    { field: 'visibilityStatus', header: 'Visible To Employees' },
    { field: 'actions', header: 'Actions' }
  ]
  // dataSource: MatTableDataSource<Element>;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;
  notificationMsg: String;
  separationTypeList = []
  constructor(public dialog: MatDialog, private serviceApi: ApiCommonService) { }

  ngOnInit() {
    this.getSeparationType();
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
  // applyFilter(filterValue: string) {
  //   filterValue = filterValue.trim();
  //   filterValue = filterValue.toLowerCase();
  //   this.dataSource.filter = filterValue;
  // }

  getSeparationType() {
    this.separationTypeList = [];
    this.serviceApi.get('/v1/seperationTypes/').
      subscribe(
        res => {
          console.log('separation----' + JSON.stringify(res));
          res.forEach(element => {
            this.separationTypeList.push({
              'sepTypeId': element.sepTypeId,
              'seperationType': element.seperationType,
              'description': element.description,
              'visibilityStatus': element.visibilityStatus
            });
          });
        },
        (err) => {

        },
        () => {
          this.dt.reset();
          // this.dataSource = new MatTableDataSource(this.separationTypeList)
          // this.dataSource.paginator = this.paginator;
          // this.dataSource.sort = this.sort;
        });
  }


  openAddSeparationDialog() {
    const dialogRef = this.dialog.open(AddUpdateSeparationTypeComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { action: 'add', message: this.notificationMsg, title: "Add Separation Type" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          console.log('Result value ..... ' + result.message);
          this.successNotification(result.message);
          this.getSeparationType();
        }
      }
    });
  }

  openUpdateSeparationDialog(data: any) {
    console.log('Label Info-----' + data.sepTypeId);
    const dialogRef = this.dialog.open(AddUpdateSeparationTypeComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { action: 'update', message: this.notificationMsg, labelInfo: data, title: "Update Separation Type" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          console.log('Result value ..... ' + result.message);
          this.successNotification(result.message);
          this.getSeparationType();
        }
      }
    });
  }

  openDeleteSeparationDialog(data: any) {
    const dialogRef = this.dialog.open(DeleteSeparationComponent, {
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
          this.getSeparationType();
        }
      }
    });
  }
}

export interface Element {
  description: string;
  seperationType: string;
  actions: any;
  visibilityStatus: string;
}
const ELEMENT_DATA: Element[] = [];
@Component({
  templateUrl: 'add-update-separationtypes.component.html',
})
export class AddUpdateSeparationTypeComponent implements OnInit {
  action: string;
  message: any;
  error: any;
  title: any;
  separationForm: FormGroup;
  isValidFormSubmitted = true;
  separationTypeList = [];
  constructor(public dialogRef: MatDialogRef<AddUpdateSeparationTypeComponent>, private serviceApi: ApiCommonService, private _fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.action = data.action;
    this.title = this.data.title;
  }
  ngOnInit() {
    if (this.action === 'add') {
      this.separationForm = this._fb.group(
        {
          sepTypeId: ['0'],
          seperationType: ['', Validators.required],
          description: [''],
          visibilityStatus: [false, [Validators.required]]
        }
      );
    } else if (this.action === 'update') {
      this.separationForm = this._fb.group(
        {
          sepTypeId: [this.data.labelInfo.sepTypeId],
          seperationType: [this.data.labelInfo.seperationType, [Validators.required]],
          description: [this.data.labelInfo.description],
          visibilityStatus: [this.data.labelInfo.visibilityStatus, [Validators.required]]
        }
      );
    }
  }

  onCreateSeparation() {
    if (this.separationForm.valid) {
      this.isValidFormSubmitted = true;
      console.log('form value ' + JSON.stringify(this.separationForm.value));
      const body = {
        'seperationType': this.separationForm.controls.seperationType.value,
        'description': this.separationForm.controls.description.value,
        'visibilityStatus': this.separationForm.controls.visibilityStatus.value
      };
      console.log('Body ---------- Json data-------   ' + JSON.stringify(body));
      return this.serviceApi.post('/v1/seperationTypes/', body).
        subscribe(
          res => {
            console.log('Successfully...' + JSON.stringify(res));
            this.message = res.message;
            this.close();
          },
          err => {
          });
    } else {
      Object.keys(this.separationForm.controls).forEach(field => {
        const control = this.separationForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }

  onUpdateSeparation() {
    console.log('form value ' + JSON.stringify(this.separationForm.value));
    const body = {
      'sepTypeId': this.separationForm.controls.sepTypeId.value,
      'seperationType': this.separationForm.controls.seperationType.value,
      'description': this.separationForm.controls.description.value,
      'visibilityStatus': this.separationForm.controls.visibilityStatus.value
    };
    if (this.separationForm.valid) {
      this.isValidFormSubmitted = true;
      const val = this.separationForm.controls.sepTypeId.value;
      console.log('Body ---------- Json data-------   ' + JSON.stringify(body));
      return this.serviceApi.put('/v1/seperationTypes/' + val, body).
        subscribe(
          res => {
            console.log('Update Description Successfully...' + JSON.stringify(res));
            this.message = res.message;
            this.close();
          },
          err => {
          });
    } else {
      Object.keys(this.separationForm.controls).forEach(field => {
        const control = this.separationForm.get(field);
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


@Component({
  templateUrl: 'delete-separation.component.html',
})
export class DeleteSeparationComponent implements OnInit {
  message: any;
  error = 'Error Message';
  action: any;
  constructor(public dialogRef: MatDialogRef<DeleteSeparationComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private serviceApi: ApiCommonService) {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() { }
  onDelete() {
    const val = this.data.labelInfo.sepTypeId;
    return this.serviceApi.delete('/v1/seperationTypes/' + val)
      .subscribe(
        res => {
          console.log('Separation Delete Successfully...' + JSON.stringify(res));
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
