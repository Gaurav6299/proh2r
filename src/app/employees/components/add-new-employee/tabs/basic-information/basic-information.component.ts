import { Component, OnInit, Output, EventEmitter, Inject, Input, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { RequestOptions } from '@angular/http';
import { Headers } from '@angular/http';
import { Http } from '@angular/http';
import { element } from 'protractor';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { AddEmployeeService } from '../../../../services/add-employee/add-employee.service';

import { ValidationMessagesService } from '../../../../../validation-messages.service';
@Component({
  selector: 'app-basic-information',
  templateUrl: './basic-information.component.html',
  styleUrls: ['./basic-information.component.scss']
})
export class BasicInformationComponent implements OnInit {
  basicInformationList = [];
  @Input() currentTab: string;
  @Output() currentTabEvent = new EventEmitter<string>();

  requiredTextFields;
  flag: boolean;

  invalidTextFields;

  dynamicFileds = [];
  public basicInformationForm: FormGroup;
  constructor(private fb: FormBuilder, private http: Http, private serviceApi: ApiCommonService,
    private validationMessagesService: ValidationMessagesService, private addEmployeeService: AddEmployeeService) {
    this.flag = false;
    this.validationMessagesService.currentRequiredTextField.subscribe(message =>
      this.requiredTextFields = message);


    this.validationMessagesService.currentInputValue.subscribe(message =>
      this.invalidTextFields = message);

    this.basicInformationForm = this.fb.group({
      sectionId: [],
      sectionName: [],
      employeeProfileLocation: [],
      accessLevel: [],
      fields: this.fb.array([
      ])
    });



    this.serviceApi.get('/v1/employee/onboard/getFields/PersonalDetails').subscribe(
      res => {
        res.forEach(sections => {
          if (sections.sectionName === 'Basic Information') {
            this.basicInformationForm = this.fb.group({
              sectionId: [sections.sectionId],
              sectionName: [sections.sectionName],
              employeeProfileLocation: [sections.employeeProfileLocation],
              accessLevel: [sections.accessLevel],
              fields: this.fb.array([
                // this.initFields(),
              ])
            });
            this.dynamicFileds = sections.fields;
          }
        });
        console.log("data");
        this.dynamicFileds.forEach(data => {
          let validVal;
          const control = <FormArray>this.basicInformationForm.controls['fields'];

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
              fieldValue: [data.fieldValue, [validVal]],
              sensitive: [data.sensitive],
              mandatory: [data.mandatory],
              default: [data.default],
            })
          );
          if (data.mandatory == true) {
            console.log(data);
            control.setValidators([Validators.required])
          }
        });
      },
      error => {
        console.log('err -->' + error);
      }
    );

  }

  ngOnInit() {

  }

  get fields(): FormArray { return this.basicInformationForm.get('fields') as FormArray; }

  initFields() {
    const control = <FormArray>this.basicInformationForm.controls['fields'];
    const length = control.length;
    return this.fb.group({
      fieldId: [],
      fieldName: [],
      fieldPlaceholder: [],
      fieldValue: [],
      fieldType: [],
      fieldLocation: [],
      accessLevel: [],
      sensitive: [],
      mandatory: [],
      includeInPayslips: [],
      includeInOnboarding: [],
      default: [],
    });
  }


  save() {

    this.flag = true;
    if (this.basicInformationForm.valid) {
      this.currentTabEvent.emit('2');
      this.addEmployeeService.changeData(this.basicInformationForm);
    } else {

      this.basicInformationForm['controls']['fields']['controls'].forEach(element => {
        element.controls.fieldValue.markAsTouched({ onlySelf: true })
        if (element.value.mandatory) {
          console.log(element);
        }

      });

    }
  }

}
