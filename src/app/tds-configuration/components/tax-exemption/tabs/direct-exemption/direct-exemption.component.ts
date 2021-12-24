import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { element } from '@angular/core/src/render3/instructions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataTable } from 'primeng/primeng';
import { ApiCommonService } from '../../../../../../app/services/api-common.service';
declare var $: any;

@Component({
  selector: 'app-direct-exemption',
  templateUrl: './direct-exemption.component.html',
  styleUrls: ['./direct-exemption.component.scss']
})
export class DirectExemptionComponent implements OnInit {
  @ViewChild('dt1') dt: DataTable;
  columns = [
    { field: 'exemptionName', header: 'Exemption' },
    { field: 'value', header: 'Value' },
    { field: 'actions', header: 'Actions' },
  ];
  directExemptionList = [];
  constructor(public dialog: MatDialog, private serviceApi: ApiCommonService, private _fb: FormBuilder,) {
    this.getAllDirectExemptions();
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
  addDirectExemptionDialog() {
    let dialogRef = this.dialog.open(AddUpdateDirectExemptionDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { element: null }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        if (result.status === 'Response') {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            this.successNotification(result.message);
            this.getAllDirectExemptions();
          }
        }
      }
    });
  }
  updateDirectExemptionDialog(element: any) {
    let dialogRef = this.dialog.open(AddUpdateDirectExemptionDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { element: element }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        if (result.status === 'Response') {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            this.successNotification(result.message);
            this.getAllDirectExemptions();
          }
        }
      }
    });
  }
  deleteDirectExemptionDialog(element: any) {
    let dialogRef = this.dialog.open(DeleteDirectExemptionComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { exemptionId: element.exemptionId }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.successNotification(result.message);
        this.getAllDirectExemptions();
      }
    });
  }

  getAllDirectExemptions() {
    this.directExemptionList = [];
    this.serviceApi.get('/v1/tax/exemption/get-all').subscribe(res => {
      if (res != null) {
        res.direct.forEach(element => {
          // this.cars.push(element);
          this.directExemptionList = [...this.directExemptionList, element];
        });
      }
    },
      err => { },
      () => {
        this.dt.reset();
      });
  }
  ngOnInit() { }

}
@Component({
  templateUrl: 'add-update-direct-exemption-dialog.html',
})
export class AddUpdateDirectExemptionDialogComponent implements OnInit {
  action: any;
  error: any;
  directExamptionForm: FormGroup;
  showHide: boolean = true;
  constructor(public dialogRef: MatDialogRef<AddUpdateDirectExemptionDialogComponent>, private serviceApi: ApiCommonService, private _fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.directExamptionForm = this._fb.group(
      {
        exemptionId: [],
        exemptionName: ['', Validators.required],
        maxDependents: 0,
        taxExemptionType: ["DIRECT"],
        maxValue: ['', Validators.required]
      }
    );
    if (data.element != null) {
      this.directExamptionForm.controls.exemptionId.setValue(data.element.exemptionId);
      this.directExamptionForm.controls.exemptionName.setValue(data.element.exemptionName);
      this.directExamptionForm.controls.maxDependents.setValue(data.element.maxDependents);
      this.directExamptionForm.controls.taxExemptionType.setValue(data.element.taxExemptionType);
      this.directExamptionForm.controls.maxValue.setValue(data.element.value);

      this.showHide = false;
    }

  }

  saveUpdate() {
    if (this.directExamptionForm.valid) {
      console.log(this.directExamptionForm.value);
      if (this.directExamptionForm.value.categoryId == null) {
        const body =
        {
          "exemptionId": this.directExamptionForm.controls.exemptionId.value,
          "exemptionName": this.directExamptionForm.controls.exemptionName.value,
          "maxDependents": this.directExamptionForm.controls.maxDependents.value,
          "taxExemptionType": "DIRECT",
          "value": this.directExamptionForm.controls.maxValue.value
        }
        this.serviceApi.post('/v1/tax/exemption/', body).subscribe(res => {
          console.log('success.....');
          this.action = 'Response';
          this.error = res.message;
          this.close();

        }, err => {
          console.log('there is something error.....  ' + err.message);
          this.action = 'Error';
          this.error = err.message;
          // this.close();
        }, () => {
        })
      } else {
        const body = {
          "exemptionId": this.directExamptionForm.controls.exemptionId.value,
          "exemptionName": this.directExamptionForm.controls.exemptionName.value,
          "maxDependents": this.directExamptionForm.controls.maxDependents.value,
          "taxExemptionType": this.directExamptionForm.controls.taxExemptionType.value,
          "value": this.directExamptionForm.controls.maxValue.value
        }
        this.serviceApi.put('/v1/tax/exemption/', body).subscribe(res => {
          console.log('success.....');
          this.action = 'Response';
          this.error = res.message;
          this.close();

        }, err => {
          console.log('there is something error.....  ' + err.message);
          this.action = 'Error';
          this.error = err.message;
          // this.close();
        }, () => {
        })
      }

    } else {
      Object.keys(this.directExamptionForm.controls).forEach(field => { // {1}
        const control = this.directExamptionForm.get(field);            // {2}
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
  templateUrl: './delete-direct-exemption-component.html',
})
export class DeleteDirectExemptionComponent implements OnInit {
  error: any;
  message: any;
  action: any;
  exemptionId: any;
  constructor(public dialogRef: MatDialogRef<DeleteDirectExemptionComponent>, private serviceApi: ApiCommonService, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.exemptionId = data.exemptionId;
  }

  ngOnInit() {
  }
  onDelete() {
    this.serviceApi.delete('/v1/tax/exemption/' + this.exemptionId).subscribe(
      res => {
        console.log('Tax Delete Saved...' + JSON.stringify(res));
        if (res != null) {
          this.message = res.message;
          this.close();
        } else {
        }
      }, err => {
        console.log('Something gone Wrong');
        console.log('err -->' + err);
      }, () => { });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  close(): void {
    this.data.message = this.message;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
}
