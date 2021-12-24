import { Component, OnInit, Inject, Input, ViewChild, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { RequestOptions } from '@angular/http';
import { Headers } from '@angular/http';
import { environment } from '../../../../../../environments/environment';
import { Http } from '@angular/http';
import { element } from 'protractor';
import { ActivatedRoute } from '@angular/router';
import { KeycloakService } from '../../../../../keycloak/keycloak.service'
import { ApiCommonService } from '../../../../../../app/services/api-common.service';
declare var $: any;

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss']
})
export class PersonalDetailsComponent implements OnInit {
  dynamicFileds = [];
  i = 0;
  empCode: any;
  personalDetailFieldMasterData: FormArray;
  public personalDetailForm: FormGroup;
  constructor(private fb: FormBuilder, private http: Http, private route: ActivatedRoute, private serviceApi: ApiCommonService) {
    this.route.params.subscribe(res =>
      this.empCode = res.id);
    this.getEmployeesData();
    var rolesArr = KeycloakService.getUserRole();
  }
  get fieldMaster(): FormArray { return this.personalDetailForm.get('fieldMaster') as FormArray; }
  ngOnInit() {
  }
  buildItems(fields: any) {
  }
  initFieldMaster(i: any, fieldsData: any) {
    console.log('i-->' + i);
    console.log('fieldName -->' + fieldsData.fieldName);
    console.log('filetype--->' + fieldsData.fieldType);
    console.log("fieldValue::" + fieldsData.fieldValue)

    const control = (<FormArray>this.personalDetailForm.controls['fieldMaster']).at(i).get('fields') as FormArray;
    control.push(
      this.fb.group({
        fieldId: [fieldsData.fieldId],
        fieldName: [fieldsData.fieldName],
        fieldPlaceholderValue: [fieldsData.fieldPlaceholder],
        fieldValue: [fieldsData.fieldValue],
        fieldDescription: [fieldsData.fieldDescription],
        fieldType: [fieldsData.fieldType],
        accessLevel: [fieldsData.accessLevel],
        includeInOnboarding: [fieldsData.includeInOnboarding],
        default: [fieldsData.default],
        sensitive: [fieldsData.sensitive],
        options: [fieldsData.options],
        mandatory: [fieldsData.mandatory],
        includeInPayslips: [fieldsData.includeInPayslips],
      })

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
  @Output() messageEvent = new EventEmitter<string>();
  save(data: any, i: any) {
    let isAllRequiredFieldAreFill = true;
    //
    console.log('data==>');
    console.log(data);
    data.controls.fields.controls.forEach(element1 => {
      if (element1.controls.mandatory.value) {
        console.log(element1.controls.mandatory.value);
        const control = element1.controls.fieldValue;
        if (control.untouched) {
          control.markAsTouched({ onlySelf: true });
          isAllRequiredFieldAreFill = false;
        }
      }
    });
    if (isAllRequiredFieldAreFill) {
      if (this.personalDetailForm.controls.fieldMaster['controls'][i].valid) {
        var body = {
          'employeeCode': this.empCode,
          'sections': [
            {
              'sectionId': data.controls.sectionId.value,
              'sectionName': data.controls.sectionName.value,
              'sectionLocation': data.controls.sectionLocation.value,
              'accessLevel': data.controls.accessLevel.value,
              'editable': data.controls.accessLevel.value,
              'fields': data.controls.fields.value
            }

          ]
        };

        this.serviceApi.put('/v1/employee/profile/admin/', body)

          .subscribe(
            res => {
              console.log('profile data saved successfully');
              this.successNotification(res.message);
            },
            err => {
              console.log('there is something error');
              // this.warningNotification(err.message);
            },
            () => {
              this.messageEvent.emit("Details Updated")
              data.controls.editable.value = false;
            }
          );
      }

    }

  }
  cancelForm() {
    // get fieldMaster(): FormArray { return this.personalDetailForm.get('fieldMaster') as FormArray; }

    this.getEmployeesData();
  }
  openInEditMode(i: any) {



    var temp = 0;
    this.personalDetailForm.controls.fieldMaster['controls'].forEach(element => {
      if (i == temp)
        element.controls.editable.value = true;
      else
        element.controls.editable.value = false;
      temp++;



    });




  }


  getEmployeesData() {
    this.i = 0;
    this.dynamicFileds = [];
    this.personalDetailForm = this.fb.group({
      fieldMaster: this.fb.array([
        // this.initMaster(),
      ])
    });

    this.serviceApi.get('/v1/employee/profile/' + this.empCode + '/PersonalDetails').subscribe(
      res => {
        res.sections.forEach(element => {
          this.dynamicFileds.push(element);
        });
        this.dynamicFileds.forEach(data => {
          console.log('data-->' + JSON.stringify(data));
          const control = <FormArray>this.personalDetailForm.controls['fieldMaster'];
          control.push(
            this.fb.group({
              sectionId: [data.sectionId],
              sectionName: [data.sectionName],
              sectionLocation: [data.employeeProfileLocation],
              accessLevel: [data.accessLevel],
              editable: [false],
              fields: this.fb.array([
              ]),
            })
          );
          console.log('fields -->' + data.fields);
          data.fields.forEach(fieldsData => {
            console.log(fieldsData);
            this.initFieldMaster(this.i, fieldsData);
          });
          this.i++;
        });
      },
      error => {
        console.log('err -->11111' + error);
      }
    );
  }
}
