import { ChangeDetectionStrategy, Component, OnInit, Input, ViewChild, Inject, ChangeDetectorRef, ViewChildren, ElementRef, QueryList, Output, EventEmitter } from '@angular/core';
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
import { element } from 'protractor';
import { RunPayroll } from '../../../../../../service/run-payroll.service';
import { DataTable } from 'primeng/primeng';
import { Router } from '@angular/router';
import { ApiCommonService } from '../../../../../../../services/api-common.service';
import { environment } from '../../../../../../../../environments/environment';
import { UploadFileService } from '../../../../../../../services/UploadFileService.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
@Component({
  selector: 'app-it-pt-active-employee',
  templateUrl: './it-pt-active-employee.component.html',
  styleUrls: ['./it-pt-active-employee.component.scss']
})
export class ItPtActiveEmployeeComponent implements OnInit {
  @Input() runPayrollId: any;
  @Output() messageEvent = new EventEmitter();

  @ViewChild("dt1") dt: DataTable;
  columns = [
    { field: 'empCode', header: 'Employee Code' },
    { field: 'empName', header: 'Employee Name' },
    { field: 'regime', header: 'Tax Calculation Method' },
    { field: 'totalTdsAmount', header: 'Income Tax Overwrite Amount' },
    { field: 'totalPtAmount', header: 'Professional Tax Overwrite Amount' },
    { field: 'actions', header: 'Actions' },
  ];
  selectedRows: any = [];

  taxDataList: any[];
  constructor(private fb: FormBuilder, private http: Http, public dialog: MatDialog, private runPayroll: RunPayroll, private serviceApi: ApiCommonService, private router: Router) { }
  onNoClick(): void {
  }


  getallItAndPtData() {
    this.taxDataList = [];
    this.serviceApi.get("/v1/payroll/runPayroll/get-all/tds/" + this.runPayrollId).subscribe(res => {
      this.taxDataList = res;
      this.dt.reset();
    }, (err) => {

    }, () => {

    })
  }

  uploadTax() {
    const dialogRef = this.dialog.open(IncomeTaxOverWriteActiovEmplComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container',
      data: { runPayrollId: this.runPayrollId }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.message) {
          if (result.status === 'Response') {
            this.getallItAndPtData();
          }
          // this.successNotification(result.message);
          else if (result.status === 'Error') {
          }
        }
      }
    });

  }

  toggleEdit(element: any) {
    console.log(element);

    const dialogRef = this.dialog.open(UpdateIncomeTaxOverWriteActiovEmplComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { element: element }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.status === 'Response') {
          let index = this.taxDataList.indexOf(element);
          element.regime = result.regime;
          element.totalTdsAmount = result.totalTdsAmount;
          element.totalPtAmount = result.totalPtAmount;
          this.taxDataList.splice(index, 1, element);
        } else if (result.status === 'Error') {
        }
      }
    });
  }

  cancel() {
    this.runPayroll.changeData(1);
    this.router.navigate(['/payroll/run-payroll']);
  }

  onBack() {
    let currentStep;
    this.runPayroll.currentStep.subscribe(step => currentStep = step);
    this.runPayroll.changeData(--currentStep);
    this.messageEvent.emit('previous-' + currentStep);
  }
  onProceed() {
    console.log(this.taxDataList);

    this.serviceApi.put('/v1/payroll/runPayroll/save/tds/' + this.runPayrollId, this.taxDataList).subscribe(
      res => {
        if (res != undefined) {
          let currentStep;
          this.runPayroll.currentStep.subscribe(step => currentStep = step);
          this.runPayroll.changeData(++currentStep);
          this.messageEvent.emit('continue-' + currentStep);
        }
      },
      err => {
        console.log('err -->' + err);
        console.log('there is something error.....  ' + err.message);
        // this.warningNotification(err.message);
      },
      () => { }
    );

  }
  ngOnInit() {
  }

}

@Component({
  templateUrl: 'tax-overwrite-component-dialog.html',
  styleUrls: ['dialog-model.scss']
})
export class IncomeTaxOverWriteActiovEmplComponent implements OnInit {
  currentFileUpload: any;
  selectedFiles: any;
  message: string;
  action: string;
  selectedFilesName: any;
  constructor(private http: Http,
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<IncomeTaxOverWriteActiovEmplComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService, private uploadService: UploadFileService) {
    console.log('data-->' + data);

  }

  ngOnInit() {
  }

  downloadFormat() {
    this.serviceApi.get("/v1/payroll/runPayroll/tds-sheet/" + this.data.runPayrollId).subscribe(res => {
      window.open(environment.storageServiceBaseUrl + res.url);
    })

  }
  uploadFormat() {
    $('#uploadFile').click();
  }
  upload() {
    this.currentFileUpload = this.selectedFiles.item(0);
    const file = <File>this.currentFileUpload;
    let formdata: FormData = new FormData();
    formdata.append('file', file);
    const url = '/v1/payroll/runPayroll/upload/tds/pt/' + this.data.runPayrollId;

    this.uploadService.pushFileToStorage(this.currentFileUpload, url).subscribe(event => {
      console.log(event);
      if (event.type === HttpEventType.UploadProgress) {
      } else if (event instanceof HttpResponse) {
        if (event != null) {
          this.message = "Tax Overwrite Uploaded Successfully";
          this.action = 'Response';
          this.close();
        }
      }
    },
      err => {
        console.log('error :::' + err);
      }, () => {

      }
    );
  }
  close() {
    this.data.message = this.message;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  selectFile(event) {
    this.selectedFiles = event.target.files;
    this.selectedFilesName = this.selectedFiles.item(0).name;
    // console.log(this.selectedFiles.item(0).name);
  }


}

@Component({
  templateUrl: 'update-tax-overwrite-component-dialog.html',
  styleUrls: ['dialog-model.scss']
})
export class UpdateIncomeTaxOverWriteActiovEmplComponent implements OnInit {
  iTaxOverwrtieFields = [];
  newForm: any;
  object: any;
  elementData: any;

  taxRegime = [{
    value: 'NEW_REGIME', viewValue: 'New Regime'
  }, {
    value: 'OLD_REGIME', viewValue: 'Old Regime'
  }]
  constructor(private http: Http,
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<UpdateIncomeTaxOverWriteActiovEmplComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('data-->' + data);
    this.object = this.data.element;
  }

  ngOnInit() {
    this.newForm = this._fb.group(
      {
        empCode: [],
        empName: [],
        regime: [],
        totalTdsAmount: [],
        totalPtAmount: []
      });

    if (this.object != null) {
      this.newForm.controls.empCode.setValue(this.object.empCode);
      this.newForm.controls.empName.setValue(this.object.empName);
      this.newForm.controls.regime.setValue(this.object.regime);
      this.newForm.controls.totalTdsAmount.setValue(this.object.totalTdsAmount);
      this.newForm.controls.totalPtAmount.setValue(this.object.totalPtAmount);

    }
  }



  confirm() {
    console.log(this.newForm);
    this.elementData = {
      empCode: this.newForm.value.empCode,
      empName: this.newForm.value.empName,
      regime: this.newForm.value.regime,
      totalTdsAmount: this.newForm.value.totalTdsAmount,
      totalPtAmount: this.newForm.value.totalPtAmount,
      status: 'Response'
    }
    this.dialogRef.close(this.elementData);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


}
