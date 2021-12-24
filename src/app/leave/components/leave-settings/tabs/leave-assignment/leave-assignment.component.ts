import { Component, OnInit, Inject, Input, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { SelectionModel } from '@angular/cdk/collections';
import { Http } from '@angular/http';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { environment } from '../../../../../../environments/environment';
import { KeycloakService } from '../../../../../keycloak/keycloak.service';

import { ValidationMessagesService } from '../../..../../../../../validation-messages.service';
import { DataTable, SelectItem } from 'primeng/primeng';
declare var $: any;
@Component({
  selector: 'app-leave-assignment',
  templateUrl: './leave-assignment.component.html',
  styleUrls: ['./leave-assignment.component.scss']
})
export class LeaveAssignmentComponent implements OnInit {
  baseUrl = environment.baseUrl;
  displayedColumns = [
    { field: 'employeeName', header: 'Employee Name' },
    { field: 'location', header: 'Location' },
    { field: 'band', header: 'Band' },
    { field: 'department', header: 'Department' },
    { field: 'designation', header: 'Designation' },
    { field: 'templateName', header: 'Current Leave Policy' },
    { field: 'primaryApprover', header: 'Primary Supervisors' },
    { field: 'secondaryApprover', header: 'Secondary Supervisors' },
    { field: 'action', header: 'Actions' }
  ];
  dataSource1: MatTableDataSource<Element>;
  selection = new SelectionModel<Element>(true, []);
  assignLeaveData = [];
  checkedRowData = [];
  tempCheckedRowData = [];
  Templates = [];
  allLocation = [];
  allDepartment = [];
  allDesignation = [];
  allBand = [];
  filterByEmp: SelectItem[] = [];
  employeeLeaveAssignment: FormGroup;
  @ViewChild("dt1") dt: DataTable;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  notificationMsg: any;
  action: any;
  requiredDropdownButton;


  constructor(public dialog: MatDialog, private fb: FormBuilder, private http: Http, private serviceApi: ApiCommonService, private validationMessagesService: ValidationMessagesService) {
    this.getLeaveAssignment();
    var rolesArr = KeycloakService.getUserRole();
    this.validationMessagesService.currentRequiredDropdownButton.subscribe(message => this.requiredDropdownButton = message);


  }

  ngOnInit() {
    this.employeeLeaveAssignment = this.fb.group({
      assignLeaveTemplate: [],
      leavePolicy: [],
      supervisorsName: [],
      worklocation: [],
      selectedMonth: [],
      employeeStatus: [],
      costCenter: [],
      searchFilter: []
    })
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
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    console.log('numSelected...' + numSelected);
    const numRows = this.dataSource1.data.length;
    console.log('numrows...' + numRows);
    return numSelected === numRows;
  }

  masterToggle(element: any, event: any) {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource1.data.forEach(row => this.selection.select(row));
    console.log('dataSource1');
    this.getRowMultipleData(this.dataSource1.data, event)

  }
  getRowMultipleData(element: any, event: any) {
    this.checkedRowData = [];
    for (var i = 0; i < element.length; i++) {
      console.log('element....' + element[i].employeeName);
      const empCode = element[i].employeeName.split("-");
      console.log('empCode...... ' + empCode[1]);
      if (event.checked) {
        this.checkedRowData.push(
          empCode[1]
        )
        console.log('..........' + JSON.stringify(this.checkedRowData))
        console.log('........length' + this.checkedRowData.length);
      }
      else {
        console.log('else block');
        this.checkedRowData.splice(i, this.checkedRowData.length);
        console.log('Match Found');
      }
    }
  }
  getRowData(element: any, event: any) {
    console.log('event ' + event.checked)

    console.log('element........' + element.employeeName);
    console.log('element........' + element.templateName);
    const empCode = element.employeeName.split("-");
    console.log('element........' + empCode[1]);

    if (event.checked) {
      this.checkedRowData.push(
        empCode[1]
      )
      console.log(JSON.stringify(this.checkedRowData));
    }
    else {
      console.log('ENter in the Else Block');
      // this.tempCheckedRowData = this.checkedRowData;
      for (var i = 0; i < this.checkedRowData.length; i++) {
        if (this.checkedRowData[i] === empCode[1]) {
          this.checkedRowData.splice(i, 1);
          console.log('Match Found');
        } else {
          console.log('Not Matched');
        }
      }
    }
  }

  applyFilter(filterValue: string) {
    console.log('hello' + filterValue);
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    console.log(this.dataSource1);
    this.dataSource1.filter = filterValue;

    // alert(filterValue);
  }
  selectedValue(value: any) {
    if (value === "assignLeaveTemplate") {
      console.log('true');
      console.log("value...." + value);
      if (this.checkedRowData.length == 0) {
        this.warningNotification("First Select Employees");

      }
      else {

        this.openDialogAssignLeaveTemplate();
      }
    }
    else if (value === 'assignSupervisors') {
      console.log('true');
      console.log("value...." + value);
      if (this.checkedRowData.length == 0) {
        this.warningNotification("First Select Employees");

      }
      else {
        var flag: boolean = true;
        // this.getLeaveAssignment();
        console.log(this.checkedRowData);
        for (var i = 0; i < this.checkedRowData.length; i++) {
          console.log(this.checkedRowData[i].templateId);
          if (this.checkedRowData[i].templateId === null) {
            this.warningNotification("First assign template");
            // alert(flag);
            flag = false;
            break;
          }
        }
        if (flag === true)
          this.openDialogSupervisorTemplate();
      }
    }
    else if (value === 'uploadTemplateAssignmnet') {
      console.log('true');
      console.log("value...." + value);
      this.openDialogUploadTemplateAssignmnet();
    }
    else if (value === 'uploadApprovers') {
      console.log('true');
      console.log("value...." + value);
      this.openDialogUploadSupervisor();
    }
  }
  openDialogAssignLeaveTemplate() {
    this.notificationMsg = '';
    this.action = '';
    console.log('Inside Dialog leave');
    let empCodeList = []
    this.checkedRowData.forEach(element => {
      const empCode = element.employeeName.split("-");
      empCodeList.push(
        empCode[1]
      )
    })

    const dialogRef = this.dialog.open(AssignLeaveTemplate, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { checkedRowData: empCodeList, message: this.notificationMsg, status: this.action }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.selection.clear();
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          this.checkedRowData = [];
          console.log('Result value ..... ' + result.message);
          if (result.status === 'Response') {
            this.notificationMsg = result.message;
            this.successNotification(this.notificationMsg);

            this.getLeaveAssignment();
          }
          // tslint:disable-next-line:one-line
          else if (result.status === 'Error') {
            this.notificationMsg = result.message;
          }
        }
        // tslint:disable-next-line:one-line
      }
      this.employeeLeaveAssignment.controls.assignLeaveTemplate.setValue('');
      console.log('The dialog was closed');
    });


  }
  openDialogSupervisorTemplate() {
    this.notificationMsg = '';
    this.action = '';
    console.log('Inside Dialog leaveSupervisor');
    let empCodeList = []
    this.checkedRowData.forEach(element => {
      const empCode = element.employeeName.split("-");
      empCodeList.push(
        empCode[1]
      )
    })
    const dialogRef = this.dialog.open(AssignLeaveSupervisor, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { checkedRowData: empCodeList, message: this.notificationMsg, status: this.action }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          this.checkedRowData = [];
          console.log('Result value ..... ' + result.message);
          if (result.status === 'Response') {
            this.notificationMsg = result.message;
            this.successNotification(this.notificationMsg);

            this.getLeaveAssignment();
          }
          // tslint:disable-next-line:one-line
          else if (result.status === 'Error') {
            this.notificationMsg = result.message;
          }
        }
      }
      console.log('The dialog was closed');

    }
    );
  }

  openDialogUploadTemplateAssignmnet() {
    console.log('Inside upload Template Assignment');
    const dialogRef = this.dialog.open(UploadTemplateAssignment, {
      // width: '500px',
      panelClass: 'custom-dialog-container',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  openDialogUploadSupervisor() {
    console.log('Inside upload Supervisor');
    const dialogRef = this.dialog.open(UploadSupervisor, {
      // width: '500px',
      panelClass: 'custom-dialog-container',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
    this.getLeaveAssignment()
  }

  openDialogToBulkUploadTemplateAssigment() {
    const dialogRef = this.dialog.open(BulkUploadTemplateAssignment, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { event: event }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          console.log('Result value ..... ' + result.message);
          if (result.status === 'Response') {
            this.notificationMsg = result.message;
            this.successNotification(this.notificationMsg);
            this.getLeaveAssignment();
          }
          else if (result.status === 'Error') {
            this.notificationMsg = result.message;
          }
        }
      }
    });
  }

  addLeaveTemplateAssignment(value: any) {
      //alert(value.employeeName);
      console.log('Inside upload Supervisor');
      const dialogRef = this.dialog.open(AddLeaveTemplateAssignment, {
        // width: '500px',
        panelClass: 'custom-dialog-container',
        data: {
          employeeName: value.employeeName, addLeaveTemplate: value.addLeaveTemplate, primaryApprover: value.primaryApprover,
          secondaryApprover: value.secondaryApprover
        }

      });
      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            console.log('Result value ..... ' + result.message);
            if (result.status === 'Response') {
              this.notificationMsg = result.message;
              this.successNotification(this.notificationMsg);

              this.getLeaveAssignment();
            }
            // tslint:disable-next-line:one-line
            else if (result.status === 'Error') {
              this.notificationMsg = result.message;
            }
          }
        }
        console.log('The dialog was closed');
      });
  }
  editLeaveAssignmentFunction(data: any) {
      console.log('Inside edit Template' + JSON.stringify(data));
      console.log(data);
      const dialogRef = this.dialog.open(EditLeaveTemplateAssignment, {
        // width: '500px',
        panelClass: 'custom-dialog-container',
        data: {
          employeeName: data.employeeName,
          templateId: data.templateId,
          editLeaveTemplate: data.templateName,
          editLeavePrimaryApprover: data.primaryApprover,
          templateType: data.templateType,
          editLeaveSecondaryApprover: data.secondaryApprover,
          assignmentId: data.assignmentId,
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            console.log('Result value ..... ' + result.message);
            if (result.status === 'Response') {
              this.notificationMsg = result.message;
              this.successNotification(this.notificationMsg);

              this.getLeaveAssignment()
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
  leaveDelete(data: any) {
      console.log('Inside Delete Dialog' + data.assignmentId);
      const dialogRef = this.dialog.open(LeaveDelete, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: { assignmentId: data.assignmentId }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            console.log('Result value ..... ' + result.message);
            if (result.status === 'Response') {
              this.notificationMsg = result.message;
              this.successNotification(this.notificationMsg);

              this.getLeaveAssignment();
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
  addLeaveHistory(data: any) {
    console.log('Inside upload Supervisor' + JSON.stringify(data));
    const dialogRef = this.dialog.open(AddLeaveHistory, {
      width: '600px',
      data: { currentLeavePolicy: data.currentLeavePolicy, leaveSupervisors: data.leaveSupervisors }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  getLeaveAssignment() {

    // this.checkedRowData = [];
    this.allBand = [];
    this.allDepartment = [];
    this.allDesignation = [];
    this.allLocation = [];
    this.assignLeaveData = [];
    console.log('Leave Assign Template');
    this.serviceApi.get2('/v1/leave/settings/leaveAssignments/').subscribe
      (
        res => {

          console.log('........' + JSON.stringify(res));
          res.forEach(element => {
            if (!this.filterByEmp.some(employeeName => employeeName.label === element.employeeName)) {
              this.filterByEmp.push({
                label: element.employeeName, value: element.employeeName
              });
            }
            if (!this.allBand.some(band => band.label === element.band)) {
              this.allBand.push({
                label: element.band, value: element.band
              });
            }
            if (!this.allDepartment.some(department => department.label === element.department)) {
              this.allDepartment.push({
                label: element.department, value: element.department
              });
            }
            if (!this.allDesignation.some(designation => designation.label === element.designation)) {
              this.allDesignation.push({
                label: element.designation, value: element.designation
              });
            }
            if (!this.allLocation.some(location => location.label === element.location)) {
              this.allLocation.push({
                label: element.location, value: element.location
              });
            }
            console.log('element.employeeName===')
            console.log(element)
            console.log('element.employeeName===' + element.templateId)
            this.assignLeaveData.push({
              assignmentId: element.templateAssignmentId,
              employeeName: element.employeeName,
              templateName: element.template != null ? element.template.leaveTemplateName : null,
              primaryApprover: element.primaryApprover,
              secondaryApprover: element.secondaryApprover,
              templateType: element.templateType,
              templateId: element.template != null ? element.template.leaveTemplateId : null,
              actions: element.actions,
              location: element.location,
              band: element.band,
              department: element.department,
              designation: element.designation


            });
            console.log('...leave assign' + element.employeeName);
            console.log('...leave assign' + element.secondaryApprover);
          });

          this.dataSource1 = new MatTableDataSource(this.assignLeaveData)
          this.dataSource1.paginator = this.paginator;
          this.dataSource1.sort = this.sort;

          // this.assignLeaveData = [];
          // this.checkedRowData = [];
          this.selection.clear();
        },
        error => {

        }, () => {
          this.dt.reset();
          console.log(this.assignLeaveData);
        }
      );
  }
}
@Component({
  templateUrl: './AssignLeaveTemplate.component.html',
  styleUrls: ['./AssignLeaveTemplate.component.scss']
})
export class AssignLeaveTemplate implements OnInit {
  public leaveTemplateAssignment: FormGroup;
  Templates = [];
  approverList = [];
  approverListCopy = [];
  checkedRowData = [];
  baseUrl = environment.baseUrl;
  error = 'Error Message';
  action: any;
  requiredDropdownButton;
  constructor(public dialogRef: MatDialogRef<AssignLeaveTemplate>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder, private serviceApi: ApiCommonService, private validationMessagesService: ValidationMessagesService) {

    this.checkedRowData = data.checkedRowData
    console.log('.......data' + this.checkedRowData);
    this.leaveTemplateAssignment = this._fb.group(
      {
        addLeaveTemplate: [null, Validators.required],
        primaryApprover: [],
        secondaryApprover: []
      }
    )
    this.getTemplateList();
    this.getSupervisorList();
    this.validationMessagesService.currentRequiredDropdownButton.subscribe(message => this.requiredDropdownButton = message);

  }

  getTemplateList() {
    this.serviceApi.get2('/v1/leave/settings/leaveTemplate').
      subscribe(
        res => {
          res.forEach(element => {
            console.log("leave template name==" + element.leaveTemplateName + '..' + element.leaveApprovalType + '...' + element.leaveTemplateId + '.....' + element.leaveApprovalLevel);
            this.Templates.push({
              addLeaveTemplate: element.leaveTemplateName,
              leaveApprovalType: element.leaveApprovalType,
              leaveTemplateId: element.leaveTemplateId,
              primaryApprover: element.leavePrimaryApprover,
              secondaryApprover: element.leaveSecondaryApprover,
              leaveApprovalLevel: element.leaveApprovalLevel
            });

          });
        },
        () => {
          console.log('Enter into Else Bloack');
        }
      );
  }
  getSupervisorList() {
    this.serviceApi.get2('/v1/employee/filterEmployees').
      subscribe(
        res => {
          res.forEach(element => {
            console.log("Employee name==" + element.empFirstName);
            this.approverList.push({ value: element.empCode, viewValue: element.empFirstName + " " + element.empLastName + "-" + element.empCode });
          });
        }
      )
    this.approverListCopy = this.approverList;
  }


  saveTemplate(value: any) {
    if (this.leaveTemplateAssignment.valid) {
      var body = {
        "empCodeList":
          this.checkedRowData,
        "employeeName": "",
        "primaryApprover": this.leaveTemplateAssignment.controls.primaryApprover.value,
        "secondaryApprover": this.leaveTemplateAssignment.controls.primaryApprover.value,
        "templateId": this.leaveTemplateAssignment.controls.addLeaveTemplate.value
      }
      console.log("body of data===" + JSON.stringify(body));
      return this.serviceApi.post('/v1/leave/settings/leaveAssignments/', body).
        subscribe(
          res => {
            // alert(res);
            console.log('Applied Leave Successfully...' + JSON.stringify(res));
            this.action = 'Response';
            this.error = res.message;
            this.close();
          },
          err => {
            console.log('there is something error.....  ' + err.message);
            this.action = 'Error';
            this.error = err.message;
          });
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
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close(this.data);
  }
}
@Component({
  templateUrl: './AssignLeaveSupervisor.component.html',
  styleUrls: ['./AssignLeaveSupervisor.component.scss']
})
export class AssignLeaveSupervisor implements OnInit {
  public leaveSupervisorAssignment: FormGroup;
  approverList = []
  checkedRowData = [];
  error = 'Error Message';
  action: any;
  baseUrl = environment.baseUrl;
  requiredDropdownButton;
  constructor(public dialogRef: MatDialogRef<AssignLeaveTemplate>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder, private serviceApi: ApiCommonService, private validationMessagesService: ValidationMessagesService) {

    // this.checkedRowData = [];
    this.leaveSupervisorAssignment = this._fb.group(
      {
        addLeaveTemplate: [],
        primaryApprover: [],
        secondaryApprover: []
      }
    )
    this.checkedRowData = data.checkedRowData
    console.log('.......data' + this.checkedRowData);
    this.getSupervisorList();
    this.validationMessagesService.currentRequiredDropdownButton.subscribe(message => this.requiredDropdownButton = message);

  }
  getSupervisorList() {

    this.serviceApi.get2('/v1/employee/filterEmployees').
      subscribe(
        res => {
          res.forEach(element => {
            console.log("Employee name==" + element.empFirstName);
            this.approverList.push({ value: element.empCode, viewValue: element.empFirstName + " " + element.empLastName + "-" + element.empCode });
          });
        }
      )
  }
  saveApprover(value: any) {
    if (this.leaveSupervisorAssignment.valid) {
      let primaryApprover
      let secondaryApprover
      console.log('>>>>>>>>>>>>>>>>Enter for Save <<<<<<<<<<<<<<<<<<<<<<<');
      console.log('Value Form FrontEnd : ' + this.leaveSupervisorAssignment.controls.primaryApprover.value + ' .......' +
        this.leaveSupervisorAssignment.controls.secondaryApprover.value)

      var body = {
        "empCodeList":
          this.checkedRowData,

        "employeeName": "",
        "primaryApprover": this.leaveSupervisorAssignment.controls.primaryApprover.value,
        "secondaryApprover": this.leaveSupervisorAssignment.controls.secondaryApprover.value,
        "templateId": this.leaveSupervisorAssignment.controls.addLeaveTemplate.value
      }
      console.log("body of data===" + JSON.stringify(body));
      return this.serviceApi.post('/v1/leave/settings/leaveAssignments/', body).
        subscribe(
          res => {
            console.log('Applied Leave Successfully...' + JSON.stringify(res));
            this.action = 'Response';
            this.error = res.message;
            this.close();
            // this.checkedRowData = [];

          },
          err => {
            console.log('there is something error.....  ' + err.message);
            this.action = 'Error';
            this.error = err.message;
            this.close();
          }
        );
    }
    else {
      Object.keys(this.leaveSupervisorAssignment.controls).forEach(field => { // {1}
        const control = this.leaveSupervisorAssignment.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
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
    this.dialogRef.close(this.data);
  }
}
@Component({
  templateUrl: './UploadTemplateAssignment.component.html',
  styleUrls: ['./UploadTemplateAssignment.component.scss']
})
export class UploadTemplateAssignment implements OnInit {
  constructor(public dialogRef: MatDialogRef<AssignLeaveTemplate>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder) {
    //  this.LeaveAssignment = this._fb.group(
    //   {
    //     attendenceTemplate: [data.attendenceTemplate],
    //   }
    //  )
  }
  ngOnInit() {

  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
@Component({
  templateUrl: './UploadSupervisor.component.html',
  styleUrls: ['./UploadSupervisor.component.scss']
})
export class UploadSupervisor implements OnInit {
  constructor(public dialogRef: MatDialogRef<AssignLeaveTemplate>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder) {
    //  this.LeaveAssignment = this._fb.group(
    //   {
    //     attendenceTemplate: [data.attendenceTemplate],
    //   }
    //  )
  }
  ngOnInit() {

  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
@Component({
  templateUrl: './AddLeaveTemplateAssignment.component.html',
  styleUrls: ['./AddLeaveTemplateAssignment.component.scss']
})

export class AddLeaveTemplateAssignment implements OnInit {
  addLeaveAssignment: FormGroup;
  baseUrl = environment.baseUrl;
  primaryApproverControl = new FormControl();
  secondaryApproverControl = new FormControl();
  error = 'Error Message';
  action: any;
  Templates = [];
  approverList1 = [];
  approverList2 = [];
  approverListCopy = [];
  id: any
  divShow = false;
  divShowTemplateWise = false
  divShowEmployee = false
  divShowEmployeeWise = false;
  requiredDropdownButton;
  constructor(public dialogRef: MatDialogRef<AddLeaveTemplateAssignment>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder, private serviceApi: ApiCommonService, private validationMessagesService: ValidationMessagesService) {
    console.log("empcode/Name==" + data);
    this.addLeaveAssignment = this._fb.group(
      {
        employeeName: [data.employeeName],
        addLeaveTemplate: [data.addLeaveTemplate],
        primaryApprover: [],
        secondaryApprover: []
      }
    )
    this.getTemplateList();
    this.validationMessagesService.currentRequiredDropdownButton.subscribe(message => this.requiredDropdownButton = message);

  }
  searchEmployeeNameForPrimarysupervisor(data: any) {
    // console.log(this.supervisorList);
    // this.approverList = this.approverListCopy;
    if (this.primaryApproverControl.value != null) {
      this.approverList1 = this.approverListCopy.filter(option =>
        option.viewValue.toLowerCase().indexOf(this.primaryApproverControl.value.toLowerCase()) !== -1);
      // } else {

      // this.myControl.reset();
      // this.getAllEmployeeList();
      // this.employeeList = this.employeeLists.filter(option =>
      //   option.fullName.toLowerCase().indexOf(this.myControl.value.toLowerCase()) === 0);
    }
  }
  searchEmployeeNameForSecondarysupervisor(data: any) {
    // console.log(this.supervisorList);
    // this.approverList = this.approverListCopy;
    if (this.secondaryApproverControl.value != null) {
      this.approverList2 = this.approverListCopy.filter(option =>
        option.viewValue.toLowerCase().indexOf(this.secondaryApproverControl.value.toLowerCase()) !== -1);
      // } else {

      // this.myControl.reset();
      // this.getAllEmployeeList();
      // this.employeeList = this.employeeLists.filter(option =>
      //   option.fullName.toLowerCase().indexOf(this.myControl.value.toLowerCase()) === 0);
    }
  }
  clearSecondaryApprover() {
    this.secondaryApproverControl.reset();
    this.approverList2 = this.approverListCopy;
  }
  clearPrimaryApprover() {
    this.primaryApproverControl.reset();
    this.approverList1 = this.approverListCopy;
  }
  getTemplateList() {
    this.serviceApi.get2('/v1/leave/settings/leaveTemplate').
      subscribe(
        res => {
          res.forEach(element => {
            console.log("leave template name==" + element.leaveTemplateName + '..' + element.leaveApprovalType + '...' + element.leaveTemplateId + '.....' + element.leaveApprovalLevel);
            this.Templates.push({
              addLeaveTemplate: element.leaveTemplateName,
              leaveApprovalType: element.leaveApprovalType,
              leaveTemplateId: element.leaveTemplateId,
              primaryApprover: element.leavePrimaryApprover,
              secondaryApprover: element.leaveSecondaryApprover,
              leaveApprovalLevel: element.leaveApprovalLevel
            });

          });
        },
        () => {
          console.log('Enter into Else Bloack');
        }
      );
    this.serviceApi.get2('/v1/employee/filterEmployees').
      subscribe(
        res => {
          res.forEach(element => {
            console.log("Employee name==" + element.empFirstName);
            this.approverList1.push({ value: element.empCode, viewValue: element.empFirstName + " " + element.empLastName + "-" + element.empCode });
          });
        }
      )
    this.approverListCopy = this.approverList1;
    this.approverList2 = this.approverList1;

  }
  saveTemplate(value: any) {

    if (this.addLeaveAssignment.valid) {



      var primaryEmployee = this.data.employeeName.split("-");
      console.log('primaryEmployee ' + primaryEmployee[1]);
      const LeaveTemplate = this.addLeaveAssignment.value;
      console.log('data send for put in db' + LeaveTemplate.primaryApprover);
      var body = {
        "empCodeList": [
          primaryEmployee[1]
        ],
        "employeeName": "",
        "primaryApprover": this.addLeaveAssignment.controls.primaryApprover.value,
        "secondaryApprover": this.addLeaveAssignment.controls.secondaryApprover.value,
        "templateId": this.addLeaveAssignment.controls.addLeaveTemplate.value
      }
      console.log("body of data===" + JSON.stringify(body));
      return this.serviceApi.post('/v1/leave/settings/leaveAssignments/', body).
        subscribe(
          res => {
            console.log('Bank data saved successfully...')
            this.action = 'Response';
            this.error = res.message;
            this.close();



          },
          err => {
            console.log('there is something error');
            this.action = 'Error';
            this.error = err.message;
            this.close();
          }
        );
    }
    else {
      Object.keys(this.addLeaveAssignment.controls).forEach(field => { // {1}
        const control = this.addLeaveAssignment.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
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
  selectedTemplateValue(data: any) {
    // alert(data);
    console.log(data);
    this.approverList1 = this.approverList1;
    this.approverList2 = this.approverList1;
    this.addLeaveAssignment.get('primaryApprover').reset();

    this.addLeaveAssignment.get('secondaryApprover').reset();
    for (var i = 0; i < this.Templates.length; i++) {
      // console.log('Tenplate Name.....' + this.Templates[i].addLeaveTemplate)
      // console.log("leave Aproval type==" + this.Templates[i].leaveApprovalType);
      // console.log("leave Aproval level==" + this.Templates[i].leaveApprovalLevel);
      // console.log("leave Aprover==" + this.Templates[i].primaryApprover);
      if (data.value === this.Templates[i].leaveTemplateId) {
        if (this.Templates[i].leaveApprovalLevel === "SECOND_LEVEL" && this.Templates[i].leaveApprovalType == "TEMPLATEWISE") {
          // this.addLeaveAssignment.get('primaryApprover').clearValidators();
          // this.addLeaveAssignment.get('primaryApprover').updateValueAndValidity();

          // this.addLeaveAssignment.get('secondaryApprover').clearValidators();
          // this.addLeaveAssignment.get('secondaryApprover').updateValueAndValidity();


          this.divShow = true;
          this.divShowTemplateWise = false;
          this.divShowEmployee = false;
          this.divShowEmployeeWise = false;
          this.addLeaveAssignment.controls.primaryApprover.setValue(this.Templates[i].primaryApprover);
          this.addLeaveAssignment.controls.secondaryApprover.setValue(this.Templates[i].secondaryApprover);
          break;
        }
        else if (this.Templates[i].leaveApprovalLevel === "FIRST_LEVEL" && this.Templates[i].leaveApprovalType == "TEMPLATEWISE") {
          this.addLeaveAssignment.get('secondaryApprover').clearValidators();
          this.addLeaveAssignment.get('secondaryApprover').updateValueAndValidity();

          this.divShowTemplateWise = true;
          this.divShow = false;
          this.divShowEmployee = false;
          this.divShowEmployeeWise = false;
          this.addLeaveAssignment.controls.primaryApprover.setValue(this.Templates[i].primaryApprover);
        }
        else if (this.Templates[i].leaveApprovalLevel === "FIRST_LEVEL" && this.Templates[i].leaveApprovalType == "EMPLOYEEWISE") {

          this.divShowEmployee = true;
          this.divShowEmployeeWise = false;
          this.divShowTemplateWise = false;
          this.divShow = false;
          this.addLeaveAssignment.get('primaryApprover').setValidators([Validators.required]);

          this.addLeaveAssignment.get('secondaryApprover').clearValidators();
          this.addLeaveAssignment.get('secondaryApprover').updateValueAndValidity();


        }
        else if (this.Templates[i].leaveApprovalLevel === "SECOND_LEVEL" && this.Templates[i].leaveApprovalType == "EMPLOYEEWISE") {

          this.divShowEmployee = false;
          this.divShowEmployeeWise = true;
          this.divShowTemplateWise = false;
          this.divShow = false;
          this.addLeaveAssignment.get('primaryApprover').setValidators([Validators.required]);

          this.addLeaveAssignment.get('secondaryApprover').setValidators([Validators.required]);

        }

      }

    }

  }
}

@Component({
  templateUrl: './EditLeaveTemplateAssignment.component.html',
  styleUrls: ['./EditLeaveTemplateAssignment.component.scss']
})
export class EditLeaveTemplateAssignment implements OnInit, AfterViewInit {

  editLeaveAssignment: FormGroup;
  openPrimary: boolean;
  openSecondary: boolean;
  primaryApprover: any
  templateWiseHideShow: boolean;
  employeeWiseHideShow: boolean;
  secondaryApprover: any
  primaryEmpCode: any;
  secondaryEmpCode: any;
  error = 'Error Message';
  levelType = []
  action: any;
  i = 0;
  Templates = []
  approverList1 = [];
  approverList2 = [];
  approverCopy = [];
  assignLeaveData = [];
  secondaryApproverControl = new FormControl();
  primaryApproverControl = new FormControl();
  constructor(public dialogRef: MatDialogRef<EditLeaveTemplateAssignment>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder, private serviceApi: ApiCommonService) {

    if (data.templateType === 'EMPLOYEEWISE') {
      this.templateWiseHideShow = false;
      this.employeeWiseHideShow = true;

      this.getSelectedLeave();
      // alert();
      // console.log(JSON.stringify(data));
      // alert();
      // this.templateWiseHideShow = false;
      // this.employeeWiseHideShow = true;
      // if (data.editLeavePrimaryApprover === null) {
      //   if (data.editLeaveSecondaryApprover != null) {
      //     this.openPrimary = true;
      //     this.openSecondary = true;
      //   } else if (data.editLeaveSecondaryApprover === null) {
      //     this.openPrimary = true;
      //     this.openSecondary = false;
      //   }
      // } else {
      //   console.log('There is no any Approver Assign');
      // }

    } else if (data.templateType === 'TEMPLATEWISE') {

      this.templateWiseHideShow = true;
      this.employeeWiseHideShow = false;
      if (data.editLeavePrimaryApprover != null) {
        if (data.editLeaveSecondaryApprover != null) {
          this.openPrimary = true;
          this.openSecondary = true;
        } else if (data.editLeaveSecondaryApprover === null) {
          this.openPrimary = true;
          this.openSecondary = false;
        }
      } else {
        console.log('There is no any Approver Assign');
      }


    }

    if (data.editLeavePrimaryApprover != null) {
      this.primaryApprover = data.editLeavePrimaryApprover.split('-');
      this.primaryEmpCode = this.primaryApprover[1];
    }
    else {
      console.log('Inside else');
      this.primaryApprover = null;
      this.primaryEmpCode = this.primaryApprover;
    }
    if (data.editLeaveSecondaryApprover != null) {
      this.secondaryApprover = data.editLeaveSecondaryApprover.split('-');
      this.secondaryEmpCode = this.secondaryApprover[1];
    }
    else {
      console.log('Inside else00');
      this.secondaryApprover = null;
      this.secondaryEmpCode = this.secondaryApprover;
    }

    this.editLeaveAssignment = this._fb.group({
      employeeName: [data.employeeName],
      templateId: [data.templateId],
      editLeaveTemplate: [data.editLeaveTemplate],
      editLeavePrimaryApprover: this.primaryEmpCode,
      editLeaveSecondaryApprover: this.secondaryEmpCode,
      leaveApprovalType: [],
      assignmentId: [data.assignmentId]
    });

    if (data.templateType === 'TEMPLATEWISE') {
      this.editLeaveAssignment.controls.editLeavePrimaryApprover.disable;
      this.editLeaveAssignment.controls.editLeaveSecondaryApprover.disable;
    }

    this.getApproverList();
    // this.getTemplateList();
    // this.setApprover();

  }
  ngAfterViewInit(): void {
    console.log('Inside After view init' + JSON.stringify(this.Templates));
  }

  clearSecondaryApprover() {
    this.secondaryApproverControl.reset();
    this.approverList2 = this.approverCopy;
  }
  clearPrimaryApprover() {
    this.primaryApproverControl.reset();
    this.approverList1 = this.approverCopy;
  }

  searchEmployeeNameForPrimarysupervisor(data: any) {
    // console.log(this.supervisorList);
    // this.approverList = this.approverListCopy;
    if (this.primaryApproverControl.value != null) {
      this.approverList1 = this.approverCopy.filter(option =>
        option.viewValue.toLowerCase().indexOf(this.primaryApproverControl.value.toLowerCase()) !== -1);
      // } else {

      // this.myControl.reset();
      // this.getAllEmployeeList();
      // this.employeeList = this.employeeLists.filter(option =>
      //   option.fullName.toLowerCase().indexOf(this.myControl.value.toLowerCase()) === 0);
    }
  }

  searchEmployeeNameForSecondarysupervisor(data: any) {
    // console.log(this.supervisorList);
    // this.approverList = this.approverListCopy;
    if (this.secondaryApproverControl.value != null) {
      this.approverList2 = this.approverCopy.filter(option =>
        option.viewValue.toLowerCase().indexOf(this.secondaryApproverControl.value.toLowerCase()) !== -1);
      // } else {

      // this.myControl.reset();
      // this.getAllEmployeeList();
      // this.employeeList = this.employeeLists.filter(option =>
      //   option.fullName.toLowerCase().indexOf(this.myControl.value.toLowerCase()) === 0);
    }
  }

  getApproverList() {
    this.serviceApi.get2('/v1/employee/filterEmployees').
      subscribe(
        res => {
          res.forEach(element => {
            console.log("Employee name==" + element.empFirstName);
            this.approverList1.push({
              value: element.empCode,
              viewValue: element.empFirstName + " " + element.empLastName + "-" + element.empCode
            });
          });
        });
    this.approverCopy = this.approverList1;
    this.approverList2 = this.approverList1;
  }
  getSelectedLeave() {
    this.openPrimary = false;
    this.openSecondary = false;
    this.serviceApi.get('/v1/leave/settings/leaveTemplate').
      subscribe(
        res => {

          res.forEach(element => {
            if (element.leaveTemplateName === this.data.editLeaveTemplate) {

              if (element.leaveApprovalLevel === 'FIRST_LEVEL') {
                this.openPrimary = true;
              }
              else {
                this.openSecondary = true;
                this.openPrimary = true;
              }


            }

          });

        });




  }
  setApprover() {
    console.log('serApprover');
    console.log('Array of supervisor' + JSON.stringify(this.Templates));
  }

  saveAssignLeaveTemplate(value: any) {
    console.log('Saved value of Edit Template');
    console.log('.....' + this.editLeaveAssignment.controls.editLeaveTemplate.value + '.....' +
      this.editLeaveAssignment.controls.editLeavePrimaryApprover.value + '....' +
      this.editLeaveAssignment.controls.editLeaveSecondaryApprover.value + '....' +
      this.editLeaveAssignment.controls.templateId.value);

    const id = this.editLeaveAssignment.controls.assignmentId.value;
    console.log('Id.... ' + id);

    console.log('.....' + this.data.employeeName)
    var primaryEmployee = this.data.employeeName.split("-");
    console.log(primaryEmployee[1]);
    const LeaveTemplate = this.editLeaveAssignment.value;
    console.log('data send for put in db' + LeaveTemplate.primaryApprover);
    var body = {
      "empCodeList": [
        primaryEmployee[1]
      ],
      "employeeName": "",
      "primaryApprover": this.editLeaveAssignment.controls.editLeavePrimaryApprover.value,
      "secondaryApprover": this.editLeaveAssignment.controls.editLeaveSecondaryApprover.value,
      "templateId": this.editLeaveAssignment.controls.templateId.value
    }
    console.log("body of data===" + JSON.stringify(body));

    return this.serviceApi.put('/v1/leave/settings/leaveAssignments/' + id, body).
      subscribe(
        res => {
          console.log('Bank data saved successfully...');
          this.action = 'Response';
          this.error = res.message;
          this.close();

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

  onNoClick(): void {
    this.dialogRef.close();
  }
}
@Component({
  templateUrl: './LeaveDelete.component.html',
  styleUrls: ['./LeaveDelete.component.scss']
})
export class LeaveDelete implements OnInit {
  baseUrl = environment.baseUrl;
  deleteLeaveRequest: FormGroup;
  error = 'Error Message';
  action: any;
  constructor(public dialogRef: MatDialogRef<LeaveDelete>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder, private serviceApi: ApiCommonService) {
    this.deleteLeaveRequest = this._fb.group(
      {
        usrComment: [],
        assignmentId: [data.assignmentId],
      }
    )
  }
  ngOnInit() {
  }
  confirmDelete(value: any) {
    const id = this.deleteLeaveRequest.controls.assignmentId.value;
    console.log('Id.... ' + id);
    this.serviceApi.delete('/v1/leave/settings/leaveAssignments/' + id).subscribe(
      res => {
        console.log('Bank data delete successfully');
        this.action = 'Response';
        this.error = res.message;
        this.close()

      },
      err => {
        console.log('there is something error');
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
  templateUrl: './AddLeaveHistory.component.html',
  styleUrls: ['./AddLeaveHistory.component.scss']
})
export class AddLeaveHistory implements OnInit {
  displayedColumns = ['currentLeavePolicy', 'effectiveFrom', 'effectiveTo', 'initialBalances'];
  dataSource2: MatTableDataSource<Element>;
  constructor(public dialogRef: MatDialogRef<AddLeaveHistory>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder) {
    console.log('.....' + JSON.stringify(data))

  }
  ngOnInit() {
    this.dataSource2 = new MatTableDataSource<Element>(ELEMENT_DATA);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
export interface Element {
  empName: string;
  effectiveFrom: string;
  templateName: string;
  primaryApprover: string;
  secondaryApprover: string;
  actions: string;
  leaveApprovalLevel: string;
}

const ELEMENT_DATA: Element[] = [];

@Component({
  templateUrl: 'bulk-upload-template-assignmnet-dialog.html',
})

export class BulkUploadTemplateAssignment implements OnInit {
  noFileSelected: boolean = false;
  ngOnInit(): void {

  }
  action: any;
  error: any;
  errorMessage: any;
  selectedFiles: FileList;
  currentFileUpload: File;
  selectedFilesName: string;
  notificationMsg: any;
  message: any;
  constructor(public dialogRef: MatDialogRef<BulkUploadTemplateAssignment>, private fb: FormBuilder, private serviceApi: ApiCommonService, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  downloadFormat() {
    this.serviceApi.get('/v1/leave/settings/leaveAssignments/bulk/download/format').subscribe(res => {
      window.open(environment.storageServiceBaseUrl + res.url);
    })    
  }
  uploadFormat() {
    $('#uploadFile').click();
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
    this.selectedFilesName = this.selectedFiles.item(0).name;
    this.noFileSelected = false
  }

  upload() {
   if (this.selectedFiles!=undefined) {
    this.currentFileUpload = this.selectedFiles[0];
    const file = <File>this.currentFileUpload;
    let formdata: FormData = new FormData();
    formdata.append('file', file);
    const url = '/v1/leave/settings/leaveAssignments/bulk/upload';

    this.serviceApi.postWithFormData(url, formdata).subscribe(res => {
      this.action = 'Response';
      this.message = 'Template Assignment uploaded successfuly';
      this.close();
      const dialogRef = this.dialog.open(LeaveTemplateBulkUploadResponseComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: { res: res, title: 'Leave Template Assignment' }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            console.log('Result value ..... ' + result.message);
            if (result.status === 'Response') {
            }
            else if (result.status === 'Error') {
            }
          }
        }
      });
    },
    err => {
      this.action = 'Error';
      this.message = 'Something went wrong';
    });
   }
   else {
     this.noFileSelected = true
   }
  }
  close(): void {
    this.data.message = this.message;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
}


@Component({
  templateUrl: 'bulk-upload-response.html',
  styleUrls: []
})
export class LeaveTemplateBulkUploadResponseComponent implements OnInit {

  action: any;
  error = 'Error message';
  res: any;
  title: any;
  dataSource: MatTableDataSource<Element>;
  displayedColumns = ['empCode', 'statusMsg', 'inviteStatus'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private _fb: FormBuilder, private serviceApi: ApiCommonService,
    public dialogRef: MatDialogRef<LeaveTemplateBulkUploadResponseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(JSON.stringify(this.data));
    this.res = [];
    this.res = this.data.res;
    this.title = this.data.title;
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<Element>(this.res);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit() {
    
  }

  close(): void {
    console.log('this.data');
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    this.dialogRef.close(this.data);
  }


}