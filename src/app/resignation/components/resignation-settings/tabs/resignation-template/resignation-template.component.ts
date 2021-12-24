import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ValidationMessagesService } from '../../..../../../../../validation-messages.service';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { KeycloakService } from '../../../../../keycloak/keycloak.service';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { delay } from 'rxjs/operators';
import { DataTable } from 'primeng/primeng';
declare var $: any;
@Component({
  selector: 'app-resignation-template',
  templateUrl: './resignation-template.component.html',
  styleUrls: ['./resignation-template.component.scss']
})
export class ResignationTemplateComponent implements OnInit, AfterViewInit {
  @ViewChild("dt1") dt: DataTable;
  // displayedColumns = ['resignationTemplateName', 'levelOfApprovers', 'noticePeriod', 'actionId'];
  columns = [
    { field: 'resignationTemplateName', header: 'Template Name' },
    { field: 'levelOfApprovers', header: 'Levels Of Approval' },
    { field: 'noticePeriod', header: 'Notice Period' },
    { field: 'actionId', header: 'Actions' }
  ]
  @ViewChild('f') myNgForm;
  // dataSource: MatTableDataSource<ResignationTemplate>;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;
  public resignationTamplateSetting: FormGroup;
  panelFirstWidth: any;
  panelFirstHeight: any;
  isLeftVisible = false;
  levelOfApprovers = [];
  templateList = []
  notificationMsg: any;
  action: String;
  employee: any[];
  defaultArray = ["HR_Manager"]
  allSelections = [];
  constructor(public dialog: MatDialog, private serviceApi: ApiCommonService, private fb: FormBuilder,
    private validationMessagesService: ValidationMessagesService) {
    this.getCriteria();
    this.resignationTamplateSetting = this.fb.group({
      assetDeallocationSupervisor: [],
      resignationTemplateId: [],
      resignationTemplateName: ['', [
        Validators.required,
        this.validationMessagesService.alphaNumericValidation
      ]],
      levelOfApprovers: [],
      noticePeriod: ['', Validators.required],
      allSelections: []
    });
    this.getEmployee();
  }
  getCriteria() {
    this.getAllDepartments();
    this.getAllBands();
    this.getAllDesignations();
    this.getAllOrgLocations()
  }

  getAllDepartments() {
    this.allSelections = [];
    this.serviceApi.get("/v1/organization/departments/getAll").pipe(delay(500)).subscribe(
      res => {
        res.forEach(element => {
          // var elemets = { id: element.deptId, type: 'Departments' };
          // console.log(elemets);
          this.allSelections = [...this.allSelections, {
            value: element.deptId,
            viewValue: element.deptName,
            type: 'Departments'
          }];
        });

      }, (err) => {

      }, () => {

      });
  }
  getAllBands() {
    this.serviceApi.get("/v1/organization/getAll/bands").subscribe(
      res => {
        if (res != null) {
          res.forEach(element => {
            // var elemets = { id: element.bandId, type: 'Bands' };
            this.allSelections = [...this.allSelections, {
              value: element.bandId,
              viewValue: element.bandName,
              type: 'Bands'
            }];
          });
        }
      }, (err) => {

      }, () => {

      });
  }
  getAllDesignations() {
    this.serviceApi.get("/v1/organization/getAll/designations").subscribe(
      res => {
        if (res != null) {
          res.forEach(element => {
            // var elemets = { id: element.id, type: 'Designations' };
            this.allSelections = [...this.allSelections, {
              value: element.id,
              viewValue: element.designationName,
              type: 'Designations'
            }];
          });
        }
      }, (err) => {

      }, () => {

      });

  }
  getAllOrgLocations() {
    this.serviceApi.get("/v1/organization/orgLocations").subscribe(
      res => {
        if (res != null) {
          res.forEach(element => {
            // var elemets = { id: element.locationId, type: 'Locations' };
            this.allSelections = [...this.allSelections, {
              value: element.locationId,
              viewValue: element.cityName,
              type: 'Locations'
            }];
          });
        }
      }, (err) => {

      }, () => {

      });
  }
  getEmployee() {
    this.employee = [];
    this.serviceApi.get('/v1/organization/manageadmin/').
      subscribe(
        res => {
          res.forEach(element => {

            console.log('element.empFirstName' + element.empFirstName);
            this.employee.push({
              value: element.empCode,
              viewValue: element.empName + '-' + element.empCode
            });
          });

        },
        () => {
          console.log('Enter into Else Bloack');
        }
      );
  }
  //set left/right panel offset width-----------------------------------------------------
  ngAfterViewInit(): void {
    this.getAllTemplate();
    if ($('.divtoggleDiv').length > 0) {
      this.panelFirstWidth = $('.divtoggleDiv')[0].offsetWidth;
      console.log('panelDive[0] width -->' + $('.divtoggleDiv')[0].offsetWidth);
      this.panelFirstHeight = $('.paneDiv')[0].offsetHeight;
      console.log('panelDive[0] height -->' + $('.divtoggleDiv')[0].offsetHeight);
      $('.divtoggleDiv')[1].style.display = 'none';
    }
  }

  //get all resignation template list----------------------------------------------------
  getAllTemplate() {
    console.log("Inside getAllTemplate All Template List");
    this.templateList = [];
    this.serviceApi.get('/v1/resignation/settings/resignationTemplate').
      subscribe(
        res => {
          console.log('Inside Resignation setting get response ... ' + JSON.stringify(res));
          res.forEach(element => {
            console.log('element.....' + element);
            this.templateList.push({
              resignationTemplateId: element.resignationTemplateId,
              resignationTemplateName: element.resignationTemplateName,
              levelOfApprovers: element.levelOfApprovers,
              noticePeriod: element.noticePeriod,
              assetDeallocationSupervisor: element.assetDeallocationSupervisor,
              showLevelOfApprovers: element.showLevelOfApprovers,
              departmentId: element.departmentIds,
              locationId: element.locationIds,
              designationId: element.designationIds,
              bandId: element.bandIds
            });
          });
          // this.dataSource = new MatTableDataSource(templateList);
          // this.dataSource.paginator = this.paginator;
          // this.dataSource.sort = this.sort;
        },
        error => {
          console.log('there is something json');
        }, () => {
          console.log('Enter into Else Block');
          this.dt.reset();
        });
  }
  // filter
  // applyFilter(filterValue: string) {
  //   console.log('hello' + filterValue);
  //   filterValue = filterValue.trim();
  //   filterValue = filterValue.toLowerCase(); 
  //   this.dataSource.filter = filterValue;
  // }
  //for reset form value for left/right panel--------------------------------------
  resetFormValue() {
    // this.myNgForm.reset();
    this.myNgForm.resetForm();
    this.myNgForm.reset();
    this.action = 'Add';
    $('.divtoggleDiv')[1].style.display = 'block';
    this.resignationTamplateSetting.reset();
    this.resignationTamplateSetting.controls.levelOfApprovers.setValue(this.defaultArray);

  }
  //set left/right panel width when switching--------------------------------------
  setPanel() {
    if ($('.divtoggleDiv').length > 0) {
      $('.divtoggleDiv')[1].style.display = 'none';
      $('.divtoggleDiv').width(this.panelFirstWidth);
    }
  }

  //save resignation template records----------------------------------------------
  saveTemplateRecord(element: any) {
    console.log(element);
    let deptIds = [];
    let bandIds = [];
    let designationIds = [];
    let locationIds = [];
    if (this.resignationTamplateSetting.valid) {
      this.isLeftVisible = !this.isLeftVisible;
      this.setPanel();
      let selections = this.resignationTamplateSetting.controls.allSelections.value;
      if (selections != null && selections.length > 0) {
        selections.forEach(element => {
          if (element.type === 'Departments') {
            deptIds.push(element.value);
          } else if (element.type === 'Bands') {
            bandIds.push(element.value);
          } else if (element.type === 'Designations') {
            designationIds.push(element.value)
          } else {
            locationIds.push(element.value);
          }
        });
      }
      // tslint:disable-next-line:prefer-const
      let resignationApprover: any;
      console.log('Array templtate');
      console.log(this.resignationTamplateSetting.controls.resignationTemplateId.value);
      const body = {
        'bandId': bandIds,
        'departmentId': deptIds,
        'designationId': designationIds,
        'locationId': locationIds,
        "assetDeallocationSupervisor": this.resignationTamplateSetting.controls.assetDeallocationSupervisor.value,
        'levelOfApprovers': this.resignationTamplateSetting.controls.levelOfApprovers.value,
        'noticePeriod': this.resignationTamplateSetting.controls.noticePeriod.value,
        'resignationTemplateId': this.resignationTamplateSetting.controls.resignationTemplateId.value,
        'resignationTemplateName': this.resignationTamplateSetting.controls.resignationTemplateName.value,
      };
      console.log('Body json---' + JSON.stringify(body));
      if (this.resignationTamplateSetting.controls.resignationTemplateId.value != null) {

        return this.serviceApi.put('/v1/resignation/settings/resignationTemplate/'
          + this.resignationTamplateSetting.controls.resignationTemplateId.value, body)
          .subscribe(
            res => {
              console.log('Templalte updated Succecfulluy---' + JSON.stringify(res));
              this.successNotification(res.message);
            }, err => {
              // this.warningNotification(err.message);
            }, () => {
              this.getAllTemplate();
            });
      } else {
        return this.serviceApi.post('/v1/resignation/settings/resignationTemplate', body)

          .subscribe(
            res => {
              console.log('TemplalteCreate Succecfulluy' + res);
              this.successNotification(res.message);
            }, err => {
              console.log('there is something error');
              // this.warningNotification(err.message);
            }, () => {
              this.getAllTemplate();
            });
      }
    } else {
      Object.keys(this.resignationTamplateSetting.controls).forEach(field => { // {1}
        const control = this.resignationTamplateSetting.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });

    }
  }

  //update resignation template records----------------------------------------------
  editResignationTemplate(element: any) {
    this.action = 'Update';
    this.isLeftVisible = !this.isLeftVisible;
    $('.divtoggleDiv')[1].style.display = 'block';
    let selections = [];
    element.departmentId != null ? element.departmentId.forEach(element => {
      selections.push({
        value: element.id,
        viewValue: element.name,
        type: 'Departments'
      });
    }) : '';
    element.bandId != null ? element.bandId.forEach(element => {
      selections.push({
        value: element.id,
        viewValue: element.name,
        type: 'Bands'
      });
    }) : '';
    element.locationId != null ? element.locationId.forEach(element => {
      selections.push({
        value: element.id,
        viewValue: element.name,
        type: 'Locations'
      });
    }) : '';
    element.designationId != null ? element.designationId.forEach(element => {
      selections.push({
        value: element.id,
        viewValue: element.name,
        type: 'Designations'
      });
    }) : '';
    console.log(selections);
    this.resignationTamplateSetting.reset();
    console.log(element);
    this.resignationTamplateSetting.controls.resignationTemplateId.setValue(element.resignationTemplateId);
    this.resignationTamplateSetting.controls.resignationTemplateName.setValue(element.resignationTemplateName);
    this.resignationTamplateSetting.controls.levelOfApprovers.setValue(element.levelOfApprovers);
    this.resignationTamplateSetting.controls.noticePeriod.setValue(element.noticePeriod);
    this.resignationTamplateSetting.controls.assetDeallocationSupervisor.setValue(element.assetDeallocationSupervisor);
    this.resignationTamplateSetting.controls.allSelections.patchValue(selections);
  }

  //for open delete dialogbox-----------------------------------------------------
  openDeleteDialog(data: any) {
    console.log(JSON.stringify(data));
    const dialogRef = this.dialog.open(DeleteResignationTamplate, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: {
        resignationTemplateId: data.resignationTemplateId, message: this.notificationMsg
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          console.log('Result value ..... ' + result.message);
          this.notificationMsg = result.message;
          this.successNotification(this.notificationMsg);
        }
        this.getAllTemplate();
      }
    });
  }

  // for show success notifications------------------------------------------------------
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

  ngOnInit() {
  }
}

//delete dialog component----------------------------------------------------------------
@Component({
  templateUrl: 'delete-resignation-template.html',
  styleUrls: ['./detete-resignation-template.scss']
})
// tslint:disable-next-line:component-class-suffix
export class DeleteResignationTamplate implements OnInit {
  message: any;
  constructor(
    public dialogRef: MatDialogRef<DeleteResignationTamplate>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  //for delete template ---------------------------------------------------------------------
  onDelete() {
    console.log('Resean id on delete ::: ' + this.data.resignationTemplateId);
    return this.serviceApi.delete('/v1/resignation/settings/resignationTemplate/' + this.data.resignationTemplateId)
      .subscribe(
        res => {
          console.log('Category Successfully Saved...' + JSON.stringify(res));
          if (res != null) {
            this.message = res.message;
            this.close();
          } else {
          }
        }, err => {
          console.log('Something gone Wrong');
          console.log('err -->' + err);
          // this.warningNotification(err.message);
        }, () => {

        });
  }
  ngOnInit() {
  }
  close(): void {
    this.data.message = this.message;
    this.dialogRef.close(this.data);
  }
}

export interface ResignationTemplate { }
let templateList: ResignationTemplate[] = [];

