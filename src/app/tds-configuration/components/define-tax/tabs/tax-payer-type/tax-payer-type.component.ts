import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataTable } from 'primeng/primeng';
import { ApiCommonService } from '../../../../../../app/services/api-common.service';
declare var $: any;

@Component({
  selector: 'app-tax-payer-type',
  templateUrl: './tax-payer-type.component.html',
  styleUrls: ['./tax-payer-type.component.scss']
})
export class TaxPayerTypeComponent implements OnInit {
  @ViewChild('dt1') dt: DataTable;
  columns = [
    { field: 'criteriaName', header: 'Tax Criteria' },
    { field: 'actions', header: 'Actions' },
  ];
  taxPayerItemList = [];
  constructor(public dialog: MatDialog, private serviceApi: ApiCommonService,) { }
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
  addTaxCriteriaDialog() {
    let dialogRef = this.dialog.open(addUpdateTaxCriteriaDialogComponent, {
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
            this.getTaxCriteria();
          }
        }
      }
    });
  }
  updateTaxCriteriaDialog(element: any) {
    let dialogRef = this.dialog.open(addUpdateTaxCriteriaDialogComponent, {
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
            this.getTaxCriteria();
          }
        }
      }
    });
  }


  
 delete(data: any) {
      const dialogRef = this.dialog.open(DeleteTaxCriteriaDialog, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: { taxCriteriaId: data.taxCriteriaId }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            console.log('Result value ..... ' + result.message);
            if (result.status === 'Response') {
              this.successNotification(result.message);
            }
            else if (result.status === 'Error') {
              // this.errorMessage = result.message;
            }
          }
          this.getTaxCriteria();
        }
        console.log('The dialog was closed');
      });
    
  }

  getTaxCriteria() {
    this.taxPayerItemList = [];
    this.serviceApi.get('/v1/tax/criteria/get-all').subscribe(res => {
      if (res != null) {
        res.forEach(element => {
          this.taxPayerItemList.push(element);
        });
      }
    },
      err => { },
      () => {this.dt.reset(); });
  }


  ngOnInit() {
    this.getTaxCriteria();
  }

}
@Component({
  templateUrl: 'add-update-tax-criteria-dialog.html',
})
export class addUpdateTaxCriteriaDialogComponent implements OnInit {
  action: any;
  error: any;
  criteriaId: any;
  criteriaForm: FormGroup;
  showHide: boolean = true;
  constructor(public dialogRef: MatDialogRef<addUpdateTaxCriteriaDialogComponent>, private serviceApi: ApiCommonService, private _fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any) {
    
    this.criteriaForm = this._fb.group(
      {
        criteriaId: [],
        criteriaName: ['', Validators.required]
      }
    );
    if (data.element != null) {
      this.criteriaForm.controls.criteriaId.setValue(data.element.taxCriteriaId);
      this.criteriaForm.controls.criteriaName.setValue(data.element.criteriaName);
      this.showHide = false;
    }
  }
  ngOnInit() {
    
  }

  saveUpdate() {
    if (this.criteriaForm.valid) {
      console.log(this.criteriaForm.value.criteriaName);
      if (this.criteriaForm.value.criteriaId == null) {
        const body = {
          "criteriaName": this.criteriaForm.value.criteriaName
        }
        this.serviceApi.post('/v1/tax/criteria/save', body).subscribe(res => {
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
          "criteriaName": this.criteriaForm.value.criteriaName,
          "taxCriteriaId": this.criteriaForm.value.criteriaId
        }
        this.serviceApi.put('/v1/tax/criteria/update', body).subscribe(res => {
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
      Object.keys(this.criteriaForm.controls).forEach(field => { // {1}
        const control = this.criteriaForm.get(field);            // {2}
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

@Component({
  templateUrl: 'delete-tax-criteria.html',
  styleUrls: ['delete.scss'],
})
// tslint:disable-next-line:component-class-suffix
export class DeleteTaxCriteriaDialog {
  error = 'Error Message';
  action: any;
  taxCriteriaId: any;
  message: any;
  status: any;
  constructor(
    public dialogRef: MatDialogRef<DeleteTaxCriteriaDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    this.taxCriteriaId = this.data.taxCriteriaId;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  onDelete() {
    return this.serviceApi.delete('/v1/tax/criteria/delete/' + this.taxCriteriaId)
      .subscribe(
        res => {
          console.log('Applied Leave Successfully...' + JSON.stringify(res));
          this.action = 'Response';
          this.error = res.message;
          this.close();
        },
        err => {
          console.log('there is something error.....  ' + err.message);
          this.action = 'Error';
          this.error = err.message;
          this.close();
        },
      );
  }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }


}
