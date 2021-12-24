import { Component, OnInit, Input, Output, EventEmitter, } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Http } from '@angular/http';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { AddEmployeeService } from '../../../../services/add-employee/add-employee.service';

@Component({
  selector: 'app-statutory-detail',
  templateUrl: './statutory-detail.component.html',
  styleUrls: ['./statutory-detail.component.scss']
})
export class StatutoryDetailComponent implements OnInit {
  @Input() currentTab: string;
  @Output() currentTabEvent = new EventEmitter<string>();
  public satutoryDetails: FormGroup;
  readWrite = false;
  readOnly = true;

  empCode: string;
  constructor(private _fb: FormBuilder, private http: Http, private serviceApi: ApiCommonService, private addEmployeeService: AddEmployeeService) {
    this.addEmployeeService.currentEmpCode.subscribe(message => this.empCode = message);
    this.satutoryDetails = this._fb.group({
      isPFDeductible: [],
      isESICDeductible: [],
      isProfessionalTaxDeductible: [],
      isLWFDeductible: [],
      isIncomeTaxDeductible: [],
      isNPSDeductible: [],
    });

    this.loadData();

  }

  loadData() {
    console.log('this.empCode ==>');
    console.log(this.empCode);
    this.serviceApi.get('/v1/employee/salary/satutoryInfo/' + this.empCode).subscribe(
      res => {
        console.log('......Satutory Details....');
        console.log(res);
        res.forEach(element => {
          console.log(res);
          // this.satutoryDetails = this._fb.group({
          //   isPFDeductible: ['' + element.isPFDeductible],
          //   isESICDeductible: ['' + element.isESICDeductible],
          //   isProfessionalTaxDeductible: ['' + element.isProfessionalTaxDeductible],
          //   isLWFDeductible: ['' + element.isLWFDeductible],
          //   isIncomeTaxDeductible: ['' + element.isIncomeTaxDeductible],
          //   isNPSDeductible: ['' + element.isNPSDeductible],
          // });

          this.satutoryDetails.controls.isPFDeductible.setValue('' + element.isPFDeductible);
          this.satutoryDetails.controls.isESICDeductible.setValue('' + element.isESICDeductible);
          this.satutoryDetails.controls.isProfessionalTaxDeductible.setValue('' + element.isProfessionalTaxDeductible);
          this.satutoryDetails.controls.isLWFDeductible.setValue('' + element.isLWFDeductible);
          this.satutoryDetails.controls.isIncomeTaxDeductible.setValue('' + element.isIncomeTaxDeductible);
          this.satutoryDetails.controls.isNPSDeductible.setValue('' + element.isNPSDeductible);

        });
      },
      error => {
        console.log('there is something wrong with json');
      },
      () => {

      }
    );
  }
  editSatutoryDetails() {
    this.readWrite = true;
    this.readOnly = false;
  }
  saveSatutoryDetails() {
    this.currentTabEvent.emit('5');
    console.log('PF Status form:-' + JSON.stringify(this.satutoryDetails.value));
  }

  goBack() {
    this.readWrite = false;
    this.readOnly = true;
  }

  ngOnInit() {
  }

}
