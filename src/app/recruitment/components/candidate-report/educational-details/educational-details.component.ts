import { Component, OnInit, Input, AfterViewInit, OnChanges } from '@angular/core';
import { FormArray, FormGroup, FormBuilder } from '../../../../../../node_modules/@angular/forms';
import { ActivatedRoute } from '../../../../../../node_modules/@angular/router';
import { MatDialog, MatTableDataSource } from '../../../../../../node_modules/@angular/material';
import { ApiCommonService } from '../../../../services/api-common.service';
import { ValidationMessagesService } from '../../../../validation-messages.service';

@Component({
  selector: 'app-educational-details',
  templateUrl: './educational-details.component.html',
  styleUrls: ['./educational-details.component.scss']
})
export class EducationalDetailsComponent implements OnInit, OnChanges {



  @Input() parentData: any;


  empCode: any;
  i = 0;
  dynamicFileds = [];
  dataSource: MatTableDataSource<Candidate>;
  eduDetailFieldMasterData: FormArray;
  public eduDetailForm: FormGroup;
  candidateId: any;
  iD: any;
  _data: any;
  constructor(private fb: FormBuilder, private route: ActivatedRoute, public dialog: MatDialog, private serviceApi: ApiCommonService, private validationMessagesService: ValidationMessagesService) {
    this.route.params.subscribe(res =>
      this.empCode = res.id);
    this.dataSource = new MatTableDataSource([]);
  }
  get fieldMaster(): FormArray {
    return this.eduDetailForm.get('fieldMaster') as FormArray;
  }
  getEmployeesData() {
    const headerValue = 'EDUCATIONAL_DETAILS';
    this.dynamicFileds = [];
    this.eduDetailForm = this.fb.group({
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
          const control = <FormArray>this.eduDetailForm.controls['fieldMaster'];
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

      }
    );
  }
  initFieldMaster(i: any, fieldsData: any) {
    const control = (<FormArray>this.eduDetailForm.controls['fieldMaster']).at(i).get('fields') as FormArray;
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

  ngOnInit() { }


  ngOnChanges() {
    this.iD = this.parentData;
    this.getEmployeesData();
  }
}
export interface Candidate { }

