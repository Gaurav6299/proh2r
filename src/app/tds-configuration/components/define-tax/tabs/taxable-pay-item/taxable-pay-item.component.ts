import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataTable } from 'primeng/primeng';
import { ApiCommonService } from '../../../../../../app/services/api-common.service';
declare var $: any;
@Component({
  selector: 'app-taxable-pay-item',
  templateUrl: './taxable-pay-item.component.html',
  styleUrls: ['./taxable-pay-item.component.scss']
})
export class TaxablePayItemComponent implements OnInit {
  @ViewChild('dt1') dt: DataTable;
  columns = [
    { field: 'allowanceName', header: 'Pay Item' },
    { field: 'exemptionName', header: 'Exemption' },
    { field: 'actions', header: 'Actions' }
  ];
  taxablePayItemList = [];
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
  updateExeptionDialog(element: any) {
    let dialogRef = this.dialog.open(updateExeptionDialogComponent, {
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
            this.getAlltaxablePayItems();
          }
        }
      }
    });
  }

  getAlltaxablePayItems() {
    this.taxablePayItemList = [];
    this.serviceApi.get('/v1/tax/exemption/taxable/pay-items').subscribe(res => {
      if (res != null) {
        res.forEach(element => {
          // this.cars.push(element);
          this.taxablePayItemList = [...this.taxablePayItemList, element];
        });
      }
    },
      err => { },
      () => { this.dt.reset();});

  }

  ngOnInit() {
    this.getAlltaxablePayItems();
    // this.taxablePayItemList = [{ payItem: 'House Rent Allowance(HRA)', exeptionName: 'HRA Exeption', actions: '' },
    // { payItem: 'Conveyance Allowance', exeptionName: 'Transport Exemption', actions: '' }];
  }

}

@Component({
  templateUrl: 'update-exeption-dialog.html',
})
export class updateExeptionDialogComponent implements OnInit {
  action: any;
  error: any;
  cars = [];
  payItem: any;
  exemptionId: any;
  form: any;
  constructor(public dialogRef: MatDialogRef<updateExeptionDialogComponent>, private serviceApi: ApiCommonService,private _fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.payItem = data.element;    
    this.cars = [];
    this.serviceApi.get('/v1/tax/exemption/get-all').subscribe(res => {
      if (res != null) {
        res.direct.forEach(element => {
          // this.cars.push(element);
          this.cars = [...this.cars, element];
        });
        res.indirect.forEach(element => {
          // this.cars.push(element);
          this.cars = [...this.cars, element];
        });
      }
    },
      err => { },
      () => { }
    );

    this.form = this._fb.group(
      {
        exemptionId: []
      }
    );

    this.form.controls.exemptionId.setValue(this.payItem.exemptionId);

  }
  // setData(data:any){
  //   if(data != undefined){
  //     this.exemptionId = data.exemptionId;
  //   }else{
  //     this.exemptionId = null;
  //   }
    
  // }

  Update() {
    console.log(this.form.controls.exemptionId.value);
    console.log(this.payItem);
    const body =
    {
      "exemptionId": this.form.controls.exemptionId.value,
      "taxPayItemId": this.payItem.taxPayItemId
    }

    this.serviceApi.put('/v1/tax/exemption/update/taxable/pay-items', body).subscribe(res => {
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