import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ApiCommonService } from '../../../../services/api-common.service';
import { FormControl, FormBuilder, FormGroup, Validators, FormArray, } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator'
import { DataTable } from 'primeng/primeng';
declare var $: any;

@Component({
  selector: 'app-organization-assets',
  templateUrl: './organization-assets.component.html',
  styleUrls: ['./organization-assets.component.scss']
})
export class OrganizationAssetsComponent implements OnInit {
  @ViewChild("dt1") dt: DataTable;
  // displayedColumns: string[] = ['assetName', 'categoryName', 'description', 'action'];
  columns = [
    { field: 'assetName', header: 'Asset Name' },
    { field: 'assetCategory', header: 'Category Name' },
    { field: 'assetDescription', header: 'Description' },
    { field: 'actions', header: 'Actions' },
  ]
  dataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  assetsList = [];
  identificationLabelList = [];
  categoriesList = [];
  notificationMsg: any;
  constructor(public dialog: MatDialog, private serviceApi: ApiCommonService) {

  }
  ngOnInit() {
    this.getAllAssetsList();
    this.getAllCategories();
    this.getAllIdentificationLabel();
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

  getAllAssetsList() {
    console.log('Enter inside getAllAssetsList ');
    this.assetsList = [];
    this.serviceApi.get('/v1/organization/assets/list').subscribe(
      res => {
        if (res != null) {
          res.forEach(element => {
            console.log('Response ----' + element);
            this.assetsList.push({
              'assetId': element.assetId,
              'assetName': element.assetName,
              'assetDescription': element.assetDescription,
              'assetCategory': element.assetCategory,
              'identificationLabel': element.identificationLabel
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

  //open dialog for add asset categories
  openAddAssetDialog() {
    const dialogRef = this.dialog.open(AddUpdateAssetComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { action: 'add', message: this.notificationMsg, identificationLabelList: this.identificationLabelList, categoriesList: this.categoriesList }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed....................' + result.message);
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message !== null) {
          this.notificationMsg = result.message;
          this.successNotification(this.notificationMsg);
          this.getAllAssetsList();
        }
      }
    });

  }
  //open dialog for update asset categories
  openUpdateAssetDialog(data: any) {
    const dialogRef = this.dialog.open(AddUpdateAssetComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { action: 'update', message: this.notificationMsg, assetInfo: data, identificationLabelList: this.identificationLabelList, categoriesList: this.categoriesList }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed....................' + result.message);
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message !== null) {
          this.notificationMsg = result.message;
          this.successNotification(this.notificationMsg);
          this.getAllAssetsList();
        }
      }
    });

  }
  //open dialog for delete asset categories
  openDeleteAssetDialog(data: any) {
    const dialogRef = this.dialog.open(DeleteAssetComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { assetInfo: data, message: this.notificationMsg }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed....................' + result.message);
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message !== null) {
          this.notificationMsg = result.message;
          this.successNotification(this.notificationMsg);
          this.getAllAssetsList();
        }
      }
    });
  }


  getAllIdentificationLabel() {
    console.log('Enter inside getAllIdentificationLabel ');
    this.identificationLabelList = [];
    this.serviceApi.get('/v1/assets/label/list').subscribe(
      res => {
        if (res != null) {
          res.forEach(element => {
            console.log('Response ----' + element);
            this.identificationLabelList.push({
              'identificationLabelId': element.identificationLabelId,
              'labelDescription': element.labelDescription,
              'labelName': element.labelName
            });
          });
        } else {
          console.log('There is no any response from Database');
        }
      },
      err => {

      },
      () => { });
  }
  getAllCategories() {
    console.log('Enter inside getAllCategories ');
    this.categoriesList = [];
    this.serviceApi.get('/v1/assets/category/list').subscribe(
      res => {
        if (res != null) {
          res.forEach(element => {
            console.log('Response ----' + element);
            this.categoriesList.push({
              'assetCategoryId': element.assetCategoryId,
              'categoryName': element.categoryName,
              'categoryDescription': element.categoryDescription,
            });
          });


        } else {
          console.log('There is no any response from Database');
        }
      },
      err => {

      },
      () => { });
  }


}

export interface AssetElement {
  assetName: string;
  categoryName: string;
  description: string;

}

const ELEMENT_DATA: AssetElement[] = [];

export interface CategoryList {
  value: string;
  viewValue: string;
}

const ELEMENT_DATA1: CategoryList[] = [];


// ---------------- Add/Update asset categories model start ------------------------
@Component({
  templateUrl: 'add-update-asset.component.html',
})
export class AddUpdateAssetComponent implements OnInit {
  public createAssetForm: FormGroup;
  action: String;
  message: any;
  categoriesList = [];
  identificationLabelList = [];
  compareFn = (a: any, b: any) => a.assetCategoryId == b.assetCategoryId;
  compareFnLabel = (a: any, b: any) => a.identificationLabelId == b.identificationLabelId;
  constructor(public dialogRef: MatDialogRef<AddUpdateAssetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService, private _fb: FormBuilder) {
    this.action = data.action;
    this.categoriesList = data.categoriesList;
    this.identificationLabelList = data.identificationLabelList
    // {assetCategoryId:'',categoryDescription:'',categoryName:''}
    if (data.action === 'add') {
      this.createAssetForm = this._fb.group({
        assetId: ['0'],
        assetCategory: [null, [
          Validators.required,
        ]],
        assetName: ['', [
          Validators.required,
        ]],
        identificationLabel: ['', [
          Validators.required
        ]],
        assetDescription: ['']
      });
    } else if (data.action === 'update') {
      console.log('asset Id for updation----' + data.assetInfo.assetCategoryId);
      this.createAssetForm = this._fb.group({
        assetId: [data.assetInfo.assetId],
        assetCategory: [{ assetCategoryId: data.assetInfo.assetCategory.assetCategoryId, categoryDescription: data.assetInfo.assetCategory.categoryDescription, categoryName: data.assetInfo.assetCategory.categoryName }, [
          Validators.required,
        ]],
        assetName: [data.assetInfo.assetName, [
          Validators.required,
        ]],
        identificationLabel: [data.assetInfo.identificationLabel, [Validators.required]],
        assetDescription: [data.assetInfo.assetDescription]
      });
    }
  }
  ngOnInit() {

  }

  createCategoryAsset() {
    if (this.createAssetForm.valid) {
      const body = this.createAssetForm.value;
      console.log('Category  Data :::: ' + JSON.stringify(body));
      this.serviceApi.post('/v1/organization/assets/insert/' + this.createAssetForm.controls.assetCategory.value.assetCategoryId, body).subscribe(
        res => {
          console.log('Asset Successfully Saved...' + JSON.stringify(res));
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

        });
    } else {
      Object.keys(this.createAssetForm.controls).forEach(field => {
        const control = this.createAssetForm.get(field);
        control.markAsTouched({ onlySelf: true })
      })
    }
  }
  updateCategoryAsset() {
    if (this.createAssetForm.valid) {
      const body = this.createAssetForm.value;
      console.log('Category  Data :::: ' + JSON.stringify(body));
      this.serviceApi.put('/v1/organization/assets/update/' + this.createAssetForm.controls.assetId.value + '/' + this.createAssetForm.controls.assetCategory.value.assetCategoryId, body).subscribe(
        res => {
          console.log('Category update Saved...' + JSON.stringify(res));
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
    } else {
      Object.keys(this.createAssetForm.controls).forEach(field => {
        const control = this.createAssetForm.get(field);
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
  templateUrl: 'delete-asset.component.html',
})
export class DeleteAssetComponent implements OnInit {
  message: any;
  constructor(public dialogRef: MatDialogRef<DeleteAssetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    console.log(data);
  }
  onDelete() {
    this.serviceApi.delete('/v1/organization/assets/' + this.data.assetInfo.assetId).subscribe(
      res => {
        console.log('Category Delete Saved...' + JSON.stringify(res));
        if (res != null) {
          this.message = res.message;
          this.close();
        } else {
        }
      }, err => {
        console.log('Something gone Wrong');
        console.log('err -->' + err);
        // this.warningNotification(err.message);
      }, () => { });
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