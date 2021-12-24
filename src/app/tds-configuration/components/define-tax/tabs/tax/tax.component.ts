import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataTable } from 'primeng/primeng';
import { ApiCommonService } from '../../../../../../app/services/api-common.service';
declare var $: any;

@Component({
  selector: 'app-tax',
  templateUrl: './tax.component.html',
  styleUrls: ['./tax.component.scss']
})
export class TaxComponent implements OnInit {
  @ViewChild('dt1') dt: DataTable;
  columns = [
    { field: 'fromAmount', header: 'From' },
    { field: 'toAmount', header: 'To' },
    { field: 'taxPercentage', header: 'Employee Percentage' },
    { field: '_87RebateAmount', header: '87 Rebate Amount' },
    { field: 'actions', header: 'Actions' },
  ];
  taxSlabTableItemList = [];
  taxPayerItemList = [];
  taxCriteria:any;
  action: string;
  error: any;
  constructor(public dialog: MatDialog, private serviceApi: ApiCommonService,) {
    this.getTaxCriteria();
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
      () => { });
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
  addTaxDialog() {
    if(this.taxCriteria != undefined ){
      let dialogRef = this.dialog.open(addUpdateTaxDialogComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: { element: null, taxCriteria: this.taxCriteria}
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != undefined) {
          if (result.status === 'Response') {
            console.log('Result value ..... ' + JSON.stringify(result));
            if (result.message) {
              this.successNotification(result.message);
              this.getSlabs(this.taxCriteria)
            }
          }
        }
      });
    }else{
      this.warningNotification("Select the Criteria first.");
    }
  }
  updateTaxDialog(element: any) {
    if(this.taxCriteria != undefined ){
    let dialogRef = this.dialog.open(addUpdateTaxDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { element: element, taxCriteria: this.taxCriteria}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        if (result.status === 'Response') {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            this.successNotification(result.message);
            this.getSlabs(this.taxCriteria)
          }
        }
      }
    });
  }else{
    this.warningNotification("Select the Criteria first.");
  }
  }

  delete(element:any){
    const dialogRef = this.dialog.open(DeleteTaxSlabDialog, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { taxCriteriaSlabId: element.taxCriteriaSlabId }
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

  getSlabs(criteria: any){
    console.log(criteria);
    this.taxSlabTableItemList = [];
    this.serviceApi.get('/v1/tax/criteria/get-all/slabs/'+criteria).subscribe(res => {
      if (res != null) {
        res.forEach(element => {
          this.taxSlabTableItemList.push(element);
        });
      }
    },
      err => { },
      () => {this.dt.reset();});
  }


  ngOnInit() {
    // this.taxSlabTableItemList = [{ from: '0.00', to: '250000.00', empPercentage: '0.00', actions: '' }];
  }

}
@Component({
  templateUrl: 'add-update-tax-dialog.html',
})
export class addUpdateTaxDialogComponent implements OnInit {
  action: any;
  error: any;
  criteriaSlabForm: FormGroup;
  criteriaForm: any;
  showHide: boolean = true;
  taxCriteriaId: any;
  constructor(public dialogRef: MatDialogRef<addUpdateTaxDialogComponent>, private serviceApi: ApiCommonService,private _fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any) {

    this.criteriaSlabForm = this._fb.group(
      {
        taxCriteriaSlabId: [],
        fromAmount: ['', Validators.required],
        toAmount: ['', Validators.required],
        taxPercentage: ['', Validators.required],
        _87RebateAmount: ['', Validators.required],
      }
    );
    if (data.element != null) {
      this.criteriaSlabForm.controls.taxCriteriaSlabId.setValue(data.element.taxCriteriaSlabId);
      this.criteriaSlabForm.controls.fromAmount.setValue(data.element.fromAmount);
      this.criteriaSlabForm.controls.toAmount.setValue(data.element.toAmount);
      this.criteriaSlabForm.controls.taxPercentage.setValue(data.element.taxPercentage);
      this.criteriaSlabForm.controls._87RebateAmount.setValue(data.element._87RebateAmount);
      this.showHide = false;
    }
    this.taxCriteriaId = data.taxCriteria;
   }



   saveUpdate() {
    if (this.criteriaSlabForm.valid) {
      console.log(this.criteriaSlabForm.value);
      if (this.criteriaSlabForm.value.taxCriteriaSlabId == null) {
        const body = {
          "_87RebateAmount": this.criteriaSlabForm.controls._87RebateAmount.value,
          "fromAmount": this.criteriaSlabForm.controls.fromAmount.value,
          "taxCriteriaId": this.taxCriteriaId,
          "taxPercentage": this.criteriaSlabForm.controls.taxPercentage.value,
          "toAmount": this.criteriaSlabForm.controls.toAmount.value
        }
        this.serviceApi.post('/v1/tax/criteria/save/slab', body).subscribe(res => {
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
          "_87RebateAmount": this.criteriaSlabForm.controls._87RebateAmount.value,
          "fromAmount": this.criteriaSlabForm.controls.fromAmount.value,
          "taxCriteriaId": this.taxCriteriaId,
          "taxPercentage": this.criteriaSlabForm.controls.taxPercentage.value,
          "toAmount": this.criteriaSlabForm.controls.toAmount.value,
          "taxCriteriaSlabId": this.criteriaSlabForm.controls.taxCriteriaSlabId.value,
      
        }
        this.serviceApi.put('/v1/tax/criteria/update/slab', body).subscribe(res => {
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
      Object.keys(this.criteriaSlabForm.controls).forEach(field => { // {1}
        const control = this.criteriaSlabForm.get(field);            // {2}
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
  templateUrl: 'delete-tax-slab.html',
  styleUrls: ['delete.scss'],
})
// tslint:disable-next-line:component-class-suffix
export class DeleteTaxSlabDialog {
  error = 'Error Message';
  action: any;
  taxCriteriaSlabId: any;
  message: any;
  status: any;
  constructor(
    public dialogRef: MatDialogRef<DeleteTaxSlabDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    this.taxCriteriaSlabId = this.data.taxCriteriaSlabId;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  onDelete() {
    return this.serviceApi.delete('/v1/tax/criteria/slab/delete/' + this.taxCriteriaSlabId)
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
