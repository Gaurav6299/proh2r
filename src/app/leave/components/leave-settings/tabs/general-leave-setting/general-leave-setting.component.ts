import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import 'rxjs/add/operator/map';
import { RequestOptions } from '@angular/http';
import { Headers } from '@angular/http';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { KeycloakService } from '../../../../../keycloak/keycloak.service';
import { ValidationMessagesService } from '../../../../../validation-messages.service';
import { delay } from 'rxjs/operators';
declare var $: any;
@Component({
  selector: 'app-general-leave-setting',
  templateUrl: './general-leave-setting.component.html',
  styleUrls: ['./general-leave-setting.component.scss']
})
export class GeneralLeaveSettingComponent implements OnInit {

  isEditable: boolean;
  generalSettingId: any;
  leaveCycleMonth: any;
  isAdminManage: any;
  isSupervisorManage: any;
  isLeaveAccrualRunDaily: any;
  balancesLockedAt: any;
  isFreezeInitialBalance: any;
  readonly: any;
  readwrite: any;
  GeneraLeaveSettingList = [];
  dailyleaveaccrualsDanger: any;
  dailyleaveaccrualsSuccess: any;
  error: any;
  requiredDateField: any;
  action: any;
  public generalLeaveSetting: FormGroup;
  allSelections: any[] = [];
  filterSelection: any[] = [];

  constructor(private fb: FormBuilder, private http: Http, private serviceApi: ApiCommonService, private validationMessagesService: ValidationMessagesService) {
    this.validationMessagesService.currentRequiredDateButton.subscribe(message => this.requiredDateField = message);
    this.readonly = true;
    this.isEditable = false;
    this.getCriteria();
    this.getAllGeneralSettingRecord();
    var rolesArr = KeycloakService.getUserRole();

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

  getAllGeneralSettingRecord() {
    this.allSelections = [];
    this.isEditable = false;
    this.serviceApi.get2('/v1/leave/settings/general/').subscribe(
      res => {
        console.log("leave cycle value==" + res.leaveCycleMonth)


        console.log("responce value==" + res);
        if (res != null) {
          console.log("his.generalLeaveSetting.controls.generalSettingId==" + this.generalLeaveSetting.controls.generalSettingId)
          this.generalLeaveSetting.controls.generalSettingId.setValue(res.generalSettingId);
          this.generalLeaveSetting.controls.leaveCycleMonth.setValue(res.leaveCycleMonth);
          this.generalLeaveSetting.controls.isAdminManage.setValue("" + res.isAdminManage);
          if (res.isAdminManage === true) {
            this.isAdminManage = "Yes"
          }
          else if (res.isAdminManage === false) {
            this.isAdminManage = "No"
          }
          this.generalLeaveSetting.controls.isSupervisorManage.setValue("" + res.isSupervisorManage);
          if (res.isSupervisorManage === true) {
            this.isSupervisorManage = "Yes"
          }
          else if (res.isSupervisorManage === false) {
            this.isSupervisorManage = "No"
          }
          this.generalLeaveSetting.controls.isLeaveAccrualRunDaily.setValue("" + res.isLeaveAccrualRunDaily);
          if (res.isLeaveAccrualRunDaily === true) {
            this.dailyleaveaccrualsSuccess = "Yes";
          }
          else if (res.isLeaveAccrualRunDaily === false) {
            this.dailyleaveaccrualsDanger = "No";
          }
          this.generalLeaveSetting.controls.balancesLockedAt.setValue("" + res.balancesLockedAt);
          this.generalLeaveSetting.controls.slApplicationLimit.setValue(res.slApplicationLimit);
          this.generalLeaveSetting.controls.maxDurationInMins.setValue(res.maxDurationInMins);
          this.generalLeaveSetting.controls.isFreezeInitialBalance.setValue("" + res.isFreezeInitialBalance);

          res.departmentIdResponseObj != null ? res.departmentIdResponseObj.forEach(element => {
            this.allSelections.push({
              value: element.id,
              viewValue: element.name,
              type: 'Departments'
            });
          }) : '';
          res.bandIdResponseObj != null ? res.bandIdResponseObj.forEach(element => {
            this.allSelections.push({
              value: element.id,
              viewValue: element.name,
              type: 'Bands'
            });
          }) : '';
          res.locationIdResponseOBj != null ? res.locationIdResponseOBj.forEach(element => {
            this.allSelections.push({
              value: element.id,
              viewValue: element.name,
              type: 'Locations'
            });
          }) : '';
          res.designationIdResponseObj != null ? res.designationIdResponseObj.forEach(element => {
            this.allSelections.push({
              value: element.id,
              viewValue: element.name,
              type: 'Designations'
            });
          }) : '';
          res.empListResponseObj != null ? res.empListResponseObj.forEach(element => {
            this.allSelections.push({
              value: element.empCode,
              viewValue: element.name,
              type: 'Employees'
            });
          }) : '';
          this.generalLeaveSetting.controls.allSelections.setValue(this.allSelections);

          if (res.isFreezeInitialBalance === true) {
            this.isFreezeInitialBalance = "Yes"

          }
          else if (res.isFreezeInitialBalance === false) {
            this.isFreezeInitialBalance = "No"
          }
          this.readwrite = false;
          this.readonly = true;
        }
        else {

          this.isEditable = true;
          this.readwrite = false;
          this.readonly = true;


          console.log("Record Not Exist");
        }
      },
      error => {
        this.isEditable = true;
        this.readwrite = false;
        this.readonly = true;
        console.log('there is something json');
      }
    );
  }

  ngOnInit() {

    this.generalLeaveSetting = this.fb.group({
      generalSettingId: [],
      leaveCycleMonth: [],
      isAdminManage: [],
      isSupervisorManage: [],
      leaveAccrualDate: [],
      isLeaveAccrualRunDaily: [],
      balancesLockedAt: ['', Validators.required],

      isFreezeInitialBalance: [],
      slApplicationLimit: [],
      maxDurationInMins: [],
      allSelections: []

    });
  }

  getCriteria() {
    this.filterSelection = [];
    this.getAllDepartments();
    this.getAllBands();
    this.getAllDesignations();
    this.getAllOrgLocations();
    this.getAllEmployees();
  }
  getAllDepartments() {
    console.log(this.allSelections);
    this.serviceApi.get("/v1/organization/departments/getAll").subscribe(
      res => {
        res.forEach(element => {
          this.filterSelection = [...this.filterSelection, {
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
            this.filterSelection = [...this.filterSelection, {
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
            this.filterSelection = [...this.filterSelection, {
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
            this.filterSelection = [...this.filterSelection, {
              value: element.locationId,
              viewValue: element.locationCode + ' - ' + element.cityName,
              type: 'Locations'
            }];
          });
        }
        console.log(this.filterSelection)
      }, (err) => {

      }, () => {

      });
  }
  getAllEmployees() {
    this.serviceApi.get('/v1/employee/filterEmployees').
      subscribe(
        res => {
          res.forEach(element => {

            this.filterSelection = [...this.filterSelection, {
              value: element.empCode,
              viewValue: element.empFirstName + ' ' + element.empLastName,
              type: 'Employees'
            }];

          });
        }, err => {

        }, () => {
          console.log('Enter into Else Bloack');
        });
  }

  edit() {
    this.isEditable = true;
    this.readwrite = true;
    this.readonly = false;

    this.dailyleaveaccrualsDanger = false
    this.dailyleaveaccrualsSuccess = false;
  }

  radioButtonStatus(data: any) {
    if (data.value === 'false') {

    }
    else {
    }

  }
  cancel() {
    this.isEditable = false;
    this.readwrite = false;
    this.readonly = true;


    this.getAllGeneralSettingRecord();
    if (this.generalLeaveSetting.controls.isLeaveAccrualRunDaily.value === "true") {

      this.dailyleaveaccrualsSuccess = true;
    }
    else if (this.isLeaveAccrualRunDaily === "false") {
      this.dailyleaveaccrualsDanger = true;

    }
  }
  save() {
    this.isEditable = false;
    this.readwrite = false;
    this.readonly = true;
    const bandIds = [];
    const departmentIds = [];
    const designationIds = [];
    const empCodes = [];
    const locationIds = [];

    const selections = this.generalLeaveSetting.controls.allSelections.value;
    selections.forEach(element => {
      if (element.type == 'Bands') bandIds.push(element.value);
      else if (element.type == 'Departments') departmentIds.push(element.value);
      else if(element.type == 'Designations') designationIds.push(element.value);
      else if(element.type == 'Employees') empCodes.push(element.value);
      else if(element.type == 'Locations') locationIds.push(element.value);
    })

    const body = {
      "balancesLockedAt": this.generalLeaveSetting.controls.balancesLockedAt.value,
      "bandIds": bandIds,
      "departmentIds": departmentIds,
      "designationIds": designationIds,
      "empCodes": empCodes,
      "generalSettingId": this.generalLeaveSetting.controls.generalSettingId.value,
      "isAdminManage": this.generalLeaveSetting.controls.isAdminManage.value,
      "isFreezeInitialBalance": this.generalLeaveSetting.controls.isFreezeInitialBalance.value,
      "isLeaveAccrualRunDaily": this.generalLeaveSetting.controls.isLeaveAccrualRunDaily.value,
      "isSupervisorManage": this.generalLeaveSetting.controls.isSupervisorManage.value,
      "leaveCycleMonth": this.generalLeaveSetting.controls.leaveCycleMonth.value,
      "locationIds": locationIds,
      "maxDurationInMins": this.generalLeaveSetting.controls.maxDurationInMins.value,
      "slApplicationLimit": this.generalLeaveSetting.controls.slApplicationLimit.value,
    }
    console.log(body);
    this.serviceApi.put('/v1/leave/settings/general/' + +this.generalLeaveSetting.controls.generalSettingId.value, body)

      .subscribe(
        res => {
          console.log('profile data saved successfully');
          this.successNotification(res.message);
          this.getAllGeneralSettingRecord();
        },
        err => {
          console.log('there is something error');
          // this.warningNotification(err.message);
        }

      );

  }

}
