import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiCommonService } from '../../../../../../app/services/api-common.service';
declare var $: any;

@Component({
  selector: 'app-tax-year',
  templateUrl: './tax-year.component.html',
  styleUrls: ['./tax-year.component.scss']
})
export class TaxYearComponent implements OnInit {
  cars = [];
  taxYearForm: FormGroup;
  action: string;
  error: any;
  taxYearData: any;
  constructor(private serviceApi: ApiCommonService, private _fb: FormBuilder,) {
    this.taxYearForm = this._fb.group(
      {
        // taxDeclarationFromDate: ['', Validators.required],
        // taxDeclarationToDate: ['', Validators.required],
        taxPeriodFromDate: ['', Validators.required],
        taxPeriodToDate: ['', Validators.required],
        taxYear: [],
        taxYearId: []
      }
    );

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


  getTaxYears() {
    this.cars = [];
    this.serviceApi.get('/v1/taxDeclaration/taxYear/all').subscribe(res => {
      if (res != null) {
        res.forEach(element => {
          // this.cars.push(element);
          this.cars = [...this.cars, element];
        });
      }
    },
      err => { },
      () => { });

  }


  DataSet(taxYearData: any) {
    console.log(taxYearData);
    // this.taxYearForm.controls.taxDeclarationFromDate.setValue(taxYearData.taxDeclarationFromDate);
    // this.taxYearForm.controls.taxDeclarationToDate.setValue(taxYearData.taxDeclarationToDate);
    this.taxYearForm.controls.taxPeriodFromDate.setValue(taxYearData.taxPeriodFromDate);
    this.taxYearForm.controls.taxPeriodToDate.setValue(taxYearData.taxPeriodToDate);
    this.taxYearForm.controls.taxYear.setValue(taxYearData.taxYear);
    this.taxYearForm.controls.taxYearId.setValue(taxYearData.taxYearId);
  }

  Save() {
    if (this.taxYearForm.valid) {
      console.log(this.taxYearForm.value);
      const body = {
        // "taxDeclarationFromDate":this.taxYearForm.controls.taxDeclarationFromDate.value,
        // "taxDeclarationToDate": this.taxYearForm.controls.taxDeclarationToDate.value,
        "taxPeriodFromDate": this.taxYearForm.controls.taxPeriodFromDate.value,
        "taxPeriodToDate": this.taxYearForm.controls.taxPeriodToDate.value,
        "taxYear": this.taxYearForm.controls.taxYear.value,
        "taxYearId": this.taxYearForm.controls.taxYearId.value
      }
      this.serviceApi.put('/v1/taxDeclaration/taxYear/update', body).subscribe(res => {
        console.log('success.....');
        this.action = 'Response';
        this.error = res.message;
        this.successNotification(this.error)
        // this.close();

      }, err => {
        console.log('there is something error.....  ' + err.message);
        this.action = 'Error';
        this.error = err.message;
        this.warningNotification(this.error);
        // this.close();
      }, () => {
      })
    }
    else {
      this.warningNotification("Select the Year first.");
      Object.keys(this.taxYearForm.controls).forEach(field => { // {1}
        const control = this.taxYearForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }


  ngOnInit() {
    this.getTaxYears();
  }

}
