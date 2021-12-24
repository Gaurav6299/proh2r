import { Component, OnInit, Inject, Input, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Http } from '@angular/http';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-expense-process-history',
  templateUrl: './expense-process-history.component.html',
  styleUrls: ['./expense-process-history.component.scss']
})
export class ExpenseProcessHistoryComponent implements OnInit {
  displayedColumns = ['runDate', 'expenseReportDetails', 'amount', 'actions'];
  dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
  constructor( public dialog: MatDialog) { }

  ngOnInit() {
  }
  unDoExpense() {
         let dialogRef = this.dialog.open(UndoProcessHistoryDialogComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
      });
       }

}
// ----------------- Undo Process History Dialog ------------------
@Component({
  selector: 'app-undo-expense-process-dialog',
  templateUrl: 'undo-expense-process-dialog.html',
  styleUrls: ['./dialog.scss']
})
export class UndoProcessHistoryDialogComponent {
  requestType: any;
  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<UndoProcessHistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.requestType = data;
    console.log('Request Type ----- ' + this.requestType);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

 
}
// --------------- PRocess History table -------------------
export interface Element {
  runDate: any;
  expenseReportDetails: any;
  reimbursable: any;
  billable: any;
  actions: any;
  }

const ELEMENT_DATA: Element[] = [
  {
    runDate: '04-01-2018, 13:26:50',
    expenseReportDetails: '2 reports processed',
    reimbursable: 'Reimbursable: Rs.6,900',
    billable: 'Billable: Rs.0',
    actions: true,
  }
   ];
