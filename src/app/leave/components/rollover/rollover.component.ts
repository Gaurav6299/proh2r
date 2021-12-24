import { Component, OnInit, Inject, Input, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-rollover',
  templateUrl: './rollover.component.html',
  styleUrls: ['./rollover.component.scss']
})
export class RolloverComponent implements OnInit {
  displayedColumns = ['rolloverDate', 'runDate', 'status', 'noOfEmployeesProcessed', 'actions'];
  dataSource: MatTableDataSource<Element>;
  constructor(public dialog: MatDialog) { }

  generateRollover() {
    let dialogRef = this.dialog.open(GenerateRolloverComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
    });
  }
  deleteRollover() {
    let dialogRef = this.dialog.open(DeleteRolloverComponent, {
      width: '400px',
    });
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
  }
}


@Component({
  selector: 'app-generate-rollover-dialog',
  templateUrl: 'generate-rollover-dialog.html',
  styleUrls: ['./generate-rollover-dialog.scss']
})
export class GenerateRolloverComponent {
  requestType: any;
  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<GenerateRolloverComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('data-->' + data);
     
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}


@Component({
  selector: 'app-delete-rollover-dialog',
  templateUrl: 'delete-rollover-dialog.html',
  styleUrls: ['./generate-rollover-dialog.scss']
})
export class DeleteRolloverComponent {
  requestType: any;
  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<DeleteRolloverComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('data-->' + data);
    
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}



export interface Element {
  rolloverDate: string;
  runDate: string;
  status: string;
  noOfEmployeesProcessed: any;
  actions: any;
}

const ELEMENT_DATA: Element[] = [
  {
    rolloverDate: '01-01-2017',
    runDate: '19-12-2017',
    status: 'Completed',
    noOfEmployeesProcessed: 13,
    actions: true
  },
  {
    rolloverDate: '01-01-2017',
    runDate: '19-12-2017',
    status: 'Completed',
    noOfEmployeesProcessed: 13,
    actions: true
  }
];
// -----------------Fixed Allowance Data table interface end------------