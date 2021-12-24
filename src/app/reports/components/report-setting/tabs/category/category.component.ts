import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { DataTable } from 'primeng/primeng';
declare var $: any;
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  @ViewChild("dt1") dt: DataTable;
  notificationMsg: String;
  columns = [
    { field: 'reportCategoryId', header: 'Category Id' },
    { field: 'reportCategoryName', header: 'Category Name' },
    { field: 'actions', header: 'Actions' }
  ]
  reportCategoryList = [];
  isLeftVisible
  dataSource: MatTableDataSource<Element>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(public dialog: MatDialog, private serviceApi: ApiCommonService) { }

  ngOnInit() {
    this.getAllCategories();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
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

  getAllCategories() {
    this.reportCategoryList = [];
    this.serviceApi.get('/v1/reports/getAll/categories').subscribe(
      res => {
        if (res != null) {
          res.forEach(element => {
            console.log(element);
            this.reportCategoryList.push({
              'reportCategoryId': element.reportCategoryId,
              'reportCategoryName': element.reportCategoryName
            })
          });
        } else {

        }
      },
      err => {

      },
      () => {
        this.dt.reset();
        console.log(this.reportCategoryList);
      }
    );
  }
  openAddReportCategoryDialog() {
    const dialogRef = this.dialog.open(AddReportCategoryComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { action: 'add', message: this.notificationMsg, categoryInfo: undefined, title: "Add Report Category" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          console.log('Result value ..... ' + result.message);
          this.successNotification(result.message);
          this.getAllCategories();
        }
      }
    });
  }
  openUpdateReportCategoryDialog(data: any) {
    const dialogRef = this.dialog.open(AddReportCategoryComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { action: 'update', message: this.notificationMsg, categoryInfo: data, title: "Update Report Category" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          console.log('Result value ..... ' + result.message);
          this.successNotification(result.message);
          this.getAllCategories();
        }
      }
    });
  }

  openDeleteReportsDialog(data: any) {
    const dialogRef = this.dialog.open(DeleteReportCategoryComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { categoryInfo: data }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          console.log('Result value ..... ' + result.message);
          this.successNotification(result.message);
          this.getAllCategories();
        }
      }
    });
  }

}


@Component({
  templateUrl: 'add-report-category.component.html',
})
export class AddReportCategoryComponent implements OnInit {
  action: string;
  message: any;
  error: any;
  title: any;
  categoryForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<AddReportCategoryComponent>, private serviceApi: ApiCommonService, private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.title = this.data.title;
    this.action = data.action;
    this.categoryForm = this.fb.group({
      reportCategoryId: ['0'],
      reportCategoryName: ['', Validators.required]
    });
    if (this.data.action === 'update') {
      this.categoryForm.controls.reportCategoryId.setValue(this.data.categoryInfo.reportCategoryId);
      this.categoryForm.controls.reportCategoryName.setValue(this.data.categoryInfo.reportCategoryName)
    }
  }

  createReportCategory() {
    const body = {
      "reportCategoryName": this.categoryForm.controls.reportCategoryName.value
    }
    if (this.categoryForm.valid) {
      return this.serviceApi.post('/v1/reports/category', body).subscribe(
        res => {
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
        () => {

        }
      )
    } else {
      Object.keys(this.categoryForm.controls).forEach(field => {
        const control = this.categoryForm.get(field);
        control.markAsTouched({ onlySelf: true })
      })
    }
  }
  updateReportCategory() {
    const body = {
      "reportCategoryName": this.categoryForm.controls.reportCategoryName.value
    }
    if (this.categoryForm.valid) {
      this.serviceApi.put("/v1/reports/category/" + this.categoryForm.controls.reportCategoryId.value, body).
        subscribe(
          res => {
            this.action = 'Response';
            this.error = res.message;
            this.close();
          },
          err => {
            console.log('there is something error.....  ' + err.message);
            this.action = 'Error';
            this.error = err.message;
            this.close();
          });

    } else {
      Object.keys(this.categoryForm.controls).forEach(field => {
        const control = this.categoryForm.get(field);
        control.markAsTouched({ onlySelf: true })
      })
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
  templateUrl: 'delete-report-category.component.html',
})
export class DeleteReportCategoryComponent implements OnInit {
  message: any;
  error = 'Error Message';
  action: any;
  constructor(public dialogRef: MatDialogRef<DeleteReportCategoryComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private serviceApi: ApiCommonService) {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  onDelete() {
    const val = this.data.categoryInfo.reportCategoryId;
    this.serviceApi.delete('/v1/reports/category/' + val)
      .subscribe(
        res => {
          console.log('Report Category Delete Successfully...' + JSON.stringify(res));
          this.message = res.message;
          this.close();
        }, err => {
          console.log('there is something error.....  ' + err.message);
          this.action = 'Error';
          this.error = err.message;
          this.close();
        });
  }

  ngOnInit() { }

  close(): void {
    this.data.message = this.message;
    this.dialogRef.close(this.data);
  }
}
