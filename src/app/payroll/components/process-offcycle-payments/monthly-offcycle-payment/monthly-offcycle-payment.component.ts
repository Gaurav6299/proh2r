import { ChangeDetectionStrategy, Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import 'rxjs/add/operator/map';
import { RequestOptions } from '@angular/http';
import { Headers } from '@angular/http';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AfterViewInit, AfterContentInit, AfterViewChecked } from '@angular/core/src/metadata/lifecycle_hooks';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { OffcycleDataServiceService } from '../../../service/offcycle-data-service.service';

@Component({
  selector: 'app-monthly-offcycle-payment',
  templateUrl: './monthly-offcycle-payment.component.html',
  styleUrls: ['./monthly-offcycle-payment.component.scss']
})
export class MonthlyOffcyclePaymentComponent implements OnInit {

  date: any;
  isLinear = false;
  employeeSelectionForm: FormGroup;
  uploadVariablePaysForm: FormGroup;
  employeeFlexiBenifitForm: FormGroup;
  step = '1';

  constructor(private _fb: FormBuilder, private offcycleData: OffcycleDataServiceService) {
    this.date = new Date();
  }

  ngOnInit() {
    this.employeeSelectionForm = this._fb.group({
      employeeList: this._fb.array([
        // this._fb.group({
        //   recordId: [],
        //   employeeCode: ['', Validators.required],
        //   employeeName: ['', Validators.required],
        //   joiningDate: ['', Validators.required]
        // })

      ])

    });
    this.uploadVariablePaysForm = this._fb.group({
      employeeList: this._fb.array([
      ])
    });
    this.employeeFlexiBenifitForm = this._fb.group({
      secondCtrl: ['', Validators.required]
    });
  }

  // callFunction(data: any) {
  //   this.offcycleData.currentStep.subscribe(message => this.step = message);
  //   console.log('Hellow' + data.value);
  //   this.offcycleData.currentData.subscribe(message => data = message);
  // }

  receiveStep($event) {
    this.step = $event;
    // this.offcycleData.currentStep.subscribe(message => this.step = message);
    // this.offcycleData.currentData.subscribe(message => data = message);
  }
}
