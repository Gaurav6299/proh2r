import { ChangeDetectionStrategy, Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import 'rxjs/add/operator/map';
import { RequestOptions } from '@angular/http';
import { Headers } from '@angular/http';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { ApiCommonService } from '../../../../../../../../services/api-common.service';
declare var $: any;

@Component({
  selector: 'app-fnf-employees',
  templateUrl: './fnf-employees.component.html',
  styleUrls: ['./fnf-employees.component.scss']
})
export class FnfEmployeesComponent implements OnInit, AfterViewInit {
  columns = [
    { field: '', header: 'Employee Code' },
    { field: '', header: 'Employee Name' },
    { field: '', header: 'Joining Date' },
    { field: '', header: 'Last Working Date' },
    { field: '', header: 'Resignation Date' },
  ];
  selectedRows: any = [];
  constructor(public dialog: MatDialog, private fb: FormBuilder, private http: Http, private apiCommonService: ApiCommonService) { }

  successNotification(successMessage: any) {
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
  ngOnInit() { }
  ngAfterViewInit() { }
}


