import { Component, OnInit, Inject, Input, Output, EventEmitter, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { RequestOptions } from '@angular/http';
import { Headers } from '@angular/http';
import { environment } from '../../../../../../environments/environment';
import { Http } from '@angular/http';
import { element } from 'protractor';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { AddEmployeeService } from '../../../../services/add-employee/add-employee.service';
import {Router} from "@angular/router";
declare var $: any;

@Component({
  selector: 'app-employment-information',
  templateUrl: './employment-information.component.html',
  styleUrls: ['./employment-information.component.scss']
})
export class EmploymentInformationComponent implements OnInit {
  public employmentInfoForm: FormGroup;
  public basicInfoForm: FormGroup;
  notificationMsg: any;
  action: any;
  @Input() currentTab: string;
  @Output() currentTabEvent = new EventEmitter<string>();
  constructor(private fb: FormBuilder, private http: Http, private serviceApi: ApiCommonService, private addEmployeeService: AddEmployeeService,private router: Router) {
    this.employmentInfoForm = this.fb.group({
      sectionId: [],
      sectionName: [],
      employeeProfileLocation: [],
      accessLevel: [],
      default: [],
      fields: this.fb.array([
      ])
    });

    this.serviceApi.get('/v1/employee/onboard/getFields/EmploymentDetails').subscribe(
      res => {
        this.employmentInfoForm = this.fb.group({
          sectionId: [res.default],
          sectionName: [res.default],
          employeeProfileLocation: [res.default],
          accessLevel: [res.default],
          default: [res.default],
          fields: this.fb.array([
          ])
        });

        var stored = res.reduce(function (pV, section) {
          section.fields.forEach(element => { pV.push(element); });
          return pV; // *********  Important ******
        }, []);
        stored.forEach(data => {

          let validVal;

          const control = <FormArray>this.employmentInfoForm.controls['fields'];


          if (data.mandatory == true) {
            console.log(data);
            validVal = Validators.required;
            control.setValidators([Validators.required])
          } else {
            validVal = Validators.nullValidator;
          }

          control.push(
            this.fb.group({
              fieldId: [data.fieldId],
              fieldName: [data.fieldName],
              fieldDescription: [data.fieldDescription],
              fieldType: [data.fieldType],
              accessLevel: [data.accessLevel],
              includeInOnboarding: [data.includeInOnboarding],
              includeInPayslips: [data.includeInPayslips],
              fieldPlaceholder: [data.fieldPlaceholder],
              options: [data.options],
              mandatory: [data.mandatory],
              sensitive: [data.sensitive],
              fieldValue: [data.fieldValue, [validVal]],
              default: [data.default],
            })
          );
        });
      },
      error => {
        console.log('err -->' + error);
      }
    );

  }

  get fields(): FormArray { return this.employmentInfoForm.get('fields') as FormArray; }

  ngOnInit() {

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

  saveFormData() {
    if (this.employmentInfoForm.valid) {
      let empCode: string;
      this.addEmployeeService.currentData.subscribe(message => this.basicInfoForm = message);

      let field: fieldType[] = [];

      this.basicInfoForm.controls.fields.value.forEach(element => {
        field.push(element);
      });

      this.employmentInfoForm.controls.fields.value.forEach(element => {
        if (element.fieldName === 'empCode') {
          empCode = element.fieldValue;
        }
        field.push(element);
      });
      this.addEmployeeService.changeEmpCode(empCode);

      // sections.concat(this.basicInfoForm.controls.fields.value);
      // sections.concat(this.employmentInfoForm.controls.fields.value);
      const body = {
        "employeeCode": empCode,
        "sections": [
          {
            "accessLevel": this.employmentInfoForm.controls.accessLevel.value,
            "default": this.employmentInfoForm.controls.default.value,
            "employeeProfileLocation": this.employmentInfoForm.controls.employeeProfileLocation.value,
            "sectionId": this.employmentInfoForm.controls.sectionId.value,
            "sectionName": this.employmentInfoForm.controls.sectionName.value,
            "fields": field
          }
        ]
      };
      // console.log('body-->' + JSON.stringify(body));
      this.serviceApi.post('/v1/employee/onboard/', body).subscribe(
        res => {
          this.successNotification(res.message);
          this.router.navigate(['/employees']);
        },
        err => {
          console.error('employee onboarding has some error');
          console.log(JSON.stringify(err));
          // this.warningNotification({ err: err.message });
        }
      );
      this.currentTabEvent.emit('3');
    } else {
      // console.log(this.employmentInfoForm);
      this.employmentInfoForm['controls']['fields']['controls'].forEach(element => {
        element.controls.fieldValue.markAsTouched({ onlySelf: true })
         if (element.value.mandatory) {
          console.log(element);
        }
        
      });
      // Object.keys(this.employmentInfoForm.controls).forEach(field => { // {1}
      //   const control = this.employmentInfoForm.get(field);            // {2}
      //   control.markAsTouched({ onlySelf: true });       // {3}
      // });
    }


  }
}

export interface fieldType {
  fieldId: any;
  fieldName: any;
  fieldDescription: any;
  fieldType: any;
  accessLevel: any;
  includeInOnboarding: any;
  includeInPayslips: any;
  fieldPlaceholder: any;
  options: any;
  mandatory: any;
  sensitive: any;
  fieldValue: any;
  default: any;
}
