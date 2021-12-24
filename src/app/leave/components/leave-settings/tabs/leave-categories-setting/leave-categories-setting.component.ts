import { ChangeDetectionStrategy, Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { Http } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { environment } from '../../../../../../environments/environment';
declare var $: any;
import { KeycloakService } from '../../../../../keycloak/keycloak.service';
import { ValidationMessagesService } from '../../../../../validation-messages.service';
import { DataTable } from 'primeng/primeng';
@Component({
  selector: 'app-leave-categories-setting',
  templateUrl: './leave-categories-setting.component.html',
  styleUrls: ['./leave-categories-setting.component.scss']
})
export class LeaveCategoriesSettingComponent implements OnInit, AfterViewInit {
  panelFirstWidth: any;
  panelFirstHeight: any;
  butDisabled: boolean = true;
  baseUrl = environment.baseUrl;
  recordID: any;
  leaveName: any;
  typeOfLeave: any;
  employeeType: any;
  isLeftVisible: any;
  showbudatebutton: any;
  showsavebutton: any;
  notificationMsg: any;
  action: any;
  isValidFormSubmitted = true;
  requiredTextField;
  requiredRadioButton;
  requiredDropdownButton;
  requiredDateButton;
  tableLeaveCatagoriesSetting = [];
  checktypeOfLeave: boolean = false;
  checkleaveName: boolean = false;
  checkleaveAbbrv: boolean = false;
  checkleaveAccrualPeriod: boolean = false;
  editMode: boolean = false;
  @ViewChild("dt1") dt: DataTable;



  public LeaveCategoriesSetting: FormGroup;

  displayedColumns = [
    { field: 'leaveName', header: 'Leave Label' },
    { field: 'typeOfLeave', header: 'Leave Type' },
    { field: 'leaveAccrualPeriod', header: 'Frequency Of Accrual' },
    { field: 'action', header: 'Actions' }
  ];
  dataSource: MatTableDataSource<LeaveCategoriesSettingData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('leaveCategoriesSettingForm') form;
  constructor(public dialog: MatDialog, private fb: FormBuilder, private serviceApi: ApiCommonService,
    private http: Http, private validationMessagesService: ValidationMessagesService,) {

    this.getAllLeaveSettingData();
    this.validationMessagesService.currentRequiredTextField.subscribe(message => this.requiredTextField = message);
    this.validationMessagesService.currentRequiredRadioButton.subscribe(message => this.requiredRadioButton = message);
    this.validationMessagesService.currentRequiredDateButton.subscribe(message => this.requiredDateButton = message);
    this.validationMessagesService.currentRequiredDropdownButton.subscribe(message => this.requiredDropdownButton = message);
    // this.validationMessagesService.numericValidation.subscribe(message => this.requiredDropdownButton = message);

    var rolesArr = KeycloakService.getUserRole();

    this.LeaveCategoriesSetting = this.fb.group({
      proRationByJoiningDate: [],
      categoryId: [],
      AnnualHolidayIsPartOfLeaveRequest: [],
      Weeklyoffholidayispartofthehalfdayleaverequest: [],
      IfWeeklyIsPartOfLeaveRequest: [],
      typeOfLeave: [],
      leaveName: [],
      leaveAbbrv: [],
      leaveAccrualPeriod: [],
      advanceAccrueLeave: [],
      carryOverLimitsPolicy: [],
      negativeLeaveBalance: [],
      roundOffAccrual: [],
      intraCycleLaps: [],
      applicableCompOffEarning: [],
      lapsTimeForCompOffs: [],
      lapsTimeDurations:[],
      leaveLapsAmount:[],
      fixedCutoffDay: [],
      joinDayOfTheMonth: [null, [Validators.min(0), Validators.max(31)]],
      resignDayOfTheMonth: [null, [Validators.min(0), Validators.max(31)]],
      canEmpApplyForThisLeaveCat: [null, Validators.required],
      halfDayOption: [],
      includeAnnualHoliday: [],
      includeWeeklyOff: [],
      includeWeeklyOffHalfdayRequest: [],
      leavePaid: [],
      submitLeaveBefore: [],
      maxConsecutiveLeaveDays: [],
      minConsecutiveLeaveDays: [],
      seperateLeaveByWeekOff: [false],
      leaveSeperatedByHoliday: [false],
      uploadDocument: [],
      uploadingDocMandatory: [],
      dateRestriction: [],
      dateDescription: [],
      daysAfterOrBefore: [],
      encashmentOnRollover: [],
      encashmentRecoveryOnFNF: [],
      includeInPayslip: [],
      // leaveAccrualDate: [null, Validators.required],
      daysBeforeDelivery: [null, Validators.required],
      defaultCategory:[],
      // includeAnnualHolidayPrefixSuffix:[],
      // includeWeeklyOffPrefixSuffix:[]
    });

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
  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit(): void {
    if ($('.divtoggleDiv').length > 0) {
      this.panelFirstWidth = $('.divtoggleDiv')[0].offsetWidth;
      console.log('panelDive[0] width -->' + $('.divtoggleDiv')[0].offsetWidth);
      this.panelFirstHeight = $('.paneDiv')[0].offsetHeight;
      console.log('panelDive[0] height -->' + $('.divtoggleDiv')[0].offsetHeight);
      $('.divtoggleDiv')[1].style.display = 'none';
    }
  }
  setPanel() {
    this.checktypeOfLeave = false;
    this.checkleaveName = false;
    this.checkleaveAbbrv = false;
    this.checkleaveAccrualPeriod = false;


    // this.LeaveCategoriesSetting.controls.typeOfLeave.clearValidators();
    // this.LeaveCategoriesSetting.controls.typeOfLeave.updateValueAndValidity();

    // this.LeaveCategoriesSetting.controls.leaveName.clearValidators();
    // this.LeaveCategoriesSetting.controls.leaveName.updateValueAndValidity();

    // this.LeaveCategoriesSetting.controls.leaveAbbrv.clearValidators();
    // this.LeaveCategoriesSetting.controls.leaveAbbrv.updateValueAndValidity();
    // this.ngOnInit();


    //   Object.keys(this.LeaveCategoriesSetting.controls).forEach(field => { // {1}
    //   const control = this.LeaveCategoriesSetting.get(field);  
    //   console.log(control);  
    //   // control.markAsUntouched({onlySelf:false}) = false        // {2}
    //   control.markAsUntouched({ onlySelf: false });       // {3}
    // });


    this.validationMessagesService.currentRequiredTextField.subscribe(message => this.requiredTextField = message);
    this.validationMessagesService.currentRequiredRadioButton.subscribe(message => this.requiredRadioButton = message);
    this.validationMessagesService.currentRequiredDateButton.subscribe(message => this.requiredDateButton = message);
    this.validationMessagesService.currentRequiredDropdownButton.subscribe(message => this.requiredDropdownButton = message);

    this.LeaveCategoriesSetting.reset();
    // this.LeaveCategoriesSetting.clearValidators();
    // this.LeaveCategoriesSetting.updateValueAndValidity();
    if ($('.divtoggleDiv').length > 0) {
      $('.divtoggleDiv')[1].style.display = 'none';

      $('.divtoggleDiv').width(this.panelFirstWidth);
      //$('.divtoggleDiv').height(this.panelFirstHeight);
    }
  }

  getAllLeaveSettingData() {
    this.tableLeaveCatagoriesSetting = [];
    this.serviceApi.get2('/v1/leave/settings/leaveCategories').
      subscribe(
        res => {
          res.forEach(element => {
            this.tableLeaveCatagoriesSetting.push(
              {
                categoryId: element.categoryId,
                leaveName: element.leaveName,
                typeOfLeave: element.typeOfLeave,
                leaveAccrualPeriod: element.leaveAccrualPeriod,
                leaveAbbrv: element.leaveAbbrv,
                advanceAccrueLeave: element.advanceAccrueLeave,
                carryOverLimitsPolicy: element.carryOverLimitsPolicy,
                negativeLeaveBalance: element.negativeLeaveBalance,
                fixedCutoffDay: element.fixedCutoffDay,
                joinDayOfTheMonth: element.joinDayOfTheMonth,
                resignDayOfTheMonth: element.resignDayOfTheMonth,
                canEmpApplyForThisLeaveCat: element.canEmpApplyForThisLeaveCat,
                halfDayOption: element.halfDayOption,
                includeAnnualHoliday: element.includeAnnualHoliday,
                includeWeeklyOff: element.includeWeeklyOff,
                includeWeeklyOffHalfdayRequest: element.includeWeeklyOffHalfdayRequest,
                leavePaid: element.leavePaid,
                submitLeaveBefore: element.submitLeaveBefore,
                maxConsecutiveLeaveDays: element.maxConsecutiveLeaveDays,
                minConsecutiveLeaveDays: element.minConsecutiveLeaveDays,
                seperateLeaveByWeekOff: element.seperateLeaveByWeekOff,
                leaveSeperatedByHoliday: element.leaveSeperatedByHoliday,
                uploadDocument: element.uploadDocument,
                dateRestriction: element.dateRestriction,
                uploadingDocMandatory: element.uploadingDocMandatory,
                dateDescription: element.dateDescription,
                // leaveAccrualDate: element.leaveAccrualDate,
                encashmentOnRollover: element.encashmentOnRollover,
                encashmentRecoveryOnFNF: element.encashmentRecoveryOnFNF,
                roundOffAccrual: element.roundOffAccrual,
                intraCycleLaps: element.intraCycleLaps,
                includeInPayslip: element.includeInPayslip,
                daysBeforeDelivery: element.daysBeforeDelivery,
                defaultCategory: element.defaultCategory,
                applicableCompOffEarning: element.applicableCompOffEarning,
                lapsTimeForCompOffs: element.lapsTimeForCompOffs,
                lapsTimeDurations: element.lapsTimeDurations,
                // leaveLapsAmount: element.leaveLapsAmount,
                // includeAnnualHolidayPrefixSuffix: element.includeAnnualHolidayPrefixSuffix,
                // includeWeeklyOffPrefixSuffix: element.includeWeeklyOffPrefixSuffix
              });
          });
          this.dataSource = new MatTableDataSource(this.tableLeaveCatagoriesSetting);

        }, (err) => {

        },
        () => {
          this.dt.reset();
          console.log('Enter into Else Bloack');
        }
      );
  }
  formReset() {
    this.form.resetForm();
    this.editMode = false
    this.checktypeOfLeave = false;
    this.checkleaveName = false;
    this.checkleaveAbbrv = false;
    this.checkleaveAccrualPeriod = false;

    ;
    // this.LeaveCategoriesSetting.get('typeOfLeave').setValidators(Validators.required);

    // alert();
    // this.LeaveCategoriesSetting.controls.typeOfLeave.clearValidators();
    // this.LeaveCategoriesSetting.controls.typeOfLeave.setValue([]);



    $('.divtoggleDiv')[1].style.display = 'block';
    this.showbudatebutton = false;
    this.showsavebutton = true;
    this.LeaveCategoriesSetting.reset();
  }
  selectedHalfDayOption() {
    if (this.LeaveCategoriesSetting.controls.halfDayOption.value === 'false') {
      this.LeaveCategoriesSetting.controls.Weeklyoffholidayispartofthehalfdayleaverequest.setValue(null)
    }
  }
  //------------this code open popup on click Delete Icon  button to Delate reason--------//
  getData(element: any) {
    this.editMode = true;
    this.checktypeOfLeave = true;
    this.checkleaveName = true;
    this.checkleaveAbbrv = true;
    this.checkleaveAccrualPeriod = true;
    this.checkleaveName = true;
      this.isLeftVisible = !this.isLeftVisible;
      $('.divtoggleDiv')[1].style.display = 'block';
      this.showbudatebutton = true;
      this.showsavebutton = false;
      this.LeaveCategoriesSetting.controls.categoryId.setValue(element.categoryId);
      console.log("role id" + JSON.stringify(element));
      console.log(element.categoryId)
      this.LeaveCategoriesSetting.controls.typeOfLeave.setValue(element.typeOfLeave);
      this.LeaveCategoriesSetting.controls.leaveName.setValue(element.leaveName);
      this.LeaveCategoriesSetting.controls.leaveAbbrv.setValue(element.leaveAbbrv);
      this.LeaveCategoriesSetting.controls.leaveAccrualPeriod.setValue(element.leaveAccrualPeriod);
      this.LeaveCategoriesSetting.controls.advanceAccrueLeave.setValue('' + element.advanceAccrueLeave);
      this.LeaveCategoriesSetting.controls.carryOverLimitsPolicy.setValue('' + element.carryOverLimitsPolicy);
      this.LeaveCategoriesSetting.controls.negativeLeaveBalance.setValue('' + element.negativeLeaveBalance);
      this.LeaveCategoriesSetting.controls.fixedCutoffDay.setValue('' + element.fixedCutoffDay)
      this.LeaveCategoriesSetting.controls.halfDayOption.setValue('' + element.halfDayOption)
      this.LeaveCategoriesSetting.controls.joinDayOfTheMonth.setValue(element.joinDayOfTheMonth);
      this.LeaveCategoriesSetting.controls.resignDayOfTheMonth.setValue(element.resignDayOfTheMonth);
      this.LeaveCategoriesSetting.controls.canEmpApplyForThisLeaveCat.setValue('' + element.canEmpApplyForThisLeaveCat);
      this.LeaveCategoriesSetting.controls.includeAnnualHoliday.setValue('' + element.includeAnnualHoliday)
      this.LeaveCategoriesSetting.controls.includeWeeklyOff.setValue('' + element.includeWeeklyOff)
      this.LeaveCategoriesSetting.controls.includeWeeklyOffHalfdayRequest.setValue("" + element.includeWeeklyOffHalfdayRequest);
      this.LeaveCategoriesSetting.controls.leavePaid.setValue("" + element.leavePaid)
      this.LeaveCategoriesSetting.controls.submitLeaveBefore.setValue(element.submitLeaveBefore);
      this.LeaveCategoriesSetting.controls.maxConsecutiveLeaveDays.setValue(element.maxConsecutiveLeaveDays);
      this.LeaveCategoriesSetting.controls.minConsecutiveLeaveDays.setValue(element.minConsecutiveLeaveDays);
      this.LeaveCategoriesSetting.controls.seperateLeaveByWeekOff.setValue('' + element.seperateLeaveByWeekOff);
      this.LeaveCategoriesSetting.controls.leaveSeperatedByHoliday.setValue('' + element.leaveSeperatedByHoliday);
      this.LeaveCategoriesSetting.controls.uploadDocument.setValue('' + element.uploadDocument);
      this.LeaveCategoriesSetting.controls.uploadingDocMandatory.setValue('' + element.uploadingDocMandatory);
      this.LeaveCategoriesSetting.controls.dateRestriction.setValue('' + element.dateRestriction);
      this.LeaveCategoriesSetting.controls.dateDescription.setValue('' + element.dateDescription);
      // this.LeaveCategoriesSetting.controls.leaveAccrualDate.setValue(element.leaveAccrualDate);
      this.LeaveCategoriesSetting.controls.encashmentOnRollover.setValue('' + element.encashmentOnRollover);
      this.LeaveCategoriesSetting.controls.encashmentRecoveryOnFNF.setValue(''+element.encashmentRecoveryOnFNF);
      this.LeaveCategoriesSetting.controls.roundOffAccrual.setValue(''+element.roundOffAccrual);
      this.LeaveCategoriesSetting.controls.intraCycleLaps.setValue('' + element.intraCycleLaps);
      this.LeaveCategoriesSetting.controls.includeInPayslip.setValue('' + element.includeInPayslip);
      this.LeaveCategoriesSetting.controls.daysBeforeDelivery.setValue(element.daysBeforeDelivery);
      this.LeaveCategoriesSetting.controls.defaultCategory.setValue('' + element.defaultCategory);
      this.LeaveCategoriesSetting.controls.applicableCompOffEarning.setValue('' + element.applicableCompOffEarning);
      this.LeaveCategoriesSetting.controls.lapsTimeForCompOffs.setValue('' + element.lapsTimeForCompOffs);
      this.LeaveCategoriesSetting.controls.lapsTimeDurations.setValue(element.lapsTimeDurations);
      this.LeaveCategoriesSetting.controls.leaveLapsAmount.setValue(element.leaveLapsAmount);
      // this.LeaveCategoriesSetting.controls.includeAnnualHolidayPrefixSuffix.setValue(''+element.includeAnnualHolidayPrefixSuffix),
      // this.LeaveCategoriesSetting.controls.includeWeeklyOffPrefixSuffix.setValue(''+element.includeWeeklyOffPrefixSuffix)

      console.log(this.LeaveCategoriesSetting);
  }
  openDeleteDialog(data) {
      console.log("data id==" + data);

      const dialogRef = this.dialog.open(DeleteLeaveCategories, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: { data: data }
      });
      dialogRef.afterClosed().subscribe(result => {
        // this.getAllAttendeceSettingData(); 
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
        console.log('The dialog was closed');
      });
  }
  //-
  ngOnInit() {


  }

  udateLeaveCategories() {


    var temp = true;
    // alert(this.LeaveCategoriesSetting.controls.leaveAccrualPeriod.value);

    if (this.LeaveCategoriesSetting.controls.typeOfLeave.value === 'General_Leave') {
      if (this.LeaveCategoriesSetting.controls.leaveAccrualPeriod.value === null) {
        temp = false;
      }
      this.LeaveCategoriesSetting.controls.daysBeforeDelivery.clearValidators();
      this.LeaveCategoriesSetting.controls.daysBeforeDelivery.updateValueAndValidity();
    } else{
      // this.LeaveCategoriesSetting.controls.leaveAccrualDate.clearValidators();
      // this.LeaveCategoriesSetting.controls.leaveAccrualDate.setValue(null);
      // this.LeaveCategoriesSetting.controls.leaveAccrualDate.updateValueAndValidity();
    }
    // if(this.LeaveCategoriesSetting.controls.typeOfLeave.value === 'Maternity_Leave'){
    //   this.LeaveCategoriesSetting.controls.includeWeeklyOff.setValue('true');
    //   this.LeaveCategoriesSetting.controls.includeAnnualHoliday.setValue('true')
    // }
    if ((temp) && (this.LeaveCategoriesSetting.valid) && (this.LeaveCategoriesSetting.controls.leaveAbbrv.value != "") && (this.LeaveCategoriesSetting.controls.typeOfLeave.value != "") && (this.LeaveCategoriesSetting.controls.leaveName.value != "") && (this.LeaveCategoriesSetting.valid)) {

      this.isValidFormSubmitted = true;

      // alert("if block");
      $('.divtoggleDiv')[1].style.display = 'block';
      if (this.LeaveCategoriesSetting.controls.typeOfLeave.value !== 'General_Leave') {
        this.LeaveCategoriesSetting.controls.leaveAccrualPeriod.setValue("Non_Accrual");
        this.LeaveCategoriesSetting.controls.carryOverLimitsPolicy.setValue("No_Carryover");
      }
      this.showbudatebutton = true;
      this.showsavebutton = false
      this.LeaveCategoriesSetting.value;

      this.serviceApi.put('/v1/leave/settings/leaveCategories/' + +this.LeaveCategoriesSetting.controls.categoryId.value, this.LeaveCategoriesSetting.value)

        .subscribe(
          res => {
            console.log('record save===' + res);
            this.successNotification(res.message);
            this.getAllLeaveSettingData();
            this.setPanel();
            this.isLeftVisible = !this.isLeftVisible
          },
          err => {
            console.log('there is something error');

          },
          () => {
            // this.isLeftVisible = !this.isLeftVisible;
            // $('.divtoggleDiv')[1].style.display = 'block';
            this.isLeftVisible = false;
          }
        );
    }
    else {


      // alert("else block" + this.isLeftVisible);
      Object.keys(this.LeaveCategoriesSetting.controls).forEach(field => { // {1}
        const control = this.LeaveCategoriesSetting.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
      this.isLeftVisible = true;
    }

    // console.log("ready to upadated data===" + JSON.stringify(this.LeaveCategoriesSetting.value));
  }

  applyValidation() {
    console.log(this.LeaveCategoriesSetting.controls.typeOfLeave.value);
    let type = this.LeaveCategoriesSetting.controls.typeOfLeave.value;
    this.formReset();
    this.LeaveCategoriesSetting.controls.typeOfLeave.setValue(type);
    this.LeaveCategoriesSetting.controls.leaveAccrualPeriod.clearValidators();
    // this.LeaveCategoriesSetting.controls.leaveAccrualDate.clearValidators();
    this.LeaveCategoriesSetting.controls.carryOverLimitsPolicy.clearValidators();
    this.LeaveCategoriesSetting.controls.daysBeforeDelivery.clearValidators();
    if (this.LeaveCategoriesSetting.controls.typeOfLeave.value === 'General_Leave') {
      this.LeaveCategoriesSetting.controls.leaveAccrualPeriod.setValue(null);
      this.LeaveCategoriesSetting.controls.leaveAccrualPeriod.setValidators([Validators.required]);
      this.LeaveCategoriesSetting.controls.carryOverLimitsPolicy.setValue(null);
      this.LeaveCategoriesSetting.controls.carryOverLimitsPolicy.setValidators([Validators.required]);
      // this.LeaveCategoriesSetting.controls.leaveAccrualDate.setValue(null);
      // this.LeaveCategoriesSetting.controls.leaveAccrualDate.setValidators([Validators.required])
    }
    if(this.LeaveCategoriesSetting.controls.typeOfLeave.value === 'Maternity_Leave'){
      this.LeaveCategoriesSetting.controls.daysBeforeDelivery.setValue(null);
      this.LeaveCategoriesSetting.controls.daysBeforeDelivery.setValidators([Validators.required]);
    }
    this.LeaveCategoriesSetting.controls.leaveAccrualPeriod.updateValueAndValidity();
    // this.LeaveCategoriesSetting.controls.leaveAccrualDate.updateValueAndValidity();
    this.LeaveCategoriesSetting.controls.carryOverLimitsPolicy.updateValueAndValidity();
    this.LeaveCategoriesSetting.controls.daysBeforeDelivery.updateValueAndValidity();
  }
  lapsValidation(){
    // this.LeaveCategoriesSetting.controls.lapsTimeDurations.clearValidators();
    this.LeaveCategoriesSetting.controls.lapsTimeDurations.setValue(0);
    // this.LeaveCategoriesSetting.controls.leaveLapsAmount.clearValidators();
    this.LeaveCategoriesSetting.controls.leaveLapsAmount.setValue(0);
    // if(this.LeaveCategoriesSetting.controls.lapsTimeForCompOffs.value =='true'||this.LeaveCategoriesSetting.controls.intraCycleLaps.value =='true'){
    //   // this.LeaveCategoriesSetting.controls.lapsTimeDurations.setValidators(Validators.required);
    //   // this.LeaveCategoriesSetting.controls.leaveLapsAmount.setValidators(Validators.required);
    // }
    // this.LeaveCategoriesSetting.controls.lapsTimeDurations.updateValueAndValidity();
    // this.LeaveCategoriesSetting.controls.leaveLapsAmount.updateValueAndValidity();
  }
  saveLeaveCategories() {
    this.checktypeOfLeave = true;
    this.checkleaveName = true;
    this.checkleaveAbbrv = true;
    this.checkleaveAccrualPeriod = true;
    // console.log(this.LeaveCategoriesSetting.controls.typeOfLeave.value)
    // if (this.LeaveCategoriesSetting.controls.typeOfLeave.value === null)
    //   this.checktypeOfLeave = true;

    // if (this.LeaveCategoriesSetting.controls.leaveName.value === null)
    //   this.checkleaveName = true;



    // if (this.LeaveCategoriesSetting.controls.leaveAbbrv.value === null)
    //   this.checkleaveAbbrv = true;

    // if (this.LeaveCategoriesSetting.controls.leaveAccrualPeriod.value === null)
    //   this.checkleaveAccrualPeriod = true;

    // if (this.LeaveCategoriesSetting.controls.submitLeaveBefore.value != null) {
    //   var temp = this.LeaveCategoriesSetting.controls.submitLeaveBefore.value;
    //   temp = temp + "";
    //   var i = temp.indexOf(".")
    //   if (i < 0)
    //     this.checksubmitLeaveBefore = true;

    // }
    // if (this.LeaveCategoriesSetting.controls.maxConsecutiveLeaveDays.value != null) {
    //   var temp = this.LeaveCategoriesSetting.controls.maxConsecutiveLeaveDays.value;
    //   temp = temp + "";
    //   var i = temp.indexOf(".")
    //   if (i < 0)
    //     this.checkmaxConsecutiveLeaveDays = true;
    //this.LeaveCategoriesSetting.valid && (this.checkleaveAccrualPeriod) && (!this.checkleaveAbbrv) && (!this.checkleaveName) &&
    // }
    var temp = true;
    // alert(this.LeaveCategoriesSetting.controls.leaveAccrualPeriod.value);

    if (this.LeaveCategoriesSetting.controls.typeOfLeave.value === 'General_Leave') {
      if (this.LeaveCategoriesSetting.controls.leaveAccrualPeriod.value === null) {
        temp = false;
      }
      this.LeaveCategoriesSetting.controls.daysBeforeDelivery.clearValidators();
      this.LeaveCategoriesSetting.controls.daysBeforeDelivery.updateValueAndValidity();
    }
    if(this.LeaveCategoriesSetting.controls.typeOfLeave.value !== 'General_Leave'){
     
        this.LeaveCategoriesSetting.controls.leaveAccrualPeriod.setValue("Non_Accrual");
        this.LeaveCategoriesSetting.controls.carryOverLimitsPolicy.setValue("No_Carryover");
     
    }
    if (this.LeaveCategoriesSetting.controls.typeOfLeave.value === 'Annual_Non_Accrual_Leave') {
      this.LeaveCategoriesSetting.controls.leaveAccrualPeriod.setValue("Non_Accrual");
      this.LeaveCategoriesSetting.controls.carryOverLimitsPolicy.setValue("No_Carryover");
    
      this.LeaveCategoriesSetting.value;
    }
    if(this.LeaveCategoriesSetting.controls.typeOfLeave.value === 'Maternity_Leave'){
      this.LeaveCategoriesSetting.controls.includeWeeklyOff.setValue('true');
      this.LeaveCategoriesSetting.controls.includeAnnualHoliday.setValue('true')
    }else{
      this.LeaveCategoriesSetting.controls.daysBeforeDelivery.clearValidators();
      this.LeaveCategoriesSetting.controls.daysBeforeDelivery.updateValueAndValidity();
    }
    // if(this.LeaveCategoriesSetting.controls.lapsTimeForCompOffs.value =="false" || this.LeaveCategoriesSetting.controls.intraCycleLaps.value =='false'){
      this.LeaveCategoriesSetting.controls.lapsTimeDurations.setValue(0);
      this.LeaveCategoriesSetting.controls.leaveLapsAmount.setValue(0);
    // }

    if ((temp) && (this.LeaveCategoriesSetting.valid) && (this.LeaveCategoriesSetting.controls.leaveAbbrv.value) && (this.LeaveCategoriesSetting.controls.typeOfLeave.value) && (this.LeaveCategoriesSetting.controls.leaveName.value)) {
      this.isValidFormSubmitted = true;
      
      console.log('Final Data---------------------- ' + JSON.stringify(this.LeaveCategoriesSetting.value));
      console.log(this.LeaveCategoriesSetting);
      const body = {
      }

      this.serviceApi.post('/v1/leave/settings/leaveCategories', this.LeaveCategoriesSetting.value)

        .subscribe(
          res => {
            console.log('record save===' + res);
            this.successNotification(res.message);
            this.getAllLeaveSettingData();
            this.setPanel();
          },
          err => {
            console.log('there is something error');
          },
          () => {
            this.isLeftVisible = !this.isLeftVisible;
            this.setPanel();
          }
        );
    }
    else {

      Object.keys(this.LeaveCategoriesSetting.controls).forEach(field => { // {1}
        const control = this.LeaveCategoriesSetting.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }
}

@Component({
  templateUrl: 'delete-leave-categories.html',
  styleUrls: ['./delete-leave-categories-diolog.scss']
})
export class DeleteLeaveCategories implements OnInit {

  public bankInformationForm: FormGroup;
  error = 'Error Message';
  action: any;
  constructor(
    public dialogRef: MatDialogRef<DeleteLeaveCategories>,
    @Inject(MAT_DIALOG_DATA) public data: any, private http: Http, private serviceApi: ApiCommonService, private _fb: FormBuilder) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onDelete() {
    // console.log(' >>>>> Request For Delete Record data ---->' + this.data.accountID);
    let id = this.data.data;
    this.serviceApi.delete('/v1/leave/settings/leaveCategories/' + id)

      .subscribe(
        res => {
          console.log('record save===' + res);
          this.action = 'Response';
          this.error = res.message;
          this.close();
          //  this.getAllGeneralSettingRecord();
        },
        err => {
          console.log('there is something error');
          this.action = 'Error';
          this.error = err.message;
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

export interface LeaveCategoriesSettingData {


  categoryId: Number,
  leaveName: String,
  typeOfLeave: string,

  leaveAbbrv: String;
  leaveAccrualPeriod: String
  advanceAccrueLeave: boolean
  carryOverLimitsPolicy: String
  negativeLeaveBalance: boolean
  fixedCutoffDay: boolean
  joinDayOfTheMonth: String
  resignDayOfTheMonth: String

  canEmpApplyForThisLeaveCat: boolean,
  halfDayOption: boolean,
  includeAnnualHoliday: boolean,
  includeWeeklyOff: boolean,
  includeWeeklyOffHalfdayRequest: boolean,
  leavePaid,
  submitLeaveBefore: any,
  maxConsecutiveLeaveDays: any,
  seperateLeaveByWeekOff: any,
  leaveSeperatedByHoliday: any,
  uploadDocument: any,
  dateRestriction: any,
  uploadingDocMandatory: any,
  dateDescription: any,
  lapsTimeDurations: any,
  leaveLapsAmount:any,

}
let LeaveCatagoriesSetting: LeaveCategoriesSettingData[] = [];

