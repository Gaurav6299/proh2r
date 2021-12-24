import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { Inject } from '@angular/core';
import { ViewChild } from '@angular/core';
import { DataTable } from 'primeng/components/datatable/datatable';
declare var $: any;
@Component({
  selector: 'app-fixed-contribution',
  templateUrl: './fixed-contribution.component.html',
  styleUrls: ['./fixed-contribution.component.scss']
})
export class FixedContributionComponent implements OnInit, AfterViewInit {
  lwfForm: FormGroup;
  ptForm: FormGroup;
  check1: boolean;
  columns = [
    { field: 'lableName', header: 'Label Name' },
    { field: 'action', header: 'Action' }
  ];
  lwfColumns = [
    { field: 'fromAmount', header: 'From' },
    { field: 'toAmount', header: 'To' },
    { field: 'employeePercentage', header: 'Employee Percentage/Limit' },
    { field: 'employeeAmount', header: 'Employee Amount/Limit' },
    { field: 'employerPercentage', header: 'Employer Percentage/Limit' },
    { field: 'employerAmount', header: 'Employer Amount/Limit' },
    { field: 'actions', header: 'Actions' }
  ];
  columns_2 = [
    { field: 'paymentMonth', header: 'Payment Month' },
    { field: 'processMonth', header: 'Process Month' }
  ];
  ptColumns = [
    { field: 'fromAmount', header: 'From' },
    { field: 'toAmount', header: 'To' },
    { field: 'employeePercentage', header: 'Employee Percentage' },
    { field: 'employeeAmount', header: 'Employee Amount' },
    { field: '12thMonthValue', header: '12th Month Value' },
    { field: '12thMonthAmount', header: '12th Month Amount' },
    { field: 'actions', header: 'Actions' }
  ];
  esicCellingColumn = [
    { field: 'defaultValue', header: 'Default Value' },
    { field: 'maxAmount', header: 'Max Amount' },
    { field: 'period', header: 'Period' },
    { field: 'type', header: 'Round Type' },
    { field: 'actions', header: 'Actions' }
  ];
  columnsESICContribution = [
    { field: 'fromAmount', header: 'From Amount' },
    { field: 'toAmount', header: 'To Amount' },
    { field: 'employeePercentage', header: 'Employee Percentage' },
    { field: 'employerPercentage', header: 'Employer Percentage' },
    { field: 'actions', header: 'Actions' }
  ];
  stateList = [];
  ptEligibleStateList = [];
  fixedCont = [];
  contributionRecord = [];
  paymentMonthRecord = [];
  lwfSlabRecord = [];
  ptSlabRecord = [];
  esicCelling = [];
  esiccontributionRecord = [];
  isLeftVisible: any;
  panelFirstWidth: any;
  panelFirstHeight: any;
  lwfState: Boolean = false;
  ptState: Boolean = false;
  esicState: Boolean = false;
  constructor(public dialog: MatDialog, private fb: FormBuilder, private serviceApi: ApiCommonService) {
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

  setPanel() {
    console.log(this.isLeftVisible);
    $('.divtoggleDiv')[1].style.display = 'none';
    $('.divtoggleDiv').width(this.panelFirstWidth);
  }
  editLeftPanel(event) {
    this.check1 = false;
    $('.divtoggleDiv')[1].style.display = 'block';
    this.isLeftVisible = true;
    if (event.lableName == 'LWF') {
      this.lwfState = true;
      this.getAllLWFStates();
    } else if (event.lableName == 'PT') {
      this.ptState = true;
      this.getAllPTStates();
    } else {
      this.esicState = true;
      this.getAllESICCellingAmount();
      this.getAllESICContribution();
    }
  }

  onLWFStateChange(event: any) {
    console.log(event);
    let selectedState = this.stateList.find(state => state.value === event.value);
    this.getLWFSlab(selectedState.lwfId);
  }

  getAllLWFStates() {
    this.stateList = [];
    this.serviceApi.get('/v1/payroll-settings/lwf-states').subscribe(res => {
      res.forEach(element => {
        this.stateList.push({ value: element.stateId, label: element.stateName, lwfId: element.lwfId });
      });
    }, (err) => {

    }, () => {
      console.log(this.stateList);
      if (this.stateList.length > 0) {
        this.lwfForm.controls.stateId.setValue(this.stateList[0].value);
        this.lwfForm.controls.lwfId.setValue(this.stateList[0].lwfId);
      }
      this.getLWFSlab(this.lwfForm.controls.lwfId.value);
    });
  }


  addLWFSlab() {
    const dialogRef = this.dialog.open(AddUpdateLWFSlabComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { lwfId: this.lwfForm.controls.lwfId.value, update: false }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.successNotification(result.message);
        this.getLWFSlab(this.lwfForm.controls.lwfId.value);
      }
    });
  }

  editLWFSlab(event: any) {
    const dialogRef = this.dialog.open(AddUpdateLWFSlabComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { lwfId: this.lwfForm.controls.lwfId.value, update: true, event: event }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.successNotification(result.message);
        this.getLWFSlab(this.lwfForm.controls.lwfId.value);
      }
    });
  }

  deleteLWFSlab(event: any) {
    console.log(event);
    const dialogRef = this.dialog.open(DeleteLWFSlabComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { lwfSlabId: event.lwfSlabId }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.successNotification(result.message);
        this.getLWFSlab(this.lwfForm.controls.lwfId.value);
      }
    });
  }

  updateLWF() {
    if (this.lwfForm.valid) {
      this.serviceApi.put("/v1/payroll-settings/lwf/" + this.lwfForm.controls.lwfId.value, this.lwfForm.value).subscribe(res => {
        this.successNotification(res.message);
        this.getLWFSlab(this.lwfForm.controls.lwfId.value);
      }, (err) => {

      }, () => {

      });
    } else {
      Object.keys(this.lwfForm.controls).forEach(field => { // {1}
        const control = this.lwfForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }

  getLWFSlab(lwfId: any) {
    this.lwfSlabRecord = [];
    this.serviceApi.get("/v1/payroll-settings/lwf/" + lwfId).subscribe(res => {
      this.lwfForm.reset();
      this.lwfSlabRecord = res.lwfSlabList;
      this.lwfForm.controls.january.setValue(res.january != null ? '' + res.january : null);
      this.lwfForm.controls.february.setValue(res.february != null ? '' + res.february : null);
      this.lwfForm.controls.march.setValue(res.march != null ? '' + res.march : null);
      this.lwfForm.controls.april.setValue(res.april != null ? '' + res.april : null);
      this.lwfForm.controls.may.setValue(res.may != null ? '' + res.may : null);
      this.lwfForm.controls.june.setValue(res.june != null ? '' + res.june : null);
      this.lwfForm.controls.july.setValue(res.july != null ? '' + res.july : null);
      this.lwfForm.controls.august.setValue(res.august != null ? '' + res.august : null);
      this.lwfForm.controls.september.setValue(res.september != null ? '' + res.september : null);
      this.lwfForm.controls.october.setValue(res.october != null ? '' + res.october : null);
      this.lwfForm.controls.november.setValue(res.november != null ? '' + res.november : null);
      this.lwfForm.controls.december.setValue(res.december != null ? '' + res.december : null);
      this.lwfForm.controls.lwfId.setValue(res.lwfId);
      this.lwfForm.controls.stateId.setValue(res.stateId);

    }, (err) => {

    }, () => {


    })
  }
  cancelPanel() {
    this.isLeftVisible = false;
    this.lwfState = false;
    this.ptState = false;
    this.esicState = false;
    this.setPanel();
  }
  ngOnInit() {
    this.fixedCont = [
      { id: '1', lableName: 'LWF', action: '', },
      { id: '2', lableName: 'PT', action: '' },
      { id: '3', lableName: 'ESIC', action: '' }
    ];
    this.contributionRecord = [];
    this.esicCelling = [];
    this.esiccontributionRecord = [];
    this.paymentMonthRecord = [
      { value: 'NA', label: 'N/A' },
      { value: 'JANUARY', label: 'January' },
      { value: 'FEBRUARY', label: 'February' },
      { value: 'MARCH', label: 'March' },
      { value: 'APRIL', label: 'April' },
      { value: 'MAY', label: 'May' },
      { value: 'JUNE', label: 'June' },
      { value: 'JULY', label: 'July' },
      { value: 'AUGUST', label: 'August' },
      { value: 'SEPTEMBER', label: 'September' },
      { value: 'OCTOBER', label: 'October' },
      { value: 'NOVEMBER', label: 'November' },
      { value: 'DECEMBER', label: 'December' }
    ];

    this.lwfForm = this.fb.group({
      january: ['', Validators.required],
      february: ['', Validators.required],
      march: ['', Validators.required],
      april: ['', Validators.required],
      may: ['', Validators.required],
      june: ['', Validators.required],
      july: ['', Validators.required],
      august: ['', Validators.required],
      september: ['', Validators.required],
      october: ['', Validators.required],
      november: ['', Validators.required],
      december: ['', Validators.required],
      lwfId: [],
      stateId: ['', Validators.required],
    })
    this.ptForm = this.fb.group({
      ptId: [''],
      stateId: ['', Validators.required],
      january: ['', Validators.required],
      february: ['', Validators.required],
      march: ['', Validators.required],
      april: ['', Validators.required],
      may: ['', Validators.required],
      june: ['', Validators.required],
      july: ['', Validators.required],
      august: ['', Validators.required],
      september: ['', Validators.required],
      october: ['', Validators.required],
      november: ['', Validators.required],
      december: ['', Validators.required],
    })
  }

  getAllPTStates() {
    this.stateList = [];
    this.ptEligibleStateList = [];
    this.serviceApi.get('/v1/payroll-settings/pt-states').subscribe(res => {
      res.forEach(element => {
        this.stateList.push({ value: element.stateId, label: element.stateName, ptId: element.ptId, isEligible: element.isEligible });
        if (element.isEligible) {
          this.ptEligibleStateList.push({ value: element.stateId, label: element.stateName, ptId: element.ptId, isEligible: element.isEligible });
        }
      });
    }, (err) => {

    }, () => {
      console.log(this.ptEligibleStateList);
      if (this.ptEligibleStateList.length > 0) {
        this.ptForm.controls.stateId.setValue(this.ptEligibleStateList[0].value);
        this.ptForm.controls.ptId.setValue(this.ptEligibleStateList[0].ptId);
        this.getPT(this.ptForm.controls.ptId.value);
      }
    });
  }

  onChange(event: any, state: any) {
    console.log(event);
    console.log(state);
    if (event.checked) {
      this.stateList.forEach((element, index) => {
        if (element.ptId === state.ptId)
          this.stateList[index].isEligible = true
      });
    }
    if (!event.checked) {
      this.stateList.forEach((element, index) => {
        if (element.ptId === state.ptId)
          this.stateList[index].isEligible = false
      });
    }
  }

  ngAfterViewInit(): void {
    if ($('.divtoggleDiv').length > 0) {
      this.panelFirstWidth = $('.divtoggleDiv')[0].offsetWidth;
      console.log('panelDive[0] width -->' + $('.divtoggleDiv')[0].offsetWidth);
      this.panelFirstHeight = $('.paneDiv')[0].offsetHeight;
      console.log('panelDive[0] height -->' + $('.divtoggleDiv')[0].offsetHeight);
      $('.divtoggleDiv')[1].style.display = 'none';
    }
  }

  updatePTEligibility() {
    console.log(this.stateList);
    this.serviceApi.put('/v1/payroll-settings/pt-eligibility', this.stateList).subscribe(res => {
      this.successNotification(res.message);
      this.getAllPTStates();
    }, (err) => {

    }, () => {

    })
  }

  addPTSlab() {
    const dialogRef = this.dialog.open(AddUpdatePTSlabComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: {
        ptId: this.ptForm.controls.ptId.value, update: false
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.successNotification(result.message);
        this.getPT(this.ptForm.controls.ptId.value);
      }
    });
  }

  configurePTState() {
    const dialogRef = this.dialog.open(ConfigurePTStateComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: {
        "stateList": this.stateList
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.successNotification(result.message);
        this.getAllPTStates();
      }
    });
  }

  onPTStateChange(event: any) {
    console.log(event);
    let selectedState = this.stateList.find(state => state.value === event.value);
    this.getPT(selectedState.ptId);
  }

  getPT(ptid: any) {
    this.ptSlabRecord = [];
    this.serviceApi.get("/v1/payroll-settings/pt/" + ptid).subscribe(res => {
      this.ptForm.reset();
      this.ptSlabRecord = res.ptSlabList;
      this.ptForm.controls.january.setValue(res.january != null ? '' + res.january : null);
      this.ptForm.controls.february.setValue(res.february != null ? '' + res.february : null);
      this.ptForm.controls.march.setValue(res.march != null ? '' + res.march : null);
      this.ptForm.controls.april.setValue(res.april != null ? '' + res.april : null);
      this.ptForm.controls.may.setValue(res.may != null ? '' + res.may : null);
      this.ptForm.controls.june.setValue(res.june != null ? '' + res.june : null);
      this.ptForm.controls.july.setValue(res.july != null ? '' + res.july : null);
      this.ptForm.controls.august.setValue(res.august != null ? '' + res.august : null);
      this.ptForm.controls.september.setValue(res.september != null ? '' + res.september : null);
      this.ptForm.controls.october.setValue(res.october != null ? '' + res.october : null);
      this.ptForm.controls.november.setValue(res.november != null ? '' + res.november : null);
      this.ptForm.controls.december.setValue(res.december != null ? '' + res.december : null);
      this.ptForm.controls.ptId.setValue(res.ptId);
      this.ptForm.controls.stateId.setValue(res.stateId);
    }, (err) => {

    }, () => {

    })

  }

  updatePT() {
    if (this.ptForm.valid) {
      this.serviceApi.put("/v1/payroll-settings/pt/" + this.ptForm.controls.ptId.value, this.ptForm.value).subscribe(res => {
        this.successNotification(res.message);
      }, (err) => {

      }, () => {

      });
    } else {
      Object.keys(this.ptForm.controls).forEach(field => { // {1}
        const control = this.ptForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }

  }

  updatePTSlab(event: any) {
    console.log(event);
    const dialogRef = this.dialog.open(AddUpdatePTSlabComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: {
        ptId: this.ptForm.controls.ptId.value, update: true, event: event
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.successNotification(result.message);
        this.getPT(this.ptForm.controls.ptId.value);
      }
    });

  }

  deletePTSlab(event: any) {
    console.log(event);
    const dialogRef = this.dialog.open(DeletePTSlabComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { ptSlabId: event.ptSlabId }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.successNotification(result.message);
        this.getPT(this.ptForm.controls.ptId.value);
      }
    });
  }




  addESICCellingAmount() {
    const dialogRef = this.dialog.open(AddESICCellingAmountComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { update: false }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.successNotification(result.message);
        this.getAllESICCellingAmount();
      }
    });
  }

  updateESICCelling(event: any) {
    const dialogRef = this.dialog.open(AddESICCellingAmountComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { update: true, event: event }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.successNotification(result.message);
        this.getAllESICCellingAmount();
      }
    });
  }

  deleteESICCelling(event: any) {
    console.log(event);
    const dialogRef = this.dialog.open(DeleteESICCellingComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { esicCellingAmountId: event.esicCellingAmountId }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.successNotification(result.message);
        this.getAllESICCellingAmount();
      }
    });
  }


  getAllESICCellingAmount() {
    this.esicCelling = [];
    this.serviceApi.get("/v1/payroll-settings/esic-celling-amount").subscribe(res => {
      res.forEach(element => {
        this.esicCelling.push(
          {
            "esicCellingAmountId": element.esicCellingAmountId,
            "defaultValue": element.defaultValue,
            "maxAmount": element.maxAmount,
            "isCurrent": element.isCurrent,
            "period": "Monthly",
            "type": "Round Up"
          }
        )
      });
    }, (err) => {

    }, () => {

    })
  }

  getAllESICContribution() {
    this.esiccontributionRecord = [];
    this.serviceApi.get("/v1/payroll-settings/esic-contribution").subscribe(res => {
      this.esiccontributionRecord = res;
    }, (err) => {

    }, () => {

    });
  }
  addESICContribution() {
    const dialogRef = this.dialog.open(AddESICContributionComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { update: false }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.successNotification(result.message);
        this.getAllESICContribution();
      }
    });
  }

  updateESICContribution(event: any) {
    const dialogRef = this.dialog.open(AddESICContributionComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { update: true, event: event }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.successNotification(result.message);
        this.getAllESICContribution();
      }
    });
  }

  deleteESICContribution(event: any) {
    console.log(event);
    const dialogRef = this.dialog.open(DeleteESICContributionComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { esiccontributionId: event.esiccontributionId }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.successNotification(result.message);
        this.getAllESICContribution();
      }
    });
  }
}

@Component({
  selector: 'app-add-upate-lwf',
  templateUrl: './add-upate-lwf-contribution.component.html',
  styleUrls: ['./fixed-contribution.component.scss']
})
export class AddUpdateLWFSlabComponent implements OnInit {
  title: any;
  message: any;
  action: any;
  error: any;
  lWFSlabForm: FormGroup;
  ngOnInit() {

  }

  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<AddUpdateLWFSlabComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    console.log(data);
    this.lWFSlabForm = this._fb.group({
      "employeeAmount": ['', Validators.required],
      "employeePercentage": ['', Validators.required],
      "employerAmount": ['', Validators.required],
      "employerPercentage": ['', Validators.required],
      "fromAmount": ['', Validators.required],
      "lwfSlabId": [''],
      "toAmount": ['', Validators.required]
    })
    if (this.data.update) {
      this.title = "Update LWF Slab";
      this.lWFSlabForm.patchValue(this.data.event);
    } else {
      this.title = "Add LWF Slab";
    }
  }

  saveLWFSlab() {
    if (this.lWFSlabForm.valid) {
      const body = {
        "employeeAmount": this.lWFSlabForm.controls.employeeAmount.value,
        "employeePercentage": this.lWFSlabForm.controls.employeePercentage.value,
        "employerAmount": this.lWFSlabForm.controls.employerAmount.value,
        "employerPercentage": this.lWFSlabForm.controls.employerPercentage.value,
        "fromAmount": this.lWFSlabForm.controls.fromAmount.value,
        "lwfSlabId": this.lWFSlabForm.controls.lwfSlabId.value,
        "toAmount": this.lWFSlabForm.controls.toAmount.value,
      }
      this.serviceApi.post("/v1/payroll-settings/lwf-slab/" + this.data.lwfId, body).subscribe(res => {
        this.action = 'Response';
        this.message = res.message;
        this.close();
      }, (err) => {
        this.action = 'Error';
        this.error = err.message;
        this.close();
      }, () => {

      });
    } else {
      Object.keys(this.lWFSlabForm.controls).forEach(field => { // {1}
        const control = this.lWFSlabForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }

  updateLWFSlab() {
    if (this.lWFSlabForm.valid) {
      const body = {
        "employeeAmount": this.lWFSlabForm.controls.employeeAmount.value,
        "employeePercentage": this.lWFSlabForm.controls.employeePercentage.value,
        "employerAmount": this.lWFSlabForm.controls.employerAmount.value,
        "employerPercentage": this.lWFSlabForm.controls.employerPercentage.value,
        "fromAmount": this.lWFSlabForm.controls.fromAmount.value,
        "lwfSlabId": this.lWFSlabForm.controls.lwfSlabId.value,
        "toAmount": this.lWFSlabForm.controls.toAmount.value,
      }
      this.serviceApi.put("/v1/payroll-settings/lwf-slab/" + this.lWFSlabForm.controls.lwfSlabId.value, body).subscribe(res => {
        this.action = 'Response';
        this.message = res.message;
        this.close();
      }, (err) => {
        this.action = 'Error';
        this.error = err.message;
        this.close();
      }, () => {

      });
    } else {
      Object.keys(this.lWFSlabForm.controls).forEach(field => { // {1}
        const control = this.lWFSlabForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }

  close(): void {
    this.data.message = this.message;
    this.dialogRef.close(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }



}




@Component({
  selector: 'delete-lwf',
  templateUrl: './delete-lwf-slab.component.html',
  styleUrls: ['./fixed-contribution.component.scss']
})
export class DeleteLWFSlabComponent implements OnInit {
  action: any;
  error: any;

  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<DeleteLWFSlabComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    console.log(data);
  }

  ngOnInit() {
  }

  onDelete() {
    this.serviceApi.delete('/v1/payroll-settings/lwf-slab/' + +this.data.lwfSlabId).subscribe(
      res => {
        this.action = 'Response';
        this.error = res.message;
        this.close();
      }, err => {

        this.action = 'Error';
        this.error = err.message;
        this.close();

      }
    );

  }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}


@Component({
  selector: 'app-add-upate-pt',
  templateUrl: './add-update-pt-contribution.component.html',
  styleUrls: ['./fixed-contribution.component.scss']
})
export class AddUpdatePTSlabComponent implements OnInit {
  title: any;
  message: any;
  action: any;
  error: any;
  ptSlabForm: FormGroup;
  ngOnInit() {

  }

  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<AddUpdatePTSlabComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    console.log(data);
    this.ptSlabForm = this._fb.group({
      "employeeAmount": ['', Validators.required],
      "employeePercentage": ['', Validators.required],
      "_12thMonthAmount": ['', Validators.required],
      "_12thMonthValue": ['', Validators.required],
      "fromAmount": ['', Validators.required],
      "ptSlabId": [''],
      "toAmount": ['', Validators.required]
    })
    if (this.data.update) {
      this.title = "Update PT Slab";
      this.ptSlabForm.patchValue(this.data.event);
      this.ptSlabForm.controls._12thMonthAmount.setValue(this.data.event['12thMonthAmount']);
      this.ptSlabForm.controls._12thMonthValue.setValue(this.data.event['12thMonthValue']);
    } else {
      this.title = "Add PT Slab";
    }
  }

  savePTSlab() {
    if (this.ptSlabForm.valid) {
      const body = {
        "_12thMonthAmount": this.ptSlabForm.controls._12thMonthAmount.value,
        "_12thMonthValue": this.ptSlabForm.controls._12thMonthValue.value,
        "employeeAmount": this.ptSlabForm.controls.employeeAmount.value,
        "employeePercentage": this.ptSlabForm.controls.employeePercentage.value,
        "fromAmount": this.ptSlabForm.controls.fromAmount.value,
        "ptSlabId": this.ptSlabForm.controls.ptSlabId.value,
        "toAmount": this.ptSlabForm.controls.toAmount.value,
      }
      this.serviceApi.post("/v1/payroll-settings/pt-slab/" + this.data.ptId, body).subscribe(res => {
        this.action = 'Response';
        this.message = res.message;
        this.close();
      }, (err) => {
        this.action = 'Error';
        this.error = err.message;
        this.close();
      }, () => {

      });
    } else {
      Object.keys(this.ptSlabForm.controls).forEach(field => { // {1}
        const control = this.ptSlabForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }

  updatePTSlab() {
    if (this.ptSlabForm.valid) {
      const body = {
        "_12thMonthAmount": this.ptSlabForm.controls._12thMonthAmount.value,
        "_12thMonthValue": this.ptSlabForm.controls._12thMonthValue.value,
        "employeeAmount": this.ptSlabForm.controls.employeeAmount.value,
        "employeePercentage": this.ptSlabForm.controls.employeePercentage.value,
        "fromAmount": this.ptSlabForm.controls.fromAmount.value,
        "ptSlabId": this.ptSlabForm.controls.ptSlabId.value,
        "toAmount": this.ptSlabForm.controls.toAmount.value,
      }
      this.serviceApi.put("/v1/payroll-settings/pt-slab/" + this.ptSlabForm.controls.ptSlabId.value, body).subscribe(res => {
        this.action = 'Response';
        this.message = res.message;
        this.close();
      }, (err) => {
        this.action = 'Error';
        this.error = err.message;
        this.close();
      }, () => {

      });
    } else {
      Object.keys(this.ptSlabForm.controls).forEach(field => { // {1}
        const control = this.ptSlabForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }

  close(): void {
    this.data.message = this.message;
    this.dialogRef.close(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}


@Component({
  selector: 'app-pt-state',
  templateUrl: './configure-pt-state.component.html',
  styleUrls: ['./fixed-contribution.component.scss']
})
export class ConfigurePTStateComponent implements OnInit {
  title: any;
  message: any;
  action: any;
  error: any;
  @ViewChild("dt1") dt: DataTable;

  ptStateColumns = [
    { field: 'label', header: 'State Name' },
    { field: 'actions', header: 'Actions' }
  ]
  stateList = [];
  ngOnInit() {
    this.getAllPTStates();
  }

  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<ConfigurePTStateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService, public dialog: MatDialog) {
    this.title = "State List";
    this.stateList = this.data.stateList;
  }

  close(): void {
    this.data.message = this.message;
    this.dialogRef.close(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addPTState() {
    const dialogRef = this.dialog.open(AddUpdatePTStateComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { update: false }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.getAllPTStates();
      }
    });
  }

  getAllPTStates() {
    this.stateList = [];
    this.serviceApi.get('/v1/payroll-settings/get-all/pt-states').subscribe(res => {
      res.forEach(element => {
        this.stateList.push({
          value: element.ptStateId, label: element.stateName, frequency: element.frequency
        });
      });
    }, (err) => {

    }, () => {
      this.dt.reset();
    });
  }

  updatePTState(state: any) {
    const dialogRef = this.dialog.open(AddUpdatePTStateComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { update: true, state: state }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.getAllPTStates();
      }
    });
  }

  deletePTState(state: any) {
    const dialogRef = this.dialog.open(DeletePTStateComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { state: state }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.getAllPTStates();
      }
    });
  }
}


@Component({
  selector: 'app-add-updated-pt-state',
  templateUrl: './add-update-pt-state.component.html',
  styleUrls: ['./fixed-contribution.component.scss']
})
export class AddUpdatePTStateComponent implements OnInit {
  title: any;
  message: any;
  action: any;
  error: any;
  ptStateForm: FormGroup;
  frequency = [
    { value: 'MONTHLY', viewValue: 'Monthly' },
    { value: 'HALF_YEARLY', viewValue: 'Half Yearly' },
    { value: 'YEARLY', viewValue: 'Yearly' }
  ];
  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<AddUpdatePTStateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService, public dialog: MatDialog) {
    console.log(this.data);
    this.ptStateForm = this._fb.group({
      "ptStateId": [''],
      "stateName": ['', Validators.required],
      "frequency": [null, Validators.required],
    });
    if (this.data.update) {
      this.title = "Update State";
      this.ptStateForm.controls.ptStateId.setValue(this.data.state.value);
      this.ptStateForm.controls.stateName.setValue(this.data.state.label);
      this.ptStateForm.controls.frequency.setValue(this.data.state.frequency);
    } else {
      this.title = "Add State";
    }

  }

  ngOnInit() {

  }

  savePTState() {
    if (this.ptStateForm.valid) {
      this.serviceApi.post("/v1/payroll-settings/pt-states", this.ptStateForm.value).subscribe(res => {
        this.action = 'Response';
        this.message = res.message;
        this.close();
      }, (err) => {
        this.action = 'Error';
        this.error = err.message;
        this.close();
      }, () => {

      });
    } else {
      Object.keys(this.ptStateForm.controls).forEach(field => { // {1}
        const control = this.ptStateForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }

  updatePTState() {
    if (this.ptStateForm.valid) {
      this.serviceApi.put("/v1/payroll-settings/pt-states", this.ptStateForm.value).subscribe(res => {
        this.action = 'Response';
        this.message = res.message;
        this.close();
      }, (err) => {
        this.action = 'Error';
        this.error = err.message;
        this.close();
      }, () => {

      });
    } else {
      Object.keys(this.ptStateForm.controls).forEach(field => { // {1}
        const control = this.ptStateForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }



  close(): void {
    this.data.message = this.message;
    this.dialogRef.close(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-delete-pt-state',
  templateUrl: './delete-pt-state.component.html',
  styleUrls: ['./fixed-contribution.component.scss']
})
export class DeletePTStateComponent implements OnInit {
  message: any;
  action: any;
  error: any;
  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<DeletePTStateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService, public dialog: MatDialog) {
    console.log(this.data);
  }

  ngOnInit() {

  }

  onDelete() {
    this.serviceApi.delete("/v1/payroll-settings/pt-states/" + this.data.state.value).subscribe(res => {
      this.action = 'Response';
      this.message = res.message;
      this.close();
    }, (err) => {
      this.action = 'Error';
      this.error = err.message;
      this.close();
    }, () => {

    });
  }

  close(): void {
    this.data.message = this.message;
    this.dialogRef.close(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}


@Component({
  selector: 'delete-pt',
  templateUrl: './delete-pt-slab.component.html',
  styleUrls: ['./fixed-contribution.component.scss']
})
export class DeletePTSlabComponent implements OnInit {
  action: any;
  error: any;

  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<DeletePTSlabComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    console.log(data);
  }

  ngOnInit() {
  }

  onDelete() {
    this.serviceApi.delete('/v1/payroll-settings/pt-slab/' + +this.data.ptSlabId).subscribe(
      res => {
        this.action = 'Response';
        this.error = res.message;
        this.close();
      }, err => {

        this.action = 'Error';
        this.error = err.message;
        this.close();

      }
    );

  }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}



@Component({
  selector: 'esic-celling-amount',
  templateUrl: './esic-celling-amount.component.html',
  styleUrls: ['./fixed-contribution.component.scss']
})
export class AddESICCellingAmountComponent implements OnInit {
  action: any;
  error: any;
  title: any;
  esicCellingForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<AddESICCellingAmountComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    console.log(data);
    this.esicCellingForm = this._fb.group({
      "defaultValue": ['', Validators.required],
      "esicCellingAmountId": [''],
      "maxAmount": ['', Validators.required],
    })
    if (this.data.update) {
      this.title = "Update ESIC Celling Amount";
      this.esicCellingForm.patchValue(this.data.event);
    } else {
      this.title = "Add ESIC Celling Amount";
    }

  }

  ngOnInit() {
  }

  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveESICCellingAmount() {
    if (this.esicCellingForm.valid) {
      this.serviceApi.post("/v1/payroll-settings/esic-celling-amount", this.esicCellingForm.value).subscribe(
        res => {
          this.action = 'Response';
          this.error = res.message;
          this.close();
        }, err => {

          this.action = 'Error';
          this.error = err.message;
          this.close();

        }, () => {

        });
    } else {
      Object.keys(this.esicCellingForm.controls).forEach(field => { // {1}
        const control = this.esicCellingForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }

  updateESICCellingAmount() {
    if (this.esicCellingForm.valid) {
      this.serviceApi.put("/v1/payroll-settings/esic-celling-amount/" + this.esicCellingForm.controls.esicCellingAmountId.value, this.esicCellingForm.value).subscribe(
        res => {
          this.action = 'Response';
          this.error = res.message;
          this.close();
        }, err => {

          this.action = 'Error';
          this.error = err.message;
          this.close();

        }, () => {

        });
    } else {
      Object.keys(this.esicCellingForm.controls).forEach(field => { // {1}
        const control = this.esicCellingForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }
}


@Component({
  selector: 'delete-esic-celling',
  templateUrl: './delete-esic-celling.component.html',
  styleUrls: ['./fixed-contribution.component.scss']
})
export class DeleteESICCellingComponent implements OnInit {
  action: any;
  error: any;

  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<DeletePTSlabComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    console.log(data);
  }

  ngOnInit() {
  }

  onDelete() {
    this.serviceApi.delete('/v1/payroll-settings/esic-celling-amount/' + +this.data.esicCellingAmountId).subscribe(
      res => {
        this.action = 'Response';
        this.error = res.message;
        this.close();
      }, err => {

        this.action = 'Error';
        this.error = err.message;
        this.close();

      }
    );

  }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}



@Component({
  selector: 'esic-contribution',
  templateUrl: './esic-contribution.component.html',
  styleUrls: ['./fixed-contribution.component.scss']
})
export class AddESICContributionComponent implements OnInit {

  action: any;
  error: any;
  esicContributionForm: FormGroup;
  title: any;

  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<AddESICContributionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    console.log(data);
    this.esicContributionForm = this._fb.group({
      "employeePercentage": ['', Validators.required],
      "employerPercentage": ['', Validators.required],
      "esiccontributionId": [''],
      "fromAmount": ['', Validators.required],
      "toAmount": ['', Validators.required],
    });
    if (this.data.update) {
      this.title = "Update ESIC Contribution";
      this.esicContributionForm.patchValue(this.data.event);
    } else {
      this.title = "Add ESIC Contribution";
    }
  }

  ngOnInit() {
  }

  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveESICContribution() {
    if (this.esicContributionForm.valid) {
      this.serviceApi.post("/v1/payroll-settings/esic-contribution", this.esicContributionForm.value).subscribe(
        res => {
          this.action = 'Response';
          this.error = res.message;
          this.close();
        }, err => {
          this.action = 'Error';
          this.error = err.message;
          this.close();

        }, () => {

        });
    }
    else {
      Object.keys(this.esicContributionForm.controls).forEach(field => { // {1}
        const control = this.esicContributionForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }

  updateESICContribution() {
    if (this.esicContributionForm.valid) {
      this.serviceApi.put("/v1/payroll-settings/esic-contribution/" + this.esicContributionForm.controls.esiccontributionId.value, this.esicContributionForm.value).subscribe(
        res => {
          this.action = 'Response';
          this.error = res.message;
          this.close();
        }, err => {
          this.action = 'Error';
          this.error = err.message;
          this.close();

        }, () => {

        });
    }
    else {
      Object.keys(this.esicContributionForm.controls).forEach(field => { // {1}
        const control = this.esicContributionForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }
}



@Component({
  selector: 'delete-esic-contribution',
  templateUrl: './delete-esic-contribution.html',
  styleUrls: ['./fixed-contribution.component.scss']
})
export class DeleteESICContributionComponent implements OnInit {
  action: any;
  error: any;

  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<DeleteESICContributionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    console.log(data);
  }

  ngOnInit() {
  }

  onDelete() {
    this.serviceApi.delete('/v1/payroll-settings/esic-contribution/' + +this.data.esiccontributionId).subscribe(
      res => {
        this.action = 'Response';
        this.error = res.message;
        this.close();
      }, err => {

        this.action = 'Error';
        this.error = err.message;
        this.close();

      }
    );

  }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}