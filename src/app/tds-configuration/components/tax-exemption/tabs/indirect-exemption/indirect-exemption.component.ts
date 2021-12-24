import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataTable } from 'primeng/primeng';
import { ApiCommonService } from '../../../../../../app/services/api-common.service';
declare var $: any;

@Component({
  selector: 'app-indirect-exemption',
  templateUrl: './indirect-exemption.component.html',
  styleUrls: ['./indirect-exemption.component.scss']
})
export class IndirectExemptionComponent implements OnInit {
  @ViewChild('dt1') dt: DataTable;
  columns = [
    { field: 'exemptionName', header: 'Exemptions' },
    { field: 'value', header: 'Value' },
    { field: 'actions', header: 'Actions' },
  ];
  indirectExemptionList = [];
  constructor(public dialog: MatDialog,  private serviceApi: ApiCommonService, private _fb: FormBuilder,) { }
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
  updateInDirectExemptionDialog(element:any) {
    let dialogRef = this.dialog.open(UpdateInDirectExemptionDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: {element: element}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        if (result.status === 'Response') {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            this.successNotification(result.message);
            this.getAllIndirectExemptions();
          }
        }
      }
    });
  }
  getAllIndirectExemptions(){
    
    this.indirectExemptionList = [];
    this.serviceApi.get('/v1/tax/exemption/get-all').subscribe(res => {
      if (res != null) {
        res.indirect.forEach(element => {
          // this.cars.push(element);
          this.indirectExemptionList = [...this.indirectExemptionList, element];
        });
      }
    },
      err => { },
      () => {this.dt.reset(); });

  }
  ngOnInit() {
    this.getAllIndirectExemptions();
    // this.indirectExemptionList = [{ exemptionName: 'Indirect', value: '250000.00', actions: '' }];
  }

}
@Component({
  templateUrl: 'update-indirect-exemption-dialog.html',
})
export class UpdateInDirectExemptionDialogComponent implements OnInit {
  action: any;
  error: any;
  indirectExamptionForm: FormGroup;
  // showHide: boolean;
  constructor(public dialogRef: MatDialogRef<UpdateInDirectExemptionDialogComponent>,private serviceApi: ApiCommonService, private _fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any) { 
    this.indirectExamptionForm = this._fb.group(
      {
        exemptionId: [],
        exemptionName: ['',Validators.required],
        maxDependents: ['',Validators.required],
        taxExemptionType: ["INDIRECT"],
        maxValue: ['',Validators.required]
      }
    );
    // if (data.element != null) {
      this.indirectExamptionForm.controls.exemptionId.setValue(data.element.exemptionId);
      this.indirectExamptionForm.controls.exemptionName.setValue(data.element.exemptionName);
      this.indirectExamptionForm.controls.maxDependents.setValue(data.element.maxDependents);
      this.indirectExamptionForm.controls.taxExemptionType.setValue(data.element.taxExemptionType);
      this.indirectExamptionForm.controls.maxValue.setValue(data.element.value);
      
      // this.showHide = false;
    // }
  }

  ngOnInit() {
  }
  Update() {
    if (this.indirectExamptionForm.valid) {
      console.log(this.indirectExamptionForm.value);
        const body = {
          "exemptionId":  this.indirectExamptionForm.controls.exemptionId.value,
          "exemptionName": this.indirectExamptionForm.controls.exemptionName.value,
          "maxDependents": this.indirectExamptionForm.controls.maxDependents.value,
          "taxExemptionType": this.indirectExamptionForm.controls.taxExemptionType.value,
          "value": this.indirectExamptionForm.controls.maxValue.value
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

    } else {
      Object.keys(this.indirectExamptionForm.controls).forEach(field => { // {1}
        const control = this.indirectExamptionForm.get(field);            // {2}
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

