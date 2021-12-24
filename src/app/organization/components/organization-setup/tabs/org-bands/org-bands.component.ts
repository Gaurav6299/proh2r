import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataTable } from 'primeng/primeng';
declare var $: any;

@Component({
  selector: 'app-org-bands',
  templateUrl: './org-bands.component.html',
  styleUrls: ['./org-bands.component.scss']
})
export class OrgBandsComponent implements OnInit {
  @ViewChild("dt1") dt: DataTable;
  // displayedColumns = ['bandId', 'bandName', 'actions'];
  columns = [
    { field: 'bandId', header: 'Band Id' },
    { field: 'bandName', header: 'Band Name' },
    { field: 'actions', header: 'Actions' },
  ];
  dataSource: MatTableDataSource<Element>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  notificationMsg: any;
  BandList: any[];

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


  constructor(public dialog: MatDialog, private serviceApi: ApiCommonService) { }

  ngOnInit() {
    this.getAllBands();
  }

  applyFilter(filterValue: string) {
    console.log('hello' + filterValue);
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  openAddBandDialog() {
    const dialogRef = this.dialog.open(AddBandComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { action: 'add', message: this.notificationMsg, bandInfo: undefined }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed....................' + result.message);
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message !== undefined) {
          this.successNotification(result.message);
          this.getAllBands();
        }
      }
    });

  }

  updateBand(data: any) {
    const dialogRef = this.dialog.open(AddBandComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { action: 'update', message: this.notificationMsg, bandInfo: data }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed....................' + result.message);
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message !== undefined) {
          this.successNotification(result.message);
          this.getAllBands();
        }
      }
    });
  }

  openDeleteBandDialog(bandId: any) {
    const dialogRef = this.dialog.open(DeleteBandComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { bandId: bandId }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed....................' + result.message);
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message !== null) {
          this.successNotification(result.message);
          this.getAllBands();
        }
      }
    });
  }



  getAllBands(): any {
    console.log('Enter inside getAllCategories ');
    this.BandList = [];
    this.serviceApi.get('/v1/organization/getAll/bands').subscribe(
      res => {
        if (res != null) {
          res.forEach(element => {
            console.log(element);
            this.BandList.push({
              "bandId": element.bandId,
              "bandName": element.bandName
            });
          });
        } else {

        }
      },
      err => {
      },
      () => {
        this.dt.reset();
        console.log(this.BandList);
      });
  }



}


@Component({
  templateUrl: './add-update-band.component.html',
  styleUrls: ['./org-bands.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class AddBandComponent implements OnInit {
  action: any;
  error: any;
  message: any;
  separationReqId
  requestInfo: any;
  createBandForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<AddBandComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private serviceApi: ApiCommonService, private _fb: FormBuilder) {
    console.log(this.data);
    // this.data = data.bandInfo;
    this.createBandForm = this._fb.group({
      bandId: [''],
      bandName: ['', Validators.required]
    });
    if (this.data.action === 'update') {
      this.createBandForm.controls.bandId.setValue(this.data.bandInfo.bandId);
      this.createBandForm.controls.bandName.setValue(this.data.bandInfo.bandName);
    }

  }
  //for approve separation request --------------------------------------

  createNewBand() {
    const body = {
      "bandName": this.createBandForm.controls.bandName.value
    }
    if (this.createBandForm.valid) {
      this.serviceApi.post("/v1/organization/save/band", body).
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
      Object.keys(this.createBandForm.controls).forEach(field => {
        const control = this.createBandForm.get(field);
        control.markAsTouched({ onlySelf: true })
      })
    }

  }

  updateBand() {
    const body = {
      "bandName": this.createBandForm.controls.bandName.value
    }
    if (this.createBandForm.valid) {
      this.serviceApi.put("/v1/organization/update/band/" + this.createBandForm.controls.bandId.value, body).
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
      Object.keys(this.createBandForm.controls).forEach(field => {
        const control = this.createBandForm.get(field);
        control.markAsTouched({ onlySelf: true })
      })
    }
  }


  ngOnInit() { }

  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    console.log(this.data);
    this.dialogRef.close(this.data);
  }
}

@Component({
  templateUrl: 'delete-band.component.html',
})
export class DeleteBandComponent implements OnInit {
  message: any;
  constructor(public dialogRef: MatDialogRef<DeleteBandComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    console.log('category Id for deletion----' + data.bandId);
  }
  deleteBand() {
    this.serviceApi.delete('/v1/organization/delete/band/' + this.data.bandId).subscribe(
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

