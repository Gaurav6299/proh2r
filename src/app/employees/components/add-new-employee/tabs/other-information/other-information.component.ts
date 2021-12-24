import { ChangeDetectionStrategy, Component, OnInit, Output, EventEmitter, Input, ViewChild, Inject } from '@angular/core';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { Http } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { environment } from '../../../../../../environments/environment';
import { AddEmployeeService } from '../../../../services/add-employee/add-employee.service';
declare var $: any;
@Component({
  selector: 'app-other-information',
  templateUrl: './other-information.component.html',
  styleUrls: ['./other-information.component.scss']
})
export class OtherInformationComponent implements OnInit, AfterViewInit {
  expenseBillEffectiveDate: any;
  operationShift: any;
  shiftEffectiveDate: any;
  basicInfoForm: FormGroup

  @Input() currentTab: string;
  @Output() currentTabEvent = new EventEmitter<string>();
  public data: any;
  name: any
  assignedLeaveData = [];
  assignedShiftData = [];
  employeeLeaveData = [];
  leaveTemplateName: any;
  leavePrimaryApprover: any
  leaveAssignmentArray = [];
  attendanceAssignmentArray = [];



  // tslint:disable-next-line:max-line-length

  displayedColumns = ['templateName', 'primaryApprover', 'secondaryApprover', 'actions'];
  dataSource: MatTableDataSource<EmployeeLeaveAssignmentData>;

  displayedColumns1 = ['shiftAssign', 'shiftEffectiveDate', 'shiftAssignmentId'];
  dataSource1: MatTableDataSource<EmployeeShiftAssignmentData>;

  displayedColumns2 = ['attendenceTemplate', 'supervisorsAttendenceTemplate', 'attendenceEffectiveFrom', 'attendenceAssignmentId'];
  dataSource2: MatTableDataSource<EmployeeAttendenceAssignmentData>;

  displayedColumns3 = ['expensePolicy', 'supervisorsExpensesAssignment', 'expenseAssignmentId'];
  dataSource3: MatTableDataSource<EmployeeExpenseAssignmentData>;

  displayedColumns4 = ['supervisorsFlexiBenefit', 'flexiBenefitAssignmentId'];
  dataSource4: MatTableDataSource<EmployeeFlexiBenefitAssignmentData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public dialog: MatDialog, private http: Http, private fb: FormBuilder, private serviceApi: ApiCommonService, private addEmployeeService: AddEmployeeService) {
    //this.getAllLeaveAssignmentList();
    // this.getAllShiftAssignmentList();
    // this.getAllLeaveTableData();

  }

  ngAfterViewInit() {

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

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  getAllLeaveTableData() {
    this.leaveAssignmentArray = [];
    let empCode: string;
    this.addEmployeeService.currentEmpCode.subscribe(message => empCode = message);
    this.serviceApi.get('/v1/leave/settings/leaveAssignments/' + empCode)
      .subscribe(
      res => {
        console.log('res...............' + res.templateName + ' ' + res.primaryApprover + ' ' + res.secondaryApprover);
        this.leaveAssignmentArray.push({
          templateId: res.templateId,
          templateName: res.templateName,
          primaryApprover: res.primaryApprover,
          secondaryApprover: res.secondaryApprover,
        })
        console.log('...............Stringify' + JSON.stringify(this.leaveAssignmentArray))
      },
      err => {
        console.log('leaveAssignmentArrya length --->' + this.leaveAssignmentArray.length);
        this.dataSource = new MatTableDataSource<EmployeeLeaveAssignmentData>(this.leaveAssignmentArray);

      },
      () => {
        console.log('leaveAssignmentArrya length --->' + this.leaveAssignmentArray.length);
        this.dataSource = new MatTableDataSource<EmployeeLeaveAssignmentData>(this.leaveAssignmentArray);
      }
      )
  }


  getAllAttendanceTableData() {
    this.attendanceAssignmentArray = [];
    let empCode: string;
    this.addEmployeeService.currentEmpCode.subscribe(message => empCode = message);
    this.serviceApi.get('/v1/attendance/settings/templateAssignments/' + empCode)
      .subscribe(
      res => {
        this.attendanceAssignmentArray.push({
          attdTemplateId: res.attdTemplateId,
          attendenceTemplate: res.currentAttendanceTemplate,
          supervisorsAttendenceTemplate: res.supervisor,
          attendenceEffectiveFrom: res.effectiveFrom
        })
      },
      err => {
        this.dataSource2 = new MatTableDataSource<EmployeeAttendenceAssignmentData>(this.attendanceAssignmentArray);

      },
      () => {
        this.dataSource2 = new MatTableDataSource<EmployeeAttendenceAssignmentData>(this.attendanceAssignmentArray);
      }
      )
  }


  openAddLeaveTemplateDialog(): void {
    console.log('Inside Dialog Method');
    const dialogRef = this.dialog.open(EmployeeLeaveAssignment,
      {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: {
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      this.getAllLeaveTableData();
      console.log('the dialog was closed');
    });
  }

  deleteTemplateAssignmentDialog(element: any, type: any): void {
    console.log('Inside Dialog Method');
    const dialogRef = this.dialog.open(DeleteTemplateAssignment,
      {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: {
          element: element,
          type: type
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      this.getAllLeaveTableData();
      this.getAllAttendanceTableData();
      console.log('the dialog was closed');
    });
  }
  // Employee Shift Assignment Dialog Method

  employeeShiftDialog() {
    console.log('Inside ShiftDialog Method');
    const dialogRef = this.dialog.open(EmployeeShiftAssignment,
      {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: {
          opertionShift: this.operationShift,
          shiftEffectiveDate: this.shiftEffectiveDate
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('the dialog was closed');
    });
  }
  // Attendence Assignment Dialog Method

  openAttendenceAssignment() {

    console.log('Inside ShiftDialog Method');
    const dialogRef = this.dialog.open(EmployeeAttendenceAssignment,
      {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: {}
      });
    dialogRef.afterClosed().subscribe(result => {
      this.getAllAttendanceTableData();
      console.log('the dialog was closed');
    });

  }
  // Employee Expense Assignment Dialog Method

  employeeExpenseDialog() {
    console.log('Inside ExpenseDialog Method');
    const dialogRef = this.dialog.open(EmployeeExpenseAssignment, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { expenseBillEffectiveDate: this.expenseBillEffectiveDate }
    });
  }
  ngOnInit() {
    // this.dataSource2 = new MatTableDataSource<EmployeeAttendenceAssignmentData>(attendenceSomeData)
    // this.dataSource3 = new MatTableDataSource<EmployeeExpenseAssignmentData>(expenseSomeData)
    // this.dataSource4 = new MatTableDataSource<EmployeeFlexiBenefitAssignmentData>(flexiBenefitSomeData)

  }

  // getAllLeaveAssignmentList() {
  //   console.log('<------------------ Role Informations 11---------------------->');
  //   this.http.get('assets/data/otherInformation/leaveAssignment.json').
  //     subscribe(
  //     res => {
  //       console.log('<------------------ Role Informations ---------------------->');
  //       res.forEach(element => {
  //         this.assignedLeaveData.push(
  //           {
  //             leavePolicy: element.leavePolicy,
  //             generalLeavePrimaryApprover: element.generalLeavePrimaryApprover,
  //           });
  //       });
  //       this.dataSource = new MatTableDataSource(this.assignedLeaveData);
  //     },
  //     () => {
  //       console.log('Enter into Else Bloack');

  //     }
  //     );
  // }
  getAllShiftAssignmentList() {
    console.log('<------------------ Role Informations 11---------------------->');
    this.http.get('assets/data/otherInformation/shiftAssignment.json').map(res => res.json()).
      subscribe(
      res => {
        console.log('<------------------ Role Informations ---------------------->');
        res.forEach(element => {
          this.assignedShiftData.push(
            {
              shiftAssign: element.shiftAssign,
              shiftEffectiveDate: element.shiftEffectiveDate,
            });
        });
        this.dataSource1 = new MatTableDataSource(this.assignedShiftData);
      },
      () => {
        console.log('Enter into Else Bloack');
      }
      );
  }


  finishOnboarding() {
    this.currentTabEvent.emit('1');
  }
}
//  Interface for table
export interface EmployeeLeaveAssignmentData {
  templateName: string;
  primaryApprover: string;
  secondaryApprover: string
  actions: string;
}

export interface EmployeeShiftAssignmentData {
  shiftAssign: string;
  shiftEffectiveDate: string;
  shiftAssignmentId: string;
}
const shiftSomeData: EmployeeShiftAssignmentData[] = [];

export interface EmployeeAttendenceAssignmentData {
  attendenceTemplate: string;
  supervisorsAttendenceTemplate: string;
  attendenceEffectiveFrom: string;
  attendenceAssignmentId: string;
}

const attendenceSomeData: EmployeeAttendenceAssignmentData[] = [
  {
    attendenceTemplate: ' ',
    supervisorsAttendenceTemplate: ' ',
    attendenceEffectiveFrom: ' ',
    attendenceAssignmentId: ' '
  }
]
export interface EmployeeExpenseAssignmentData {
  expensePolicy: string;
  supervisorsExpensesAssignment: string;
  expenseAssignmentId: string;
}
const expenseSomeData: EmployeeExpenseAssignmentData[] = [
  {
    expensePolicy: ' ',
    supervisorsExpensesAssignment: ' ',
    expenseAssignmentId: ' ',
  }
]

export interface EmployeeFlexiBenefitAssignmentData {
  supervisorsFlexiBenefit: string;
  flexiBenefitAssignmentId: string;
}
const flexiBenefitSomeData: EmployeeFlexiBenefitAssignmentData[] = [
  {
    supervisorsFlexiBenefit: ' ',
    flexiBenefitAssignmentId: ' ',

  }
]
//  Leave Assignment Component
@Component({
  templateUrl: './leaveAssignmentDialog.component.html',
  styleUrls: ['./leaveAssignmentDialog.component.scss']
})

export class EmployeeLeaveAssignment implements OnInit {

  // leavePolicy=[ ];
  i = 0;
  openPrimaryDiv: any;
  openSecondaryDiv: any;
  generalLeavePrimaryApprover: any;
  TemplateList = [];
  approverList = [];
  approverList1 = [];
  approverList2 = [];
  approverListCopy = []
  myControl = new FormControl();
  myControl1 = new FormControl();
  myControl2 = new FormControl();
  public leaveTemplateAssignment: FormGroup;
  public basicInfoForm: FormGroup;
  baseUrl = environment.baseUrl;
  type: any;


  constructor(

    public dialogRef: MatDialogRef<EmployeeLeaveAssignment>,
    @Inject(MAT_DIALOG_DATA) public data: any, private http: Http, private _fb: FormBuilder, private serviceApi: ApiCommonService, private addEmployeeService: AddEmployeeService) {
    this.leaveTemplateAssignment = this._fb.group({
      leaveTemplateId: [],
      leaveApprovalLevel: [],
      leaveApprovalType: [],
      leaveTemplateName: [null, [Validators.required]],
      leavePrimaryApprover: [null, [Validators.required]],
      leaveSecondaryApprover: [null, [Validators.required]]
    });
    this.getAllTemplateList();
    this.getSupervisorList();
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

  searchEmployeeNameForPrimarysupervisor(data: any) {
    if (this.myControl1.value != null) {
      this.approverList1 = this.approverListCopy.filter(option =>
        option.viewValue.toLowerCase().indexOf(this.myControl1.value.toLowerCase()) !== -1);
      console.log('Enter in the backSpace' + this.myControl);

    }
  }

  searchEmployeeNameForSecondarysupervisor(data: any) {
    if (this.myControl2.value != null) {
      this.approverList2 = this.approverListCopy.filter(option =>
        option.viewValue.toLowerCase().indexOf(this.myControl2.value.toLowerCase()) !== -1);
      console.log('Enter in the backSpace' + this.myControl);

    }
  }
  searchEmployeeName(data: any) {
    if (this.myControl.value != null) {
      this.approverList = this.approverListCopy.filter(option =>
        option.viewValue.toLowerCase().indexOf(this.myControl.value.toLowerCase()) !== -1);
      console.log('Enter in the backSpace' + this.myControl);

    }
  }
  clearMyControl() {

    this.myControl.reset();

    this.approverList = this.approverListCopy;

  }

  clearPrimaryMyControl() {

    this.myControl1.reset();

    this.approverList1 = this.approverListCopy;

  }

  clearSecondaryMyControl() {
    this.myControl2.reset();
    this.approverList2 = this.approverListCopy;
  }

  getAllTemplateList() {
    this.serviceApi.get('/v1/leave/settings/leaveTemplate')
      .subscribe(
      res =>
        res.forEach(element => {
          console.log('element.....' + element);
          this.TemplateList.push(
            {
              leaveTemplateId: element.leaveTemplateId,
              leaveTemplateName: element.leaveTemplateName,
              leaveApprovalLevel: element.leaveApprovalLevel,
              leaveApprovalType: element.leaveApprovalType,
              leavePrimaryApprover: element.leavePrimaryApprover,
              leaveSecondaryApprover: element.leaveSecondaryApprover
            })

        })
      )
  }
  getSupervisorList() {
    this.serviceApi.get('/v1/employee/').subscribe
      (
      res => res.forEach(element => {
        console.log('element.......' + element.empFirstName)
        this.approverList.push({ value: element.empCode, viewValue: element.empFirstName + ' ' + element.empLastName + '-' + element.empCode });
      })
      )
    this.approverListCopy = this.approverList;
    this.approverList1 = this.approverList;
    this.approverList2 = this.approverList;
  }

  selectValue(data: any) {
    this.openSecondaryDiv = false;
    this.openPrimaryDiv = false;
    this.type = 'EMPLOYEEWISE';

    this.leaveTemplateAssignment.controls.leavePrimaryApprover.setValue('')
    this.leaveTemplateAssignment.controls.leaveSecondaryApprover.setValue('')

    for (var i = 0; i < this.TemplateList.length; i++) {
      console.log(' .........' + this.TemplateList[i].leaveTemplateName)
      if (this.TemplateList[i].leaveTemplateName == data.value) {
        if (this.TemplateList[i].leaveApprovalLevel === 'FIRST_LEVEL' && this.TemplateList[i].leaveApprovalType === "TEMPLATEWISE") {
          console.log('leave primary Approevr:::' + this.TemplateList[i].leavePrimaryApprover)
          console.log('leave primary Approevr:::' + this.leaveTemplateAssignment.controls.leavePrimaryApprover.value)

          this.leaveTemplateAssignment.get('leavePrimaryApprover').setValidators([Validators.required]);

          this.leaveTemplateAssignment.get('leaveSecondaryApprover').clearValidators();
          this.leaveTemplateAssignment.get('leaveSecondaryApprover').updateValueAndValidity();
          this.type = 'TEMPLATEWISE';

          this.openPrimaryDiv = true;
          this.leaveTemplateAssignment.controls.leavePrimaryApprover.setValue(this.TemplateList[i].leavePrimaryApprover)
          this.leaveTemplateAssignment.controls.leaveSecondaryApprover.setValue(this.TemplateList[i].leaveSecondaryApprover)
        }
        else if (this.TemplateList[i].leaveApprovalLevel === 'FIRST_LEVEL' && this.TemplateList[i].leaveApprovalType === 'EMPLOYEEWISE') {

          this.openPrimaryDiv = true;
          this.leaveTemplateAssignment.get('leavePrimaryApprover').setValidators([Validators.required]);

          this.leaveTemplateAssignment.get('leaveSecondaryApprover').clearValidators();
          this.leaveTemplateAssignment.get('leaveSecondaryApprover').updateValueAndValidity();
        }
        else if (this.TemplateList[i].leaveApprovalLevel === 'SECOND_LEVEL' && this.TemplateList[i].leaveApprovalType === 'TEMPLATEWISE') {
          this.openSecondaryDiv = true;
          this.openPrimaryDiv = false;
          this.type = 'TEMPLATEWISE';
          this.leaveTemplateAssignment.controls.leavePrimaryApprover.setValue(this.TemplateList[i].leavePrimaryApprover)
          this.leaveTemplateAssignment.controls.leaveSecondaryApprover.setValue(this.TemplateList[i].leaveSecondaryApprover)

        }
        else if (this.TemplateList[i].leaveApprovalLevel === 'SECOND_LEVEL' && this.TemplateList[i].leaveApprovalType === 'EMPLOYEEWISE') {
          this.openSecondaryDiv = true;
          this.openPrimaryDiv = false;
          this.leaveTemplateAssignment.get('leavePrimaryApprover').setValidators([Validators.required]);

          this.leaveTemplateAssignment.get('leaveSecondaryApprover').setValidators([Validators.required]);
        }
      }
    }
    console.log(this.openPrimaryDiv + "---" + this.openSecondaryDiv);
  }
  saveLeaveAssignmentData() {
    let empCode: string;
    this.addEmployeeService.currentEmpCode.subscribe(message => empCode = message);
    console.log('Leave assign data:' + JSON.stringify(this.leaveTemplateAssignment.value));
    console.log(' .........' + this.leaveTemplateAssignment.controls.leaveTemplateName.value + ' ' +
      this.leaveTemplateAssignment.controls.leavePrimaryApprover.value + ' ' + '' + this.leaveTemplateAssignment.controls.leaveSecondaryApprover.value)
    if (this.leaveTemplateAssignment.valid && this.leaveTemplateAssignment.controls.leaveTemplateName.value != null) {
      var body = {
        "empCodeList": [
          empCode
        ],
        "employeeName": "",
        "primaryApprover": this.leaveTemplateAssignment.controls.leavePrimaryApprover.value,
        "secondaryApprover": this.leaveTemplateAssignment.controls.leaveSecondaryApprover.value,
        "templateName": this.leaveTemplateAssignment.controls.leaveTemplateName.value
      }
      console.log("body of data===" + JSON.stringify(body));
      this.onNoClick();
      return this.serviceApi.post('/v1/leave/settings/leaveAssignments/', body)
        .subscribe(
        res => {
          console.log('data saved successfully');
          this.successNotification(res.message);

        },
        err => {
          console.log('there is something wrong');
          // this.warningNotification(err.message);
        }, () => {
          // this.onNoClick();
        }
        );


    }
    else {
      Object.keys(this.leaveTemplateAssignment.controls).forEach(field => { // {1}
        const control = this.leaveTemplateAssignment.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }
  ngOnInit() {

  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
// Employee Shift Assignmnet Dialog

@Component({
  templateUrl: './EmployeeShiftAssignmentDialog.component.html',
  styleUrls: ['./EmployeeShiftAssignmentDialog.component.scss']
})
export class EmployeeShiftAssignment implements OnInit {
  minDate = new Date(2000, 0, 1);
  maxDate = new Date(2020, 0, 1);
  Shifts = [
    { value: 'DayShift', viewValue: 'DAY Shift' },
    { value: 'GraveYardShift', viewValue: 'GraveYard Shift' },
    { value: 'OperationShift', viewValue: 'Operation Shift' }
  ]
  public shiftTemplateAssignment: FormGroup
  constructor(public dialogRef: MatDialogRef<EmployeeLeaveAssignment>, @Inject(MAT_DIALOG_DATA) public data: any, private _fb: FormBuilder) {
    this.shiftTemplateAssignment = this._fb.group({
      shiftAssign: [data.shiftAssign],
      shiftEffectiveDate: [data.shiftEffectiveDate],
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {

  }
}
// Employee Attendence Assignmnet Dialog

@Component({
  templateUrl: './EmployeeAttendenceAssignmentDialog.component.html',
  styleUrls: ['./EmployeeAttedencetAssignmentDialog.component.scss']
})
export class EmployeeAttendenceAssignment implements OnInit {

  addTemplateList = [];
  addApproverList = [];
  templateWise: Boolean;
  public attendenceTemplateAssignment: FormGroup;
  constructor(public dialogRef: MatDialogRef<EmployeeLeaveAssignment>, @Inject(MAT_DIALOG_DATA) public data: any, private _fb: FormBuilder,
    private serviceApi: ApiCommonService, private addEmployeeService: AddEmployeeService) {
    this.templateWise = false;
    this.attendenceTemplateAssignment = this._fb.group(
      {
        attendenceTemplate: [null, Validators.required],
        templateApprover: [null, Validators.required],
        effectiveDate: [null, Validators.required],
        biometricCode: [],
        biometricDeviceId: [],
      });
    this.getAllAttendanceTemplate();
    this.getAllEmployeeList();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  assignSuperviser(event: any) {
    this.templateWise = false;
    this.attendenceTemplateAssignment.controls.templateApprover.reset();
    var templateName = event.value;
    for (var i = 0; i < this.addTemplateList.length; i++) {
      if (this.addTemplateList[i].viewValue === templateName) {
        if (this.addTemplateList[i].ruleType === 'TEMPLATEWISE') {
          this.templateWise = true;
          this.attendenceTemplateAssignment.controls.templateApprover.setValue(this.addTemplateList[i].templateApprover);
        }


      }
    }


  }
  getAllAttendanceTemplate() {
    this.addTemplateList = [];
    this.serviceApi.get('/v1/attendance/settings/templates/').subscribe(
      res => {
        if (res != null) {
          res.forEach(element => {
            this.addTemplateList.push({
              value: element.attdTemplateId,
              viewValue: element.templateName,
              ruleType: element.attendanceApprovalType,
              templateApprover: element.templateApprover
            });
          });
        } else {
          console.log('Data Does not Exists');
        }
      });
  }
  getAllEmployeeList() {
    this.serviceApi.get('/v1/employee/').subscribe(
      res => {
        if (res != null) {
          res.forEach(element => {
            this.addApproverList.push({
              value: element.empCode,
              viewValue: element.empFirstName + ' ' + element.empLastName
            });
          });
        } else {
          console.log('Data Does not Exists');
        }
      });
  }


  ngOnInit() {

  }
  saveAttdTemplateAssingleUser() {
    let empCode: string;
    this.addEmployeeService.currentEmpCode.subscribe(message => empCode = message);
    console.log(JSON.stringify(this.attendenceTemplateAssignment.value));
    if (this.attendenceTemplateAssignment.valid) {
      const body = {
        'bioMetricCode': this.attendenceTemplateAssignment.controls.biometricCode.value,
        'bioMetricDeviceId': null,
        'currentAttendanceTemplate': this.attendenceTemplateAssignment.controls.attendenceTemplate.value,
        'effectiveFrom': this.attendenceTemplateAssignment.controls.effectiveDate.value,
        'empCodeList': [empCode],
        'employeeName': '',
        'supervisor': this.attendenceTemplateAssignment.controls.templateApprover.value
      };
      console.log('>>>>> Save Form >>>>> ' + JSON.stringify(body));
      this.serviceApi.post('/v1/attendance/settings/templateAssignments/', body).subscribe(
        res => {
          if (res != null) {
            // this.action = 'Response';
            // this.error = res.message;
            // this.close();
            console.log('Record Successfully saved');
          } else {
            console.log('Record Not Saved');
          }
        }, err => {
          // this.action = 'Error';
          // this.error = err.message;
          // this.close();
          console.log('Record Successfully saved');
        });
      this.onNoClick();
    }
    else {
      Object.keys(this.attendenceTemplateAssignment.controls).forEach(field => { // {1}
        const control = this.attendenceTemplateAssignment.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }

  }
}
@Component({
  templateUrl: './EmployeeExpenseAssignmentDialog.component.html',
  styleUrls: ['./EmployeeExpenseAssignmentDialog.component.scss']
})
export class EmployeeExpenseAssignment implements OnInit {
  public expenseTemplateAssignment: FormGroup;
  conveyance: any;
  bill: any;
  expenseTemplate = [
    { value: 'Conveyance', viewValue: 'Conveyance' },
    { value: 'Bill', viewValue: 'Bill' }
  ];
  expenseApprover = [
    { value: 'GeneralManager', viewValue: 'General Manager' },
    { value: 'Manager', viewValue: 'Manager' }
  ];
  constructor(
    public dialogRef: MatDialogRef<EmployeeLeaveAssignment>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _fb: FormBuilder) {
    this.expenseTemplateAssignment = this._fb.group({
      expenseTemplate: [data.expenseTemplate],
      expenseconveyancePrimaryApprover: [data.expenseconveyancePrimaryApprover],
      expenseEffectiveDate: [data.expenseEffectiveDate],
      expensebillPrimaryApprover: [data.expensebillPrimaryApprover],
      expenseBillEffectiveDate: [data.expenseBillEffectiveDate],
    });
  }
  selectExpense(value) {
    console.log('............' + value);
    if (value == 'Conveyance') {
      this.conveyance = true;
      this.bill = false;
    }
    else if (value == 'Bill') {
      this.bill = true;
      this.conveyance = false;
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {

  }

}

@Component({
  templateUrl: './delete-template-Dialog.component.html',
  styleUrls: ['./EmployeeExpenseAssignmentDialog.component.scss']
})
export class DeleteTemplateAssignment {

  action: string;
  error: any;
  element: any;
  type: any;
  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<DeleteTemplateAssignment>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    this.element = this.data.element;
    this.type = this.data.type;
    console.log(this.data);
  }

  deleteTempData(type: any) {
    if (type === 'leave')
      this.deleteRow(this.element.templateId);
    else
      this.deleteAttendanceTemplate(this.element.attdTemplateId);
      
  }

  ngOnInit() {

  }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    this.dialogRef.close(this.data);
  }


  deleteRow(id: any) {

    return this.serviceApi.delete('/v1/leave/settings/leaveAssignments/' + id).map
      (res => res.json())
      .subscribe(
      res => {
        console.log('leave data delete successfully');
        this.close();
      },
      err => {
        console.log('there is something error');
        this.close();
      },
      () => {

      }
      );
  }
  deleteAttendanceTemplate(id: any) {

    return this.serviceApi.delete('/v1/attendance/settings/templateAssignments/' + id).map
      (res => res.json())
      .subscribe(
      res => {
        console.log('leave data delete successfully');
        this.close();
      },
      err => {
        console.log('there is something error');
        this.close();
        // this.getAllAttendanceTableData();
      },
      () => {
        // this.getAllAttendanceTableData();
      }
      );
  }

}

