import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataTable } from 'primeng/primeng';
import { ApiCommonService } from '../../../../../../app/services/api-common.service';
declare var $: any;

@Component({
  selector: 'app-tax-declaration-category-settings',
  templateUrl: './tax-declaration-category-settings.component.html',
  styleUrls: ['./tax-declaration-category-settings.component.scss']
})
export class TaxDeclarationCategorySettingsComponent implements OnInit {
  @ViewChild('dt1') dt: DataTable;
  columns = [
    { field: 'componentName', header: 'Declaration Component' },
    { field: 'sectionName', header: 'Section' },
    { field: 'maximumAmount', header: 'Maximum Amount' },
    { field: 'activeStatus', header: 'Active' },
    { field: 'workFlowRequired', header: 'Work Flow' },
    { field: 'attachmentValidation', header: 'Attachment' },
    { field: 'actions', header: 'Actions' },
  ];
  cars = [];
  category: any
  taxDeclarationSettingList = [];
  categoryMaxAmount: any;
  constructor(public dialog: MatDialog, private serviceApi: ApiCommonService, ) {

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
  addTaxDecalarationSettingDialog() {
    if (this.category != undefined) {
      let dialogRef = this.dialog.open(AddUpdateTaxDeclarationCategorySettingDialogComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: { element: null, categoryId: this.category.taxDeclarationCategoryId }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != undefined) {
          if (result.status === 'Response') {
            console.log('Result value ..... ' + JSON.stringify(result));
            if (result.message) {
              this.successNotification(result.message);
              this.getTaxComponents(this.category)
            }
          }
        }
      });
    } else {
      this.warningNotification("Select the Category first.");
    }

  }
  updateTaxDecalarationSettingDialog(element: any) {
    if (this.category != undefined) {
      let dialogRef = this.dialog.open(AddUpdateTaxDeclarationCategorySettingDialogComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: { element: element, categoryId: this.category.taxDeclarationCategoryId }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != undefined) {
          if (result.status === 'Response') {
            console.log('Result value ..... ' + JSON.stringify(result));
            if (result.message) {
              this.successNotification(result.message);
              this.getTaxComponents(this.category)
            }
          }
        }
      });
    } else {
      this.warningNotification("Select the Category first.");
    }
  }
  deleteTaxDecalarationSettingDialog(data: any) {
    if (this.category != undefined) {
      let dialogRef = this.dialog.open(DeleteTaxDeclarationCategorysettingsComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: { taxCompoenentId: data.taxDeclarationComponentId }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != undefined) {
          if (result.status === 'Response') {
            console.log('Result value ..... ' + JSON.stringify(result));
            if (result.message) {
              this.successNotification(result.message);
              this.getTaxComponents(this.category)
            }
          }
        }
      });
    } else {
      this.warningNotification("Select the Category first.");
    }
  }

  getTaxCategories() {
    this.cars = [];
    this.serviceApi.get('/v1/taxDeclaration/taxCategory/get-all').subscribe(res => {
      if (res != null) {
        res.forEach(element => {
          // this.cars.push(element);
          this.cars = [...this.cars, element];
        });
      }
    },
      err => { },
      () => { });
  }

  getTaxComponents(taxCategory: any) {
    this.taxDeclarationSettingList = [];
    this.serviceApi.get('/v1/taxDeclaration/taxComponent/get-all/' + taxCategory.taxDeclarationCategoryId).subscribe(res => {
      if (res != null) {
        res.forEach(element => {
          // this.taxDeclarationSettingList.push(element);
          this.taxDeclarationSettingList = [...this.taxDeclarationSettingList, element];
        });
      }
    },
      err => { },
      () => {
        this.categoryMaxAmount = taxCategory.maximumAmount;
        this.dt.reset();
      });
  }

  ngOnInit() {
  }



}

@Component({
  templateUrl: 'update-tax-declaration-settings.html',
})
export class updateTaxDeclarationSettingsDialog implements OnInit {
  action: any;
  error: any;
  taxComponentForm: FormGroup;
  taxCategoryId: any;
  showHide: boolean = true;
  message: any;
  update: Boolean = false;
  constructor(public dialogRef: MatDialogRef<updateTaxDeclarationSettingsDialog>, private serviceApi: ApiCommonService, private _fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(this.data);
  }
  ngOnInit() {
  }

  close(): void {
    this.data.message = this.update;
    this.dialogRef.close(this.data);
  }

  onNoClick(): void {
    this.data.message = this.update;
    this.dialogRef.close();
  }

  updateSettings() {
    this.update = true;
    this.close();
  }
}




@Component({
  templateUrl: 'add-update-tax-declaration-category-settings-dialog.html',
})
export class AddUpdateTaxDeclarationCategorySettingDialogComponent implements OnInit {
  action: any;
  error: any;
  taxComponentForm: FormGroup;
  taxCategoryId: any;
  showHide: boolean = true;
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<AddUpdateTaxDeclarationCategorySettingDialogComponent>, private serviceApi: ApiCommonService, private _fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any) {

    this.taxComponentForm = this._fb.group(
      {
        // taxDeclarationCategoryId: [],
        taxDeclarationComponentId: [],
        componentName: ['', Validators.required],
        maximumAmount: ['', Validators.required],
        default: [],
        activeStatus: [],
        attachmentValidation: [],
        workFlowRequired: [],
        sectionName: []
      }
    );
    if (data.element != null) {
      this.taxComponentForm.controls.taxDeclarationComponentId.setValue(data.element.taxDeclarationComponentId);
      this.taxComponentForm.controls.componentName.setValue(data.element.componentName);
      this.taxComponentForm.controls.maximumAmount.setValue(data.element.maximumAmount);
      this.taxComponentForm.controls.default.setValue(data.element.default);
      this.taxComponentForm.controls.activeStatus.setValue(data.element.activeStatus);
      this.taxComponentForm.controls.attachmentValidation.setValue(data.element.attachmentValidation);
      this.taxComponentForm.controls.workFlowRequired.setValue(data.element.workFlowRequired);
      this.showHide = false;
    }
    this.taxCategoryId = data.categoryId;
  }


  saveUpdate() {
    if (this.taxComponentForm.valid) {
      console.log(this.taxComponentForm.value);
      if (this.taxComponentForm.value.taxDeclarationComponentId == null) {
        const body = {
          "activeStatus": this.taxComponentForm.controls.activeStatus.value != null ? this.taxComponentForm.controls.activeStatus.value : false,
          "attachmentValidation": this.taxComponentForm.controls.attachmentValidation.value != null ? this.taxComponentForm.controls.attachmentValidation.value : false,
          "componentName": this.taxComponentForm.controls.componentName.value,
          "default": false,
          "maximumAmount": this.taxComponentForm.controls.maximumAmount.value,
          "taxDeclarationCategoryId": this.taxCategoryId,
          "sectionName": this.taxComponentForm.controls.sectionName.value,
          // "taxDeclarationComponentId": this.taxComponentForm.controls.taxDeclarationComponentId.value,
          "workFlowRequired": this.taxComponentForm.controls.workFlowRequired.value != null ? this.taxComponentForm.controls.workFlowRequired.value : false
        }
        this.serviceApi.post('/v1/taxDeclaration/taxComponent/save', body).subscribe(res => {
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
          "activeStatus": this.taxComponentForm.controls.activeStatus.value,
          "attachmentValidation": this.taxComponentForm.controls.attachmentValidation.value,
          "componentName": this.taxComponentForm.controls.componentName.value,
          "default": this.taxComponentForm.controls.default.value,
          "maximumAmount": this.taxComponentForm.controls.maximumAmount.value,
          "taxDeclarationCategoryId": this.taxCategoryId,
          "taxDeclarationComponentId": this.taxComponentForm.controls.taxDeclarationComponentId.value,
          "workFlowRequired": this.taxComponentForm.controls.workFlowRequired.value,
          "sectionName": this.taxComponentForm.controls.sectionName.value,
        }
        this.serviceApi.put('/v1/taxDeclaration/taxComponent/update', body).subscribe(res => {
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
      Object.keys(this.taxComponentForm.controls).forEach(field => { // {1}
        const control = this.taxComponentForm.get(field);            // {2}
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

  updatecategory() {
    if (!this.taxComponentForm.controls.activeStatus.value) {
      let dialogRef = this.dialog.open(updateTaxDeclarationSettingsDialog, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: this.taxComponentForm.value
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != undefined && result.message) {
          this.saveUpdate();
        }
      });
    } else {
      this.saveUpdate();
    }

  }
}

@Component({
  templateUrl: './delete-tax-declaration-category-settings-component.html',
})
export class DeleteTaxDeclarationCategorysettingsComponent implements OnInit {
  error: any;
  message: any;
  action: any;
  taxCompoenentId: any;
  constructor(public dialogRef: MatDialogRef<DeleteTaxDeclarationCategorysettingsComponent>, private serviceApi: ApiCommonService, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.taxCompoenentId = this.data.taxCompoenentId;
  }

  ngOnInit() {
  }
  onDelete() {
    return this.serviceApi.delete('/v1/taxDeclaration/taxComponent/delete/' + this.taxCompoenentId)
      .subscribe(
      res => {
        console.log('Applied Leave Successfully...' + JSON.stringify(res));
        this.action = 'Response';
        this.message = res.message;
        this.close();
      },
      err => {
        console.log('there is something error.....  ' + err.message);
        this.action = 'Error';
        this.message = err.message;
        this.close();
      },
    );
  }
  close(): void {
    this.data.message = this.message;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
