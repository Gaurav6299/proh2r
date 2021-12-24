import { Component, OnInit, Input, HostListener } from '@angular/core';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { Http } from '@angular/http';
import { Headers } from '@angular/http';
import { RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common/src/directives/ng_if';
import { environment } from '../../../../../../environments/environment';
import { ApiCommonService } from '../../../../../../app/services/api-common.service'
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-other-details',
  templateUrl: './other-details.component.html',
  styleUrls: ['./other-details.component.scss']
})
export class OtherDetailsComponent implements OnInit {
  baseUrl = environment.baseUrl;
  empCode: any;
  dynamicFileds = [];
  i = 0;
  public otherDetailsForm: FormGroup;
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private serviceApi: ApiCommonService, private http: Http) {

    this.route.params.subscribe(res =>
      this.empCode = res.id);
    this.getEmployeesData();
  }

  get fieldMaster(): FormArray { return this.otherDetailsForm.get('fieldMaster') as FormArray; }


  ngOnInit() {

  }

  buildItems(fields: any) {

  }

  initFieldMaster(i: any, fieldsData: any) {
    console.log('i-->' + i);
    console.log('fieldName -->' + fieldsData.fieldName);
    const control = (<FormArray>this.otherDetailsForm.controls['fieldMaster']).at(i).get('fields') as FormArray;
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
      })
    );

  }

  getEmployeesData() {
    this.otherDetailsForm = this.fb.group({
      fieldMaster: this.fb.array([

      ])
    });

    this.serviceApi.get('/v1/employee/profile/' + this.empCode + '/OtherDetails').subscribe(
      res => {
        res.sections.forEach(element => {
          this.dynamicFileds.push(element);

        });
        this.dynamicFileds.forEach(data => {
          console.log('data-->' + JSON.stringify(data));
          const control = <FormArray>this.otherDetailsForm.controls['fieldMaster'];
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
            var d = new Date();
            var n = d.toLocaleDateString();
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
  save(data: FormGroup) {
    var body = {
      'employeeCode': this.empCode,
      "sections": [
        {
          'sectionId': data.controls.sectionId.value,
          'sectionName': data.controls.sectionName.value,
          'sectionLocation': data.controls.sectionLocation.value,
          'accessLevel': data.controls.accessLevel.value,
          'editable': data.controls.accessLevel.value,
          "fields": data.controls.fields.value
        }

      ]
    }


    if (this.otherDetailsForm.valid) {

      this.serviceApi.put('/v1/employee/profile/admin/', body)
       
        .subscribe(
        res => {
          console.log('profile data saved successfully');
        },
        err => {
          console.log('there is something error');
        }

        );

    }



  }


}
