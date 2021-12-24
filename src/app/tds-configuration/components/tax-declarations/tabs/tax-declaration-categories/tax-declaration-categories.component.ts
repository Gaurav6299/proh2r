import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataTable } from 'primeng/primeng';
import { ApiCommonService } from '../../../../../../app/services/api-common.service';
declare var $: any;
@Component({
  selector: 'app-tax-declaration-categories',
  templateUrl: './tax-declaration-categories.component.html',
  styleUrls: ['./tax-declaration-categories.component.scss']
})
export class TaxDeclarationCategoriesComponent implements OnInit {
  @ViewChild('dt1') dt: DataTable;
  columns = [
    { field: 'categoryName', header: 'Declaration Category Name' },
    { field: 'maximumAmount', header: 'Maximum Amount' },
    { field: 'actions', header: 'Actions' },
  ];
  taxDeclarationCategoryList = [];
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
  addTaxDecalarationCategoryDialog() {
    let dialogRef = this.dialog.open(AddUpdateTaxDeclarationCategoryDialogComponent, {
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
            this.getTaxCategories();
          }
        }
      }
    });
  }

  deleteTaxDecalarationCategoryDialog(data: any) {
    let dialogRef = this.dialog.open(DeleteTaxDeclarationCategoriesComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: {taxCategoryId: data.taxDeclarationCategoryId}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        if (result.status === 'Response') {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            this.successNotification(result.message);
            this.getTaxCategories();
          }
        }
      }
    });
  }

  updateTaxDecalarationCategoryDialog(element: any) {
    let dialogRef = this.dialog.open(AddUpdateTaxDeclarationCategoryDialogComponent, {
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
            this.getTaxCategories();
          }
        }
      }
    });
  }

  getTaxCategories() {
    this.taxDeclarationCategoryList = [];
    this.serviceApi.get('/v1/taxDeclaration/taxCategory/get-all').subscribe(res => {
      if (res != null) {
        res.forEach(element => {
          // this.taxDeclarationCategoryList.push(element);
          this.taxDeclarationCategoryList = [...this.taxDeclarationCategoryList, element];
        });
      }
    },
      err => { },
      () => {this.dt.reset(); });
  }



  ngOnInit() {
    // this.taxDeclarationCategoryList = [{ categoryName: 'Income from other than Saving Bank Interest', maximumAmount: '250000.00', actions: '' }];
    this.getTaxCategories();
  }

}
@Component({
  templateUrl: 'add-update-tax-declaration-categories-dialog.html',
})
export class AddUpdateTaxDeclarationCategoryDialogComponent implements OnInit {
  action: any;
  error: any;
  categoryForm: FormGroup;
  showHide: boolean = true;
  constructor(public dialogRef: MatDialogRef<AddUpdateTaxDeclarationCategoryDialogComponent>, private serviceApi: ApiCommonService, private _fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.categoryForm = this._fb.group(
      {
        categoryId: [],
        categoryName: ['', Validators.required],
        maximumAmount: ['', Validators.required],
        default: []
      }
    );
    if (data.element != null) {
      this.categoryForm.controls.categoryId.setValue(data.element.taxDeclarationCategoryId);
      this.categoryForm.controls.categoryName.setValue(data.element.categoryName);
      this.categoryForm.controls.maximumAmount.setValue(data.element.maximumAmount);
      this.categoryForm.controls.default.setValue(data.element.default);
      this.showHide = false;
    }
  }


  saveUpdate() {
    if (this.categoryForm.valid) {
      console.log(this.categoryForm.value);
      if (this.categoryForm.value.categoryId == null) {
        const body =
        {
          "categoryName": this.categoryForm.value.categoryName,
          "maximumAmount": this.categoryForm.value.maximumAmount,
          "default": false,
          // "taxDeclarationCategoryId": 0
        }
        this.serviceApi.post('/v1/taxDeclaration/taxCategory/save', body).subscribe(res => {
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
          "categoryName": this.categoryForm.value.categoryName,
          "maximumAmount": this.categoryForm.value.maximumAmount,
          "taxDeclarationCategoryId": this.categoryForm.value.categoryId,
          "default": this.categoryForm.value.default,
        }
        this.serviceApi.put('/v1/taxDeclaration/taxCategory/update', body).subscribe(res => {
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
      Object.keys(this.categoryForm.controls).forEach(field => { // {1}
        const control = this.categoryForm.get(field);            // {2}
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
  templateUrl: './delete-tax-declaration-categories-component.html',
})
export class DeleteTaxDeclarationCategoriesComponent implements OnInit {
  error: any;
  message: any;
  action: any;
  taxCategoryId: any;
  constructor(public dialogRef: MatDialogRef<DeleteTaxDeclarationCategoriesComponent>, private serviceApi: ApiCommonService, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.taxCategoryId = this.data.taxCategoryId;
   }

  ngOnInit() {
  }
  onDelete() {
    return this.serviceApi.delete('/v1/taxDeclaration/taxCategory/delete/' + this.taxCategoryId)
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
    this.data.message = this.message;
    this.data.action = this.action;
    this.dialogRef.close(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}