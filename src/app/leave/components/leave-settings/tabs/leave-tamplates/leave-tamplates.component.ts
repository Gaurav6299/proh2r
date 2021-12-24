import { ChangeDetectionStrategy, Component, OnInit, Input, ViewChild, Inject, OnChanges, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { Http } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { DynamicLeaveCategoriesComponent } from '../../tabs/leave-tamplates/dynomictab/dynamic-leave-categories/dynamic-leave-categories.component';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { ValidationMessagesService } from '../../..../../../../../validation-messages.service';
import { KeycloakService } from '../../../../../keycloak/keycloak.service';
import { MatRadioChange, MatStepper } from '@angular/material';
import { StepperService } from "../../../../service/stepper.service";
import { delay } from 'rxjs/operators';
import { DataTable } from 'primeng/primeng';
declare var $: any;

@Component({
  selector: 'app-leave-tamplates',
  templateUrl: './leave-tamplates.component.html',
  styleUrls: ['./leave-tamplates.component.scss']
})
export class LeaveTamplatesComponent implements OnInit, OnChanges {
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('leaveFormTemplateform') form;
  checkingStatus: any;
  status: any;
  router: any;
  panelFirstWidth: any;
  panelFirstHeight: any;
  firstTemplateCompleteData;
  templateResponseObj = [];
  activeLeaveCategory;
  stateCtrl: FormControl;
  State = []
  filteredStates: Observable<any[]>;
  leaveCategories = [];
  clubbingRestrictionLeaveCategories = [];
  selectedEmployees: any;
  @ViewChild("dt1") dt: DataTable;
  recordID: any;
  leaveName: any;
  typeOfLeave: any;
  employeeType: any;
  isLeftVisible: any;
  nextStep = 1;
  LeaveCategorySetting = [];
  supervisorList1 = [];
  supervisorList2 = [];
  supervisorListCopy = [];
  checkedList = [];
  tempCheckList = [];
  leaveNotClubCategoryArray = [];
  leaveClubRestrictName = [];
  openDiv = true;
  public LeaveTamplateSetting: FormGroup;
  leaveClubRestrictions: FormArray;
  LeaveTemplateSetting = []
  message: string;
  states: any;
  notificationMsg: any;
  action: any;
  isValidFormSubmitted = true;
  requiredTextField;
  requiredDropdownButton;
  requiredRadioButton;
  checkleaveTemplateName: Boolean = false;

  editTemplateName: any;
  allSelections = [];

  filterStates(name: string) {
    return this.states.filter(state =>
      state.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
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

  openDeleteDialog(data: any) {
      console.log(JSON.stringify(data));
      const dialogRef = this.dialog.open(DeleteLeaveTamplate, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: { leaveTemplateId: data.leaveTemplateId }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            console.log('Result value ..... ' + result.message);
            if (result.status === 'Response') {
              this.notificationMsg = result.message;
              this.successNotification(this.notificationMsg);

              this.getAllLeaveSettingData();
            }
            // tslint:disable-next-line:one-line
            else if (result.status === 'Error') {
              this.notificationMsg = result.message;
              // this.warningNotification(this.notificationMsg);
            }
          }
        }
      });
  }
  receiveMessage($event, stepper: MatStepper) {
    // alert();
    console.log('receiveMessage called -->');
    console.log($event);
    // alert($event);

    if ($event !== 'continue') {
      if ($event === 'Cancel') {
        console.log('This event')
        this.nextStepValue();
        if (this.isLeftVisible) {
          this.getAllLeaveSettingData();
          this.isLeftVisible = !this.isLeftVisible;
        }
      } else {
        console.log($event);
        this.nextStep = $event;
        if (this.isLeftVisible) {
          // alert();
          this.getAllLeaveSettingData();
          this.isLeftVisible = !this.isLeftVisible;

        }
      }

    } else if ($event === 'backEvent') {
      // alert('Back' + $event);
      this.nextStep = 2;

      this.firstTemplateCompleteData = "data";

    } else {
      this.getAllLeaveSettingData();
      this.stepper.next();
    }
    // console.log($event);
    // this.nextStep = $event;
    // if (this.isLeftVisible) {
    //   // alert();
    //   this.getAllLeaveSettingData();
    //   this.isLeftVisible = !this.isLeftVisible;

    // }

  }
  abc: any;
  displayedColumns = [
    { field: 'leaveTemplateName', header: 'Leave Label' },
    { field: 'empCovered', header: 'Number Of Employees Covered' },
    { field: 'activeLeaveCategoriesCount', header: 'Number Of Leave Categories' },
    { field: 'action', header: 'Actions' }
  ];
  dataSource: MatTableDataSource<LeaveTemplate>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private stepperService: StepperService, public dialog: MatDialog, private serviceApi: ApiCommonService, private fb: FormBuilder, private http: Http,
    private validationMessagesService: ValidationMessagesService) {
    // this.nextStep = 0;
    console.log('constructor start');
    this.leaveCategories = [];
    this.getListOfSupervisor();

    // this.getAllLeaveCalegories();
    this.getAllLeaveSettingData();
    var rolesArr = KeycloakService.getUserRole();

    this.LeaveTamplateSetting = this.fb.group({
      leaveTemplateId: [],
      leaveTemplateName: [null, Validators.required],
      flexiLeave: [],
      activeLeaveCategories: [Validators.required],
      leaveApprovalLevel: [null, Validators.required],
      leaveApprovalType: [null, Validators.required],
      supervisorObject: [],
      supervisorObject1: [],
      isCommentMadatory: [null, Validators.required],
      isClubRestrictions: [null, Validators.required],
      isIncludeClubHoliday: [null, Validators.required],
      isIncludeClubWeeklyoffs: [null, Validators.required],
      categoryId: [],
      allSelections: [],
      leaveClubRestrictions: this.fb.array([this.initItemRows()]),
      dynamicCheckBoxLeaveCategories: this.fb.array([
        // this.initItemRows1()

      ])
    });
    this.validationMessagesService.currentRequiredTextField.subscribe(message => this.requiredTextField = message);
    this.validationMessagesService.currentRequiredDropdownButton.subscribe(message => this.requiredDropdownButton = message);
    this.validationMessagesService.currentRequiredRadioButton.subscribe(message => this.requiredRadioButton = message);


  }
  changeCategory(categorie: any) {
    console.log();

  }

  getCriteria() {
    this.getAllDepartments();
    this.getAllBands();
    this.getAllDesignations();
    this.getAllOrgLocations()
  }
  ngAfterViewInit(): void {

    console.log('CompanyPolicyDocumentsComponent ngAfterViewInit called');
    if ($('.divtoggleDiv').length != 0) {
      this.panelFirstWidth = $('.divtoggleDiv')[0].offsetWidth;
      console.log('panelDive[0] width -->' + $('.divtoggleDiv')[0].offsetWidth);
      this.panelFirstHeight = $('.paneDiv')[0].offsetHeight;
      console.log('panelDive[0] height -->' + $('.divtoggleDiv')[0].offsetHeight);
      $('.divtoggleDiv')[1].style.display = 'none';
    }

  }
  changeStepper(element: any) {
    // this.stepper.selectedIndex = element.index;
    // console.log(this.stepper);
    console.log(element.index);

    this.stepperService.changeStep(element.index);
  }
  setPanel() {
    this.getAllLeaveSettingData();
    this.getListOfSupervisor();
    this.getAllLeaveCalegories();
    $('.divtoggleDiv')[1].style.display = 'none';
    $('.divtoggleDiv').width(this.panelFirstWidth);
    this.LeaveTamplateSetting.reset();
    this.form.resetForm();
  }
  getAllDepartments() {
    this.allSelections = [];
    this.serviceApi.get("/v1/organization/departments/getAll").pipe(delay(500)).subscribe(
      res => {
        res.forEach(element => {
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
            this.allSelections = [...this.allSelections, {
              value: element.locationId,
              viewValue: element.locationCode.toUpperCase() + ' - ' + element.cityName,
              type: 'Locations'
            }];
          });
        }
      }, (err) => {

      }, () => {

      });
  }

  ngOnChanges() {

  }
  saveFirstStepRecord(element: any) {
    let deptIds = [];
    let bandIds = [];
    let designationIds = [];
    let locationIds = [];
    // this.getAllLeaveSettingData();
    let leaveClubRestrictionArray = [];
    this.checkleaveTemplateName = true;
    if (this.LeaveTamplateSetting.valid && (this.LeaveTamplateSetting.controls.leaveTemplateName.value) && this.checkedList.length > 0) {
      this.isValidFormSubmitted = true;


      const control = <FormArray>this.LeaveTamplateSetting.controls.leaveClubRestrictions;
      control.controls.forEach(element => {
        // console.log('element');
        console.log(element);
        leaveClubRestrictionArray.push({
          "leaveClubRestrictName": element.value.leaveClubRestrictName,
          "leaveNotClubCategory": [element.value.leaveNotClubCategory]

        })
      });

      // if (0 == leaveClubRestrictionArray.length) {
      //   this.isLeftVisible = !this.isLeftVisible; this.setPanel();
      //   return;
      // }
      let secondaryApprover: any
      let primaryApprover: any;
      console.log('Array templtate')
      console.log(this.LeaveTamplateSetting.controls.leaveTemplateId.value);
      console.log('active leave categories' + element.activeLeaveCategories)
      let checkList = [];
      console.log('checked event' + this.checkedList);
      for (var i = 0; i < this.checkedList.length; i++) {
        console.log('checked event77  ::::  ' + this.checkedList[i].value);
        checkList.push(this.checkedList[i].leaveName);
        // checkList.push(this.checkedList[i].categoryId);
        console.log("categoryId :: " + checkList);
      }
      console.log("record After Push===" + checkList);
      let selections = this.LeaveTamplateSetting.controls.allSelections.value;
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
      var body = {
        'bandId': bandIds,
        'departmentId': deptIds,
        'designationId': designationIds,
        'locationId': locationIds,
        "leaveTemplateName": this.LeaveTamplateSetting.controls.leaveTemplateName.value,
        "activeLeaveCategories": checkList,
        "leavePrimaryApprover": this.LeaveTamplateSetting.controls.supervisorObject.value,
        "leaveSecondaryApprover": this.LeaveTamplateSetting.controls.supervisorObject1.value,
        "flexiLeave": this.LeaveTamplateSetting.controls.flexiLeave.value,
        "clubRestrictions": this.LeaveTamplateSetting.controls.isClubRestrictions.value,
        "commentMadatory": this.LeaveTamplateSetting.controls.isCommentMadatory.value,
        "includeClubHoliday": this.LeaveTamplateSetting.controls.isIncludeClubHoliday.value,
        "includeClubWeeklyoffs": this.LeaveTamplateSetting.controls.isIncludeClubWeeklyoffs.value,
        "leaveApprovalLevel": this.LeaveTamplateSetting.controls.leaveApprovalLevel.value,
        "leaveApprovalType": this.LeaveTamplateSetting.controls.leaveApprovalType.value,
        "leaveClubRestrictions": leaveClubRestrictionArray
      }
      console.log("json record====" + JSON.stringify(body));

      if (this.LeaveTamplateSetting.controls.leaveTemplateId.value != null) {
        console.log('Inside Else')
        return this.serviceApi.put('/v1/leave/settings/leaveTemplate/' + this.LeaveTamplateSetting.controls.leaveTemplateId.value, body)

          .subscribe(
            res => {
              // res = res.json();
              console.log('Templalte updated Succecfulluy---' + JSON.stringify(res));
              console.log(res.message)
              this.successNotification('Template Updated SuccessFully');
              this.templateResponseObj = res;
              console.log(this.templateResponseObj);
              // console.log('Get Temp Response' + JSON.stringify(res));
              this.getAllLeaveSettingData();
            },
            err => {
              console.log('there is something error');
              console.log(err);
              console.log(err);
            },
            () => {
              this.nextStep = 2;
              $('.divtoggleDiv')[1].style.display = 'block';
            }
          );
      }
      else {
        return this.serviceApi.post('/v1/leave/settings/leaveTemplate', body)

          .subscribe(
            res => {
              console.log('TemplalteCreate Succecfulluy' + res);
              this.successNotification('Template Saved Successfully');
              this.templateResponseObj = res;
              console.log(this.templateResponseObj);
              // console.log('Reponse of saveFirstTemplate :::' + JSON.stringify(res));
              this.getAllLeaveSettingData();
            },
            err => {
              console.log('there is something error');
              // console.log(err);
            },
            () => {
              this.nextStep = 2;
              $('.divtoggleDiv')[1].style.display = 'block';
              console.log('templateResoponseObje');
              console.log(this.templateResponseObj);
            }
          );
      }
    }
    else {
      Object.keys(this.LeaveTamplateSetting.controls).forEach(field => { // {1}
        const control = this.LeaveTamplateSetting.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
      if (this.checkedList.length === 0) {
        this.LeaveTamplateSetting.controls.activeLeaveCategories.setValue(null);
        this.LeaveTamplateSetting.controls.activeLeaveCategories.setValidators([Validators.required]);
        this.LeaveTamplateSetting.controls.activeLeaveCategories.updateValueAndValidity();
      }
    }
  }


  //-------this api use to create dynomic Tab---//
  checkedStatus(event: any, element: any) {
    console.log("-----------------");
    console.log(element);
    let tempcheckvalue = element.leaveName;
    let tempTypeOfLeave = element.typeOfLeave;
    console.log(element.typeOfLeave);
    if (event.checked) {
      // this.tempCheckList=[];
      this.checkedList.push({
        index: this.checkedList.length,
        categoryId: element.categoryId,
        leaveName: element.leaveName,
        typeOfLeave: element.typeOfLeave,
        leaveAccrualPeriod: element.leaveAccrualPeriod,
        carryOverLimitsPolicy: element.carryOverLimitsPolicy,
        negativeLeaveBalance: element.negativeLeaveBalance,
        encashmentOnRollover: element.encashmentOnRollover,
        encashmentRecoveryOnFNF: element.encashmentRecoveryOnFNF,
      });

      console.log('checked event' + this.checkedList);
      console.log(this.checkedList);
    } else {

      this.tempCheckList = this.checkedList;
      console.log("tempchecklist object size==" + this.tempCheckList)
      this.checkedList = [];
      let index = 0;
      for (var i = 0; i < this.tempCheckList.length; i++) {
        if (this.tempCheckList[i].leaveName === tempcheckvalue) {
          console.log(this.tempCheckList[i] + '' + tempcheckvalue)
        }
        else {
          console.log("in else condition==" + this.tempCheckList[i] + "tempcheckvalue==" + tempcheckvalue);
          this.checkedList.push({
            index: index,
            categoryId: this.tempCheckList[i].categoryId,
            leaveName: this.tempCheckList[i].leaveName,
            typeOfLeave: this.tempCheckList[i].typeOfLeave,
            leaveAccrualPeriod: this.tempCheckList[i].leaveAccrualPeriod,
            carryOverLimitsPolicy: this.tempCheckList[i].carryOverLimitsPolicy,
            negativeLeaveBalance: this.tempCheckList[i].negativeLeaveBalance,
            encashmentOnRollover: this.tempCheckList[i].encashmentOnRollover,
            encashmentRecoveryOnFNF: this.tempCheckList[i].encashmentRecoveryOnFNF,
          });
          // console.log('checked List object after remove' + this.checkedList);
          index++;
          console.log("index::::" + index);
        }
      }
      this.tempCheckList = [];
      console.log('object after remove==');
      console.log(this.checkedList)

    }
  }

  checkedStatus1(isChecked: any, element: any) {
    console.log("-----------------");
    console.log(element);
    let tempcheckvalue = element.leaveName;
    let tempTypeOfLeave = element.typeOfLeave;
    console.log(element.typeOfLeave);
    if (isChecked) {
      // this.tempCheckList=[];
      this.checkedList.push({
        index: this.checkedList.length,
        categoryId: element.categoryId,
        leaveName: element.leaveName,
        typeOfLeave: element.typeOfLeave,
        leaveAccrualPeriod: element.leaveAccrualPeriod,
        carryOverLimitsPolicy: element.carryOverLimitsPolicy,
        negativeLeaveBalance: element.negativeLeaveBalance,
        encashmentOnRollover: element.encashmentOnRollover,
        encashmentRecoveryOnFNF: element.encashmentRecoveryOnFNF,
      });
      console.log('checked event' + this.checkedList);
      console.log(this.checkedList)
    } else {

      this.tempCheckList = this.checkedList;
      console.log("tempchecklist object size==" + this.tempCheckList)
      this.checkedList = [];
      let index = 0;
      for (var i = 0; i < this.tempCheckList.length; i++) {
        if (this.tempCheckList[i].leaveName === tempcheckvalue) {
          console.log(this.tempCheckList[i].leaveName + '' + tempcheckvalue)
        }
        else {
          console.log("in else condition==" + this.tempCheckList[i] + "tempcheckvalue==" + tempcheckvalue);
          this.checkedList.push({
            index: index,
            categoryId: this.tempCheckList[i].categoryId,
            leaveName: this.tempCheckList[i].leaveName,
            typeOfLeave: this.tempCheckList[i].typeOfLeave,
            leaveAccrualPeriod: this.tempCheckList[i].leaveAccrualPeriod,
            carryOverLimitsPolicy: this.tempCheckList[i].carryOverLimitsPolicy,
            negativeLeaveBalance: this.tempCheckList[i].negativeLeaveBalance,
            encashmentOnRollover: this.tempCheckList[i].encashmentOnRollover,
            encashmentRecoveryOnFNF: this.tempCheckList[i].encashmentRecoveryOnFNF,
          });
          // console.log('checked List object after remove' + this.checkedList);
          index++;
          console.log("index::::" + index);
        }
      }
      this.tempCheckList = [];
      console.log('object after remove==');
      console.log(this.checkedList)

    }
  }

  //-----Above code clossed here-------//

  getListOfSupervisor() {
    this.supervisorListCopy = [];
    this.supervisorList1 = [];
    this.supervisorList2 = [];

    this.serviceApi.get2('/v1/employee/filterEmployees').
      subscribe(
        res => {
          res.forEach(element => {
            this.supervisorListCopy.push({ value: element.empCode, viewValue: element.empFirstName + " " + element.empLastName + "-" + element.empCode });
            console.log("element.empFirstName" + element.empFirstName)
            this.supervisorList1.push({ value: element.empCode, viewValue: element.empFirstName + " " + element.empLastName + "-" + element.empCode });
          });
        },
        () => {
          console.log('Enter into Else Bloack');
        }
      );
    this.supervisorList2 = this.supervisorList1;
  }
  getAllLeaveCalegories() {
    this.leaveCategories = [];
    this.clubbingRestrictionLeaveCategories = [];
    this.serviceApi.get2('/v1/leave/settings/leaveCategories').
      subscribe(
        res => {
          res.forEach(element => {
            this.leaveCategories.push(
              {
                leaveAccrualPeriod: element.leaveAccrualPeriod,
                carryOverLimitsPolicy: element.carryOverLimitsPolicy,
                negativeLeaveBalance: element.negativeLeaveBalance,
                categoryId: element.categoryId,
                leaveName: element.leaveName,
                typeOfLeave: element.typeOfLeave,
                encashmentRecoveryOnFNF: element.encashmentRecoveryOnFNF,
                encashmentOnRollover: element.encashmentOnRollover,
              })
          });

        }, (err) => {

        },
        () => {
          this.clubbingRestrictionLeaveCategories = this.leaveCategories;
          console.log('Enter into Else Bloack');
          console.log(this.leaveCategories);
        }
      );
  }
  //-----this api show data on data table-------//
  getAllLeaveSettingData() {
    this.LeaveTemplateSetting = [];
    this.leaveClubRestrictName = [];
    this.leaveNotClubCategoryArray = [];
    var i = 0;
    var index = 0;
    this.serviceApi.get2('/v1/leave/settings/leaveTemplate').
      subscribe(
        res => {
          console.log('Inside Leave setting get response ... ' + JSON.stringify(res));
          res.forEach(element => {

            console.log(JSON.stringify(element));

            console.log('element.....' + element.leaveTemplateId);
            // if (element.leaveClubRestrictions != null && element.leaveClubRestrictions.length > 0) {
            //   element.leaveClubRestrictions.forEach(element1 => {
            //     console.log(element1);
            //     this.leaveClubRestrictName.push(
            //       {
            //         leaveClubRestrictName: element1.leaveClubRestrictName,
            //       });
            //     if (element1.leaveNotClubCategory != null && element1.leaveNotClubCategory.length > 0) {
            //       // element1.leaveNotClubCategory.forEach(element2 => {


            //       //   this.leaveNotClubCategoryArray.push(
            //       //     {
            //       //       leaveNotClubCategory: element2
            //       //     }
            //       //   );


            //       // })
            //       this.leaveNotClubCategoryArray = element.leaveClubRestrictions;
            //     }
            //   });

            // }
            this.LeaveTemplateSetting.push({
              empCovered: element.empCovered,
              leaveTemplateId: element.leaveTemplateId,
              leaveTemplateName: element.leaveTemplateName,
              activeLeaveCategories: element.activeLeaveCategories,
              activeLeaveCategoriesCount: element.activeLeaveCategories.length,
              flexiLeave: element.flexiLeave,
              leaveApprovalLevel: element.leaveApprovalLevel,
              leaveApprovalType: element.leaveApprovalType,
              supervisorObject: element.leavePrimaryApprover,
              supervisorObject1: element.leaveSecondaryApprover,
              isCommentMadatory: element.commentMadatory,
              isClubRestrictions: element.clubRestrictions,
              isIncludeClubWeeklyoffs: element.includeClubWeeklyoffs,
              isIncludeClubHoliday: element.includeClubHoliday,
              leaveTemplateCategories: element.leaveTemplateCategories,
              leaveClubRestrictName: this.leaveClubRestrictName,
              leaveNotClubCategory: this.leaveNotClubCategoryArray,
              departmentId: element.departmentId,
              locationId: element.locationId,
              designationId: element.designationId,
              bandId: element.bandId,
              leaveClubRestrictions: element.leaveClubRestrictions,


            });

          });

        }, (err) => {

        },
        () => {
          this.dt.reset();
          console.log('Enter into Else Bloack');
        }
      );
  }




  //----Above code clossed here-------//

  //------------this code open popup on click Delete Icon  button to Delate reason--------//
  resetFormValue() {
    this.LeaveTamplateSetting.controls.activeLeaveCategories.setValue(null);
    this.LeaveTamplateSetting.controls.activeLeaveCategories.setValidators([Validators.required]);
    this.LeaveTamplateSetting.controls.activeLeaveCategories.updateValueAndValidity();
    this.checkleaveTemplateName = false;

    $('.divtoggleDiv')[1].style.display = 'block';
    this.LeaveTamplateSetting.reset();
    this.firstTemplateCompleteData = undefined;
    this.editTemplateName = false;
    this.leaveCategories = [];
    this.clubbingRestrictionLeaveCategories = [];
    this.openDiv = true;
    // this.getListOfSupervisor();
    this.checkedList = [];
    this.getAllLeaveCalegories();
  }
  searchEmployeeNameForPrimarysupervisor(data: any) {
    // console.log(this.supervisorList);2

    if (this.myControl1.value != null) {
      this.supervisorList1 = this.supervisorListCopy.filter(option =>
        option.viewValue.toLowerCase().indexOf(this.myControl1.value.toLowerCase()) !== -1);
      // } else {
      console.log('Enter in the backSpace' + this.myControl);
      // this.myControl.reset();
      // this.getAllEmployeeList();
      // this.employeeList = this.employeeLists.filter(option =>
      //   option.fullName.toLowerCase().indexOf(this.myControl.value.toLowerCase()) === 0);
    }
  }
  searchEmployeeNameForSecondarysupervisor(data: any) {
    // console.log(this.supervisorList);

    // this.supervisorListCopy = [];
    // this.getListOfSupervisor();
    if (this.myControl2.value != null) {
      this.supervisorList2 = this.supervisorListCopy.filter(option =>
        option.viewValue.toLowerCase().indexOf(this.myControl2.value.toLowerCase()) !== -1);
      // } else {
      console.log('Enter in the backSpace' + this.myControl);
      // this.myControl.reset();
      // this.getAllEmployeeList();
      // this.employeeList = this.employeeLists.filter(option =>
      //   option.fullName.toLowerCase().indexOf(this.myControl.value.toLowerCase()) === 0);
    }
  }

  clearPrimaryMyControl() {
    this.myControl1.reset();
    this.supervisorList1 = this.supervisorListCopy;


  }

  clearSecondaryMyControl() {
    this.myControl2.reset();

    this.supervisorList2 = this.supervisorListCopy;

  }


  selectedApproval($event: MatRadioChange) {
    console.log("selectedApproval called ::: ");


    if ((this.LeaveTamplateSetting.controls.leaveApprovalLevel.value == 'FIRST_LEVEL') && (this.LeaveTamplateSetting.controls.leaveApprovalType.value == "TEMPLATEWISE")) {

      this.LeaveTamplateSetting.get('supervisorObject').setValidators([Validators.required]);

      this.LeaveTamplateSetting.get('supervisorObject1').clearValidators();
      this.LeaveTamplateSetting.get('supervisorObject1').updateValueAndValidity();
    }
    else if ((this.LeaveTamplateSetting.controls.leaveApprovalLevel.value == 'SECOND_LEVEL') && (this.LeaveTamplateSetting.controls.leaveApprovalType.value == "TEMPLATEWISE")) {

      this.LeaveTamplateSetting.get('supervisorObject').setValidators([Validators.required]);

      this.LeaveTamplateSetting.get('supervisorObject1').setValidators([Validators.required]);
    }
    if (this.LeaveTamplateSetting.controls.leaveApprovalType.value === 'EMPLOYEEWISE') {

      this.LeaveTamplateSetting.get('supervisorObject').clearValidators();
      this.LeaveTamplateSetting.get('supervisorObject').updateValueAndValidity();

      this.LeaveTamplateSetting.get('supervisorObject1').clearValidators();
      this.LeaveTamplateSetting.get('supervisorObject1').updateValueAndValidity();
      console.log("INSIDE THIRD IF BLCOK")
    }
  }

  // selectedApprovelChange() {
  //   console.log("selectedApproval called ::: ");
  //   console.log(this.LeaveTamplateSetting);
  //   if (this.LeaveTamplateSetting.controls.leaveApprovalLevel.value === 'FIRST_LEVEL' && this.LeaveTamplateSetting.controls.leaveApprovalType.value === 'TEMPLATEWISE') {
  //     this.LeaveTamplateSetting.controls.supervisorObject.setValidators(Validators.required);
  //   }

  // }
  saveEditedTemplate(element: any, event: any) {
    this.leaveCategories = [];
    this.clubbingRestrictionLeaveCategories = [];
    this.serviceApi.get2('/v1/leave/settings/leaveCategories').
      subscribe(
        res => {
          res.forEach(element => {
            this.leaveCategories.push(
              {
                leaveAccrualPeriod: element.leaveAccrualPeriod,
                carryOverLimitsPolicy: element.carryOverLimitsPolicy,
                negativeLeaveBalance: element.negativeLeaveBalance,
                categoryId: element.categoryId,
                leaveName: element.leaveName,
                typeOfLeave: element.typeOfLeave,
                encashmentOnRollover: element.encashmentOnRollover,
                encashmentRecoveryOnFNF: element.encashmentRecoveryOnFNF,
              })
          });

        }, (err) => {

        }, () => {
          this.clubbingRestrictionLeaveCategories = this.leaveCategories;
          if (this.openDiv) {
            this.LeaveTamplateSetting.controls.activeLeaveCategories.clearValidators();
            this.LeaveTamplateSetting.controls.activeLeaveCategories.updateValueAndValidity();

          }
          console.log(element);
            this.isLeftVisible = !this.isLeftVisible;
            this.editTemplateName = true;
            $('.divtoggleDiv')[1].style.display = 'block';
            const data = element;
            this.firstTemplateCompleteData = data;
            console.log('firstTemplateCompleteData');
            console.log(this.firstTemplateCompleteData);
            console.log('SaveEditedTemplate called');
            console.log(element);
            console.log(element.supervisorObject)
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
            this.openDiv = false
            this.LeaveTamplateSetting.reset();

            console.log("role id" + JSON.stringify(element));
            console.log(element.leaveTemplateId);
            console.log(element.activeLeaveCategories);
            this.getDynamicLeaveCategories(element, event, element.activeLeaveCategories);
            // this.LeaveTamplateSetting.controls.activeLeaveCategories.setValue('doc');
            this.LeaveTamplateSetting.controls.leaveTemplateId.setValue(element.leaveTemplateId);
            console.log(this.LeaveTamplateSetting.controls.leaveTemplateId.value);
            this.LeaveTamplateSetting.controls.leaveTemplateName.setValue(element.leaveTemplateName);
            this.LeaveTamplateSetting.controls.flexiLeave.setValue(element.flexiLeave);
            this.LeaveTamplateSetting.controls.leaveApprovalLevel.setValue(element.leaveApprovalLevel);
            this.LeaveTamplateSetting.controls.leaveApprovalType.setValue(element.leaveApprovalType);
            this.LeaveTamplateSetting.controls.supervisorObject.setValue(element.supervisorObject);
            this.LeaveTamplateSetting.controls.supervisorObject1.setValue(element.supervisorObject1);
            this.LeaveTamplateSetting.controls.isCommentMadatory.setValue("" + element.isCommentMadatory);
            this.LeaveTamplateSetting.controls.isClubRestrictions.setValue("" + element.isClubRestrictions);
            this.LeaveTamplateSetting.controls.isIncludeClubHoliday.setValue("" + element.isIncludeClubHoliday);
            this.LeaveTamplateSetting.controls.isIncludeClubWeeklyoffs.setValue("" + element.isIncludeClubWeeklyoffs);
            this.LeaveTamplateSetting.controls.allSelections.patchValue(selections);
            const control = <FormArray>this.LeaveTamplateSetting.controls['leaveClubRestrictions'];
            control.controls = [];
            element.leaveClubRestrictions.forEach(element => {
              control.push(this.fb.group({
                leaveClubRestrictName: [element.leaveClubRestrictName],
                leaveNotClubCategory: [element.leaveNotClubCategory[0]],
                leaveClubRestrictId: [element.leaveClubRestrictId],
              }));
            });
        });


    console.log(element);




    console.log(JSON.stringify(this.LeaveTamplateSetting.value));
  }
  ngOnInit() {

    this.getCriteria();
    // this.LeaveTamplateSetting = this.fb.group({
    //   leaveTemplateId: [],
    //   leaveTemplateName: [],
    //   flexiLeave: [],
    //   activeLeaveCategories: [],
    //   leaveApprovalLevel: [],
    //   leaveApprovalType: [],
    //   supervisorObject: [],
    //   supervisorObject1: [],
    //   isCommentMadatory: [],
    //   isClubRestrictions: [],
    //   isIncludeClubHoliday: [],
    //   isIncludeClubWeeklyoffs: [],
    //   categoryId: [],
    //   leaveClubRestrictions: this.fb.array([this.initItemRows()]),
    //   dynamicCheckBoxLeaveCategories: this.fb.array([
    //     // this.initItemRows1()
    //   ])
    // });

  }

  getDynamicLeaveCategories(element: any, event: any, elementCategories: any) {

    const controlDynamicCheckBoxLeaveCategories = <FormArray>this.LeaveTamplateSetting.controls['dynamicCheckBoxLeaveCategories'];
    while (controlDynamicCheckBoxLeaveCategories.length !== 0) {
      controlDynamicCheckBoxLeaveCategories.removeAt(0)
    }
    // this.getAllLeaveCalegories();
    console.log('getDynamicLeaveCategories called');
    console.log(this.leaveCategories);
    console.log(this.leaveCategories.length)
    this.leaveCategories.forEach(element1 => {
      const control = <FormArray>this.LeaveTamplateSetting.controls['dynamicCheckBoxLeaveCategories'];
      control.push(
        this.fb.group({
          leaveCategoriesElement: [element1],
          activeLeaveCategories: [element1.leaveName],
          leaveCategoryValue: [false],
        })
      );
    });

    this.checkedList = [];
    console.log('dynamicCheckBoxLeaveCategories work --->');
    const control = <FormArray>this.LeaveTamplateSetting.controls['dynamicCheckBoxLeaveCategories'];
    let index = 0;
    const length = control.length;
    control.controls.forEach(element => {
      elementCategories.forEach(elementCategories => {

        if (element.value.activeLeaveCategories === elementCategories) {
          const data = <FormGroup>control.at(index);
          data.controls.leaveCategoryValue.patchValue(true);
          this.checkedStatus1(true, element.value.leaveCategoriesElement);
        } else {

        }
      })
      index++;
    });
  }
  // changeClubbingRestrictionArray(event: any) {
  //   console.log(event);
  //   this.clubbingRestrictionLeaveCategories = [];
  //   console.log(this.leaveCategories);
  //   this.clubbingRestrictionLeaveCategories = this.leaveCategories.filter(category => category.leaveName != event.value);
  //   console.log(this.clubbingRestrictionLeaveCategories);
  // }
  selectedClubRestriction(event: any) {
    console.log(event.value);

    if (event.value == 'false') {
      const control = <FormArray>this.LeaveTamplateSetting.controls['leaveClubRestrictions'];
      while (control.length !== 0) {
        control.removeAt(0);
      }
      this.LeaveTamplateSetting.controls.isIncludeClubWeeklyoffs.setValue(false);
      this.LeaveTamplateSetting.controls.isIncludeClubHoliday.setValue(false);

    }
    else {
      const control = <FormArray>this.LeaveTamplateSetting.controls['leaveClubRestrictions'];
      while (control.length !== 0) {
        control.removeAt(0);
      }
      this.LeaveTamplateSetting.controls.isIncludeClubWeeklyoffs.setValue(false);
      this.LeaveTamplateSetting.controls.isIncludeClubHoliday.setValue(false);
    }
  }
  initItemRows() {
    return this.fb.group({
      leaveClubRestrictName: [''],
      leaveNotClubCategory: [''],
      leaveClubRestrictId: [''],
    });
  }

  myControl = new FormControl();

  myControl1 = new FormControl();

  myControl2 = new FormControl();
  selectedLeaveCategory = new FormControl();

  options = [
    { value: 'Sick leave', viewValue: 'Sick leave' },
    { value: 'Comp-Offs', viewValue: 'Comp-Offs' },
    { value: 'Privilege Leave', viewValue: 'Privilege Leave' },
    { value: 'General leave', viewValue: 'General leave' },
    { value: 'Maternal Leave', viewValue: 'Maternal Leave' },
    { value: 'Paternal Leave', viewValue: 'Paternal Leave' }
  ];


  optionsData = this.leaveCategories;
  addNewRow() {
    // const control = <FormArray>this.LeaveTamplateSetting.controls['leaveClubRestrictions'];
    // control.push(this.initItemRows());

    this.leaveClubRestrictions = <FormArray>this.LeaveTamplateSetting.controls['leaveClubRestrictions'];
    this.leaveClubRestrictions.push(this.initItemRows());
    console.log(this.leaveCategories);
  }

  deleteRow(index: number) {
    const control = <FormArray>this.LeaveTamplateSetting.controls['leaveClubRestrictions'];
    control.removeAt(index);
  }

  /*****below method call when select multple employee from holiday modal***** */
  // searchEmployeeName(data: any) {
  //   console.log('my method called' + data);
  //   this.optionsData = this.options.filter(option =>
  //     option.value.toLowerCase().indexOf(this.myControl.value.toLowerCase()) === 0);
  // }
  /*****above code clossed here***** */

  selectEmployee(i: any) {
    console.log('selected Employee called' + i);

  }
  nextStepValue() {
    this.LeaveTamplateSetting.reset();
    this.form.resetForm();
    this.isLeftVisible = false;
    this.setPanel();
    this.checkleaveTemplateName = false;
    this.nextStep = 1;
    this.stepperService.changeStep(0);
    console.log('Inside Back Button -----' + this.nextStep);
  }
  clickToCancel() {
    this.getAllLeaveCalegories();
    this.getAllLeaveSettingData();
  }

}



@Component({
  templateUrl: 'delete-template.html',
  styleUrls: ['./detete-leave-template.scss']
})
export class DeleteLeaveTamplate implements OnInit {
  error = 'Error Message';
  action: any;
  public bankInformationForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<DeleteLeaveTamplate>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService, private http: Http, private _fb: FormBuilder) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onDelete() {
    const val = this.data.leaveTemplateId;
    console.log('Resean id on delete<<<<<<<<<<<<<<<<<<<<< ' + val);
    return this.serviceApi.delete('/v1/leave/settings/leaveTemplate/' + val)

      .subscribe(
        res => {
          this.action = 'Response';
          this.error = 'Template deleted Succeessfully';
          this.close();
        },
        err => {
          console.log('there is something error');
          this.action = 'Error';
          this.error = 'Sorry!! This template is assigned to employees!';
          this.close();
        }
      );
  }
  ngOnInit() {
  }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
}
export interface LeaveTemplate {


}
let LeaveTemplateSetting: LeaveTemplate[] = [];

export class SupervisorList {
  constructor(public value: string, public viewValue: string) { }
}