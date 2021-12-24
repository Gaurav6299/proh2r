import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormArray, FormGroup, FormBuilder } from '../../../../../../node_modules/@angular/forms';
import { ActivatedRoute } from '../../../../../../node_modules/@angular/router';
import { MatDialog, MatTableDataSource } from '../../../../../../node_modules/@angular/material';
import { ApiCommonService } from '../../../../services/api-common.service';
import { ValidationMessagesService } from '../../../../validation-messages.service';
import { Subscription } from '../../../../../../node_modules/rxjs';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss'],
})
export class PersonalDetailsComponent implements OnInit, OnChanges {


  @Input() parentData: any;

  // @Output() messageEvent = new EventEmitter<string>();


  empCode: any;
  i = 0;
  dynamicFileds = [];
  dataSource: MatTableDataSource<Candidate>;
  personalDetailFieldMasterData: FormArray;
  public personalDetailForm: FormGroup;
  candidateId: any;
  iD: any = '';
  subscription: Subscription;
  message: any;
  constructor(private fb: FormBuilder, private route: ActivatedRoute, public dialog: MatDialog, private serviceApi: ApiCommonService) {
    this.route.params.subscribe(res =>
      this.empCode = res.id);
    this.dataSource = new MatTableDataSource([]);
  }


  get fieldMaster(): FormArray {
    return this.personalDetailForm.get('fieldMaster') as FormArray;
  }
  getEmployeesData() {
    const headerValue = 'PERSONAL_DETAILS';
    this.dynamicFileds = [];
    // this.iD = this.candidateId;
    this.personalDetailForm = this.fb.group({
      fieldMaster: this.fb.array([
      ])
    });
    this.serviceApi.get('/v1/recruitment/candidates/recField/' + +this.iD + '/' + headerValue).subscribe(
      res => {

        res.forEach(element => {
          this.dynamicFileds.push(element);
        });
        this.i = 0;
        this.dynamicFileds.forEach(data => {

          const control = <FormArray>this.personalDetailForm.controls['fieldMaster'];
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
      }, () => {
      }
    );
  }
  initFieldMaster(i: any, fieldsData: any) {
    const control = (<FormArray>this.personalDetailForm.controls['fieldMaster']).at(i).get('fields') as FormArray;
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
  ngOnChanges() {
    this.iD = this.parentData;
    this.getEmployeesData();
  }
  ngOnInit() { }


}
export interface Candidate { }

