import { Component, OnInit, AfterViewInit, Input, OnChanges } from '@angular/core';
import { FormArray, FormGroup, FormBuilder } from '../../../../../../node_modules/@angular/forms';
import { ActivatedRoute } from '../../../../../../node_modules/@angular/router';
import { MatDialog, MatTableDataSource } from '../../../../../../node_modules/@angular/material';
import { ApiCommonService } from '../../../../services/api-common.service';
import { ValidationMessagesService } from '../../../../validation-messages.service';

@Component({
  selector: 'app-employment-details',
  templateUrl: './employment-details.component.html',
  styleUrls: ['./employment-details.component.scss']
})
export class EmploymentDetailsComponent implements OnInit, OnChanges {
  @Input() parentData: any;
  empCode: any;
  i = 0;
  dynamicFileds = [];
  dataSource: MatTableDataSource<Candidate>;
  empDetailFieldMasterData: FormArray;
  public empDetailForm: FormGroup;
  candidateId: any;
  iD: any;
  constructor(private fb: FormBuilder, private route: ActivatedRoute, public dialog: MatDialog, private serviceApi: ApiCommonService, private validationMessagesService: ValidationMessagesService) {
    this.route.params.subscribe(res =>
      this.empCode = res.id);
    this.dataSource = new MatTableDataSource([]);
  }
  get fieldMaster(): FormArray {
    return this.empDetailForm.get('fieldMaster') as FormArray;
  }
  getEmployeesData() {
    const headerValue = 'EMPLOYMENT_DETAILS';
    this.dynamicFileds = [];
    this.empDetailForm = this.fb.group({
      fieldMaster: this.fb.array([
      ])
    });
    this.serviceApi.get('/v1/recruitment/candidates/recField/' + this.iD + '/' + headerValue).subscribe(
      res => {

        res.forEach(element => {
          this.dynamicFileds.push(element);
        });
        this.i = 0;
        this.dynamicFileds.forEach(data => {

          const control = <FormArray>this.empDetailForm.controls['fieldMaster'];
          control.push(
            this.fb.group({
              sectionId: [data.recSectionId],
              recSectionName: [data.recSectionName],
              recSectionLocation: [data.recSectionLocation],
              isDefault: [data.isDefault],
              fields: this.fb.array([
              ]),
            })
          );

          data.recFields.forEach(fieldsData => {
            this.initFieldMaster(this.i, fieldsData);
          });
          this.i++;
        });
      }, error => {
        console.log('err -->11111' + error);
      }
    );
  }
  initFieldMaster(i: any, fieldsData: any) {
    const control = (<FormArray>this.empDetailForm.controls['fieldMaster']).at(i).get('fields') as FormArray;
    control.push(
      this.fb.group({
        recFieldId: [fieldsData.recFieldId],
        recFieldName: [fieldsData.recFieldName],
        recFieldPlaceholder: [fieldsData.recFieldPlaceholder],
        recFieldValue: [fieldsData.recFieldValue],
        recFieldDescription: [fieldsData.recFieldDescription],
        recFieldType: [fieldsData.recFieldType],
        isDefault: [fieldsData.isDefault],
        isSensitive: [fieldsData.isSensitive],
        recOptions: [fieldsData.recOptions],
        isMandatory: [fieldsData.isMandatory]
      })
    );
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.iD = this.parentData;
    this.getEmployeesData();
  }

}
export interface Candidate { }
