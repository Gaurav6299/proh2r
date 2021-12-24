import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTable, SelectItem } from 'primeng/primeng';
declare var $: any;
@Component({
  selector: 'app-proh2r-reports',
  templateUrl: './proh2r-reports.component.html',
  styleUrls: ['./proh2r-reports.component.scss']
})
export class Proh2rReportsComponent implements OnInit {
  @ViewChild("dt1") dt: DataTable;
  reportCategoryNames: SelectItem[] = [];
  columns = [
    { field: 'reportName', header: 'Report Name' },
    { field: 'reportCategoryName', header: 'Report Category Name' },
    { field: 'actions', header: 'Actions' }
  ]
  dataSource: MatTableDataSource<Element>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  notificationMsg: String;
  reportTypeList = []
  selectedReportTypeList = []
  status: any;
  reportCategoryList = [];
  filterValue
  isLeftVisible
  compareFn = (a: any, b: any) => a && b && a.reportCategoryId == b.reportCategoryId;
  constructor(public dialog: MatDialog, private serviceApi: ApiCommonService) {
    this.getAllCategories();
  }
  ngOnInit() {
    this.getReportType();
  }

  getAllCategories() {
    this.reportCategoryList = [];
    this.serviceApi.get('/v1/reports/getAll/categories').
      subscribe(
        res => {
          console.log('categories List----' + JSON.stringify(res));
          this.reportCategoryList.push({
            reportCategoryId: '-1',
            reportCategoryName: "All",
          });
          res.forEach(element => {
            this.reportCategoryList.push({
              reportCategoryId: element.reportCategoryId,
              reportCategoryName: element.reportCategoryName,
            });
          });
          this.filterValue = "-1"
        });
  }

  filterReportCategory(event) {
    console.log(event.value);
    if (event.value === "-1") {
      this.dataSource = new MatTableDataSource<Element>(this.reportTypeList);
      this.selectedReportTypeList = this.reportTypeList;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      this.selectedReportTypeList = this.reportTypeList;
      console.log(this.selectedReportTypeList);
      this.selectedReportTypeList = this.selectedReportTypeList.filter(item => +item.reportCategoryId === +event.value);
      console.log(this.selectedReportTypeList);
      this.dataSource = new MatTableDataSource<Element>(this.selectedReportTypeList);
      this.selectedReportTypeList = this.reportTypeList;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
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
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }


  getReportType() {
    this.reportTypeList = [];
    this.serviceApi.get('/v1/reports/getAll/reports').subscribe(
      res => {
        console.log('Get Report----' + JSON.stringify(res));
        res.forEach(element => {
          let found1 = this.reportCategoryNames.filter(obj => obj.value === element.reportsCategory.reportCategoryName)
          if (!found1.length) {
            this.reportCategoryNames.push({ label: element.reportsCategory.reportCategoryName, value: element.reportsCategory.reportCategoryName, })
          }
          this.reportTypeList.push({
            reportId: element.reportId,
            reportName: element.reportName,
            reportCategoryId: element.reportsCategory.reportCategoryId,
            reportCategoryName: element.reportsCategory.reportCategoryName,
          });
        });
      },
      error => {
        console.log('there is something json');
      },
      () => {
        this.dt.reset();
      }
    );
  }

  openAddReportstemplateDialog() {
    const dialogRef = this.dialog.open(AddUpdateProh2rReportsComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { action: 'add', message: this.notificationMsg, title: "Add Reports" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          console.log('Result value ..... ' + result.message);
          this.successNotification(result.message);
          this.getReportType();
        }
      }
    });
  }

  openUpdateReportstemplateDialog(data: any) {
    console.log('Label Info-----' + data.reportCategoryId);
    const dialogRef = this.dialog.open(AddUpdateProh2rReportsComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { action: 'update', message: this.notificationMsg, labelInfo: data, title: "Update Report" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          console.log('Result value ..... ' + result.message);
          this.successNotification(result.message);
          this.getReportType();
        }
      }
    });
  }

  openDeleteReportstemplateDialog(data: any) {
    const dialogRef = this.dialog.open(DeleteProh2rReportsTemplateComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { labelInfo: data }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          console.log('Result value ..... ' + result.message);
          this.successNotification(result.message);
          this.getReportType();
        }
      }
    });
  }
}



@Component({
  templateUrl: 'add-proh2r-reports.component.html',
})
export class AddUpdateProh2rReportsComponent implements OnInit {
  action: string;
  message: any;
  error: any;
  title: any;
  reportCategoryList = [];
  public reportTypeForm: FormGroup;
  isValidFormSubmitted = true;
  compareFn = (a: any, b: any) => a.reportCategoryId == b.reportCategoryId;
  constructor(public dialogRef: MatDialogRef<AddUpdateProh2rReportsComponent>, private _fb: FormBuilder, private serviceApi: ApiCommonService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.action = data.action;
    this.title = this.data.title;
    this.serviceApi.get('/v1/reports/getAll/categories').
      subscribe(
        res => {
          console.log('category List----' + JSON.stringify(res));
          res.forEach(element => {
            this.reportCategoryList.push({
              reportCategoryId: element.reportCategoryId,
              reportCategoryName: element.reportCategoryName,
            });
          });
        });
  }
  ngOnInit() {
    if (this.action === 'add') {
      this.reportTypeForm = this._fb.group(
        {
          reportName: ['', Validators.required],
          reportId: ['0'],
          reportsCategory: ['', Validators.required]
        }
      );
    } else if (this.action === 'update') {
      this.reportTypeForm = this._fb.group(
        {
          reportName: [this.data.labelInfo.reportName],
          reportId: [this.data.labelInfo.reportId],
          reportsCategory: [{
            reportCategoryId: this.data.labelInfo.reportCategoryId,
            reportCategoryName: this.data.labelInfo.reportCategoryName,
          }]
        }
      );
    }
  }
  onAddReportsType() {
    if (this.reportTypeForm.valid) {
      console.log('form value ' + JSON.stringify(this.reportTypeForm.value));
      var body = this.reportTypeForm.value;
      const val = this.reportTypeForm.controls.reportsCategory.value.reportCategoryId;
      console.log('Body ---------- Json data-------   ' + JSON.stringify(body));
      return this.serviceApi.post('/v1/reports/add/report/' + val, body).
        subscribe(
          res => {
            console.log('Successfully...' + JSON.stringify(res));
            this.message = res.message;
            this.close();
          },
          err => {
          });
    }
    else {
      Object.keys(this.reportTypeForm.controls).forEach(field => {
        const control = this.reportTypeForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }

  onUpdateReportsType() {
    console.log('form value ' + JSON.stringify(this.reportTypeForm.value));
    var body = this.reportTypeForm.value;
    if (this.reportTypeForm.valid) {
      this.isValidFormSubmitted = true;
      const val = this.reportTypeForm.controls.value;
      console.log('Body ---------- Json data-------   ' + JSON.stringify(body));
      return this.serviceApi.put('/v1/reports/update/report/' + this.reportTypeForm.controls.reportId.value, body).
        subscribe(
          res => {
            console.log('Update Reports Successfully...' + JSON.stringify(res));
            this.message = res.message;
            this.close();
          },
          err => {
          });
    } else {
      Object.keys(this.reportTypeForm.controls).forEach(field => {
        const control = this.reportTypeForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }

  close(): void {
    this.data.message = this.message;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    this.dialogRef.close(this.data);
  }

}

@Component({
  templateUrl: 'delete-proh2r-reports.component.html',
})
export class DeleteProh2rReportsTemplateComponent implements OnInit {
  message: any;
  error = 'Error Message';
  action: any;
  constructor(public dialogRef: MatDialogRef<DeleteProh2rReportsTemplateComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private serviceApi: ApiCommonService) {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() { }
  onDelete() {
    const val = this.data.labelInfo.reportId;
    return this.serviceApi.delete('/v1/reports/delete/report/' + val)
      .subscribe(
        res => {
          console.log('Report Delete Successfully...' + JSON.stringify(res));
          this.message = res.message;
          this.close();
        }, err => {
          console.log('there is something error.....  ' + err.message);
          this.action = 'Error';
          this.error = err.message;
          this.close();
        });
  }
  close(): void {
    this.data.message = this.message;
    this.dialogRef.close(this.data);
  }
}


