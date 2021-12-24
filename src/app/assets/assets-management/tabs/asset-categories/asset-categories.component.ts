import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ApiCommonService } from '../../../../services/api-common.service';
import { FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator'
import { DataTable } from 'primeng/primeng';
declare var $: any;

@Component({
  selector: 'app-asset-categories',
  templateUrl: './asset-categories.component.html',
  styleUrls: ['./asset-categories.component.scss']
})
export class AssetCategoriesComponent implements OnInit {
  @ViewChild("dt1") dt: DataTable;
  // displayedColumns: string[] = ['categoryName', 'description', 'action'];
  columns = [
    { field: 'categoryName', header: 'Category Name' },
    { field: 'categoryDescription', header: 'Description' },
    { field: 'action', header: 'Actions' },
  ]
  dataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  categoriesList = [];
  notificationMsg: any;
  constructor(public dialog: MatDialog, private serviceApi: ApiCommonService) {

  }

  ngOnInit() {

    this.getAllCategories();
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
  applyFilter(filterValue: string) {
    console.log('hello' + filterValue);
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
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
              'categoryDescription': element.categoryDescription
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
  openAddCategoryDialog() {
    const dialogRef = this.dialog.open(AddUpdateAssetCategoriesComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { action: 'add', message: this.notificationMsg }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed....................' + result.message);
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message !== null) {
          this.notificationMsg = result.message;
          this.successNotification(this.notificationMsg);
          this.getAllCategories();
        }
      }
    });

  }
  //open dialog for update asset categories
  openUpdateCategoryDialog(data: any) {
    console.log('Inside openUpdateCategoryDialog-----' + data.categoryId);
    const dialogRef = this.dialog.open(AddUpdateAssetCategoriesComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { action: 'update', message: this.notificationMsg, categoryInfo: data }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed....................' + result.message);
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message !== null) {
          this.notificationMsg = result.message;
          this.successNotification(this.notificationMsg);
          this.getAllCategories();
        }
      }
    });

  }
  //open dialog for delete asset categories
  openDeleteCategoryDialog(data: any) {
    const dialogRef = this.dialog.open(DeleteAssetCategoriesComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { categoryId: data, message: this.notificationMsg }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed....................' + result.message);
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message !== null) {
          this.notificationMsg = result.message;
          this.successNotification(this.notificationMsg);
          this.getAllCategories();
        }
      }
    });

  }
}
export interface CatregoriesElement {
  categoryName: string;
  description: string;
}

const ELEMENT_DATA: CatregoriesElement[] = [];
// ---------------- Add/Update asset categories model start ------------------------
@Component({
  templateUrl: 'add-update-asset-categories.component.html',
})
export class AddUpdateAssetCategoriesComponent implements OnInit {
  public createCategoryForm: FormGroup;
  action: String;
  message: any;
  constructor(public dialogRef: MatDialogRef<AddUpdateAssetCategoriesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService, private _fb: FormBuilder) {
    this.action = data.action;
    if (data.action === 'add') {
      this.createCategoryForm = this._fb.group({
        assetCategoryId: ['0'],
        categoryName: ['', [
          Validators.required,
        ]],
        categoryDescription: ['', [
        ]],
      });
    } else if (data.action === 'update') {
      console.log('category Id for updation----' + data.categoryInfo.assetCategoryId);
      this.createCategoryForm = this._fb.group({
        assetCategoryId: [data.categoryInfo.assetCategoryId],
        categoryName: [data.categoryInfo.categoryName, [
          Validators.required,
        ]],
        categoryDescription: [data.categoryInfo.categoryDescription, [
        ]],
      });
    }
  }
  ngOnInit() {
  }

  createAssetCategory() {
    console.log('Enter in the createAssetCategory : ' + this.createCategoryForm.controls.categoryName.value);
    console.log('Asset category Name -----' + this.createCategoryForm.controls.categoryName.value);
    console.log('Category Description -----' + this.createCategoryForm.controls.categoryDescription.value);
    console.log('Form Validate -----' + this.createCategoryForm.valid);
    if (this.createCategoryForm.valid) {
      const body = {
        'assetCategoryId': this.createCategoryForm.controls.assetCategoryId.value,
        'categoryName': this.createCategoryForm.controls.categoryName.value,
        'categoryDescription': this.createCategoryForm.controls.categoryDescription.value,
      };
      console.log('Category  Data :::: ' + JSON.stringify(body));
      this.serviceApi.post('/v1/assets/category/create', body).subscribe(
        res => {
          console.log('Category Successfully Saved...' + JSON.stringify(res));
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
      Object.keys(this.createCategoryForm.controls).forEach(field => {
        const control = this.createCategoryForm.get(field);
        control.markAsTouched({ onlySelf: true })
      })
    }
  }
  updateAssetCategory() {
    console.log('Enter in the createAssetCategory : ' + this.createCategoryForm.controls.categoryName.value);
    console.log('Asset category Name -----' + this.createCategoryForm.controls.categoryName.value);
    console.log('Category Description -----' + this.createCategoryForm.controls.categoryDescription.value);
    console.log('Form Validate -----' + this.createCategoryForm.valid);
    if (this.createCategoryForm.valid) {
      const body = {
        'assetCategoryId': this.createCategoryForm.controls.assetCategoryId.value,
        'categoryName': this.createCategoryForm.controls.categoryName.value,
        'categoryDescription': this.createCategoryForm.controls.categoryDescription.value

      };
      console.log('Category  Data :::: ' + JSON.stringify(body));
      this.serviceApi.put('/v1/assets/category/update/' + this.createCategoryForm.controls.assetCategoryId.value, body).subscribe(
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
      Object.keys(this.createCategoryForm.controls).forEach(field => {
        const control = this.createCategoryForm.get(field);
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
  templateUrl: 'delete-asset-categories.component.html',
})
export class DeleteAssetCategoriesComponent implements OnInit {
  message: any;
  constructor(public dialogRef: MatDialogRef<DeleteAssetCategoriesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    console.log('category Id for deletion----' + data.categoryId);
  }
  deleteAssetCategory() {
    this.serviceApi.delete('/v1/assets/category/' + this.data.categoryId).subscribe(
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
      }, () => {
        // this.getAllCategories();
      });

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