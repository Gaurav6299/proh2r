import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { DataTable } from 'primeng/primeng';
import { ApiCommonService } from '../../../../../../app/services/api-common.service';
import { MatDialog, MatDialogRef, MatPaginator, MatSort, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from '../../../../../../environments/environment';
declare var $: any;

@Component({
  selector: 'app-time-sheet-template-assignment',
  templateUrl: './time-sheet-template-assignment.component.html',
  styleUrls: ['./time-sheet-template-assignment.component.scss']
})
export class TimeSheetTemplateAssignmentComponent implements OnInit {
  columns = [
    { field: 'employeeName', header: 'Employee Name' },
    { field: 'location', header: 'Location' },
    { field: 'band', header: 'Band' },
    { field: 'department', header: 'Department' },
    { field: 'designation', header: 'Designation' },
    { field: 'currentTimeSheetTempName', header: 'Current Template' },
    { field: 'primaryApprover', header: 'Primary Supervisors' },
    { field: 'secondaryApprover', header: 'Secondary Supervisors' },
    { field: 'effectiveFrom', header: 'Effective From' },
    { field: 'action', header: 'Action' }
  ]
  @ViewChild("dt1") dt: DataTable;
  allLocation = [];
  allDepartment = [];
  allDesignation = [];
  allBand = [];
  selectedRows = [];
  timeSheetsTemplateAssignmentsList = [];
  timeSheetsTemplate: any[];
  employeeList: any[];
  constructor(private serviceApi: ApiCommonService, public dialog: MatDialog) {
    this.getAllTimeSheetAssignments();
    this.getAllTimeSheetsTemplate();
    this.getEmployeeList();
  }
  successNotification(successMessage: any) {
    $.notifyClose();
    $.notify({
      icon: 'check_circle',
      message: successMessage,
    }, {
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
    }, {
        type: 'warning',
        timer: 4000,
        placement: {
          from: 'top',
          align: 'center'
        }
      });
  }

  ngOnInit() {
  }

  getAllTimeSheetsTemplate() {
    this.timeSheetsTemplate = [];
    this.serviceApi.get("/v1/timesheets/template/").subscribe(res => {
      this.timeSheetsTemplate = res;
    })
  }

  getEmployeeList() {
    this.employeeList = [];
    this.serviceApi.get("/v1/employee/filterEmployees").subscribe(
      res => {
        res.forEach(element => {
          this.employeeList.push({
            value: element.empCode,
            viewValue: element.empFirstName.trim() + ' ' + element.empLastName.trim() + '-' + element.empCode.trim()
          });
        });
      });
  }
  getAllTimeSheetAssignments() {
    this.selectedRows = [];
    this.timeSheetsTemplateAssignmentsList = [];
    this.allBand = [];
    this.allDepartment = [];
    this.allDesignation = [];
    this.allLocation = [];
    this.serviceApi.get("/v1/timesheets/template-assignment/all").subscribe(res => {
      res.forEach(element => {
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
        this.timeSheetsTemplateAssignmentsList.push({
          employeeName: element.employeeName,
          location: element.location,
          band: element.band,
          department: element.department,
          designation: element.designation,
          currentTimeSheetTempName: element.templateName,
          currentTimeSheetTemplateId: element.templateId,
          primaryApprover: element.primarySupervisorId,
          secondaryApprover: element.secondarySupervisorId,
          effectiveFrom: element.effectiveFromDate,
          empCode: element.empCode,
          timeSheetsAssignmentId: element.timeSheetsAssignmentId,

        });
      });

    }, (err) => {

    }, () => {
      this.dt.reset();
      console.log(this.allBand);

    });
  }
  assignTemplate(row: any, element: any) {
    // this.selectedRows.push(row);
    if (this.selectedRows.length === 0 && element === 'bulk') {
      return this.warningNotification("Please select employee first");

    }
    else if (element === 'bulk' && this.selectedRows.length > 0) {
      const dialogRef = this.dialog.open(BulkTimeSheetsTemplateAssignmentComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: {
          title: "Timesheet Template Assignment",
          timeSheetsTemplate: this.timeSheetsTemplate,
          selectedRows: this.selectedRows,
          employeeList: this.employeeList,
          option: 'assign'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          if (result.message) {
            if (result.status === 'Response') {
              console.log(result);
              this.successNotification(result.message);
              this.getAllTimeSheetAssignments();
              this.selectedRows = [];
            } else if (result.status === 'Error') {
            }
          }
        }
      });
    } else if (element === 'new') {
      const dialogRef = this.dialog.open(BulkTimeSheetsTemplateAssignmentComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: {
          title: "Timesheet Template Assignment",
          timeSheetsTemplate: this.timeSheetsTemplate,
          selectedRows: [row],
          employeeList: this.employeeList,
          option: 'assign'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          if (result.message) {
            if (result.status === 'Response') {
              console.log(result);
              this.successNotification(result.message);
              this.getAllTimeSheetAssignments();
              this.selectedRows = [];
            } else if (result.status === 'Error') {
            }
          }
        }
      });
    } else if (element === 'update') {
      const dialogRef = this.dialog.open(BulkTimeSheetsTemplateAssignmentComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: {
          title: "Update Timesheet Template Assignment",
          selectedRows: [row],
          timeSheetsTemplate: this.timeSheetsTemplate,
          employeeList: this.employeeList,
          option: 'update'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          if (result.message) {
            if (result.status === 'Response') {
              console.log(result);
              this.successNotification(result.message);
              this.getAllTimeSheetAssignments();
              this.selectedRows = [];
            } else if (result.status === 'Error') {
            }
          }
        }
      });

    }
  }

  openDeleteTimeSheetTemplateAssignment(selectedRow: any) {
    console.log(selectedRow.onDutyAssignmentId);
    const dialogRef = this.dialog.open(DeleteTimeSheetTemplateAssignment, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: {
        timeSheetsAssignmentId: selectedRow.timeSheetsAssignmentId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result !== undefined) {
        if (result.message) {
          if (result.status === 'Response') {
            this.successNotification(result.message);
            this.selectedRows = [];
            this.getAllTimeSheetAssignments();
          } else if (result.status === 'Error') {
            // this.notificationMsg = result.message;
            // this.warningNotification(this.notificationMsg);
          }
        }
      }
    });
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
            this.successNotification(result.message);
            this.getAllTimeSheetAssignments();
          }
          else if (result.status === 'Error') {
          }
        }
      }
    });
  } 

}

@Component({
  templateUrl: './bulk-timesheet-template-assignment.component.html'
})
export class BulkTimeSheetsTemplateAssignmentComponent implements OnInit {
  title: any;
  timeSheetsTemplateAssignment: FormGroup;
  action: any;
  error: any;
  timeSheetsTemplate = [];
  employeeList = [];
  selectedRows = [];
  selectedTemplate = {
    approvalType: '',
    approvalLevel: '',
    templateName: '',
    timeSheetsTemplateId: '',
    primaryApprover: '',
    secondaryApprover: ''
  }

  ngOnInit() {
    // throw new Error("Method not implemented.");
  }

  constructor(private serviceApi: ApiCommonService, public dialogRef: MatDialogRef<BulkTimeSheetsTemplateAssignmentComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private _fb: FormBuilder, ) {
    this.title = data.title;
    console.log(data);
    this.timeSheetsTemplateAssignment = this._fb.group({
      timeSheetsAssignmentId: [],
      timeSheetsTemplate: [null, Validators.required],
      primaryApprover: [null],
      secondaryApprover: [null],
      effectiveDate: [null, Validators.required]
    });
    this.employeeList = data.employeeList;
    data.timeSheetsTemplate.forEach(template => {
      this.timeSheetsTemplate.push({
        templateName: template.templateName,
        timeSheetsTemplateId: template.timeSheetsTemplateId,
        approvalType: template.timeSheetsApprovalType,
        primaryApprover: template.primaryApprover,
        secondaryApprover: template.secondaryApprover,
        approvalLevel: template.approvalLevel
      })
    });
    data.selectedRows.forEach(element => {
      this.selectedRows.push(element.empCode)
    });
    if (this.data.option === 'update') {
      console.log(this.data.selectedRows);
      this.timeSheetsTemplateAssignment.controls.timeSheetsAssignmentId.setValue(this.data.selectedRows[0].timeSheetsAssignmentId)
      this.timeSheetsTemplateAssignment.controls.timeSheetsTemplate.setValue(this.data.selectedRows[0].currentTimeSheetTemplateId);

      this.timeSheetsTemplateAssignment.controls.effectiveDate.setValue(this.data.selectedRows[0].effectiveFrom);

      this.selectedTemplateValue();
      this.timeSheetsTemplateAssignment.controls.primaryApprover.setValue((this.data.selectedRows[0].primaryApprover != null) ? this.data.selectedRows[0].primaryApprover.split("-")[1] : null);
      this.timeSheetsTemplateAssignment.controls.secondaryApprover.setValue((this.data.selectedRows[0].secondaryApprover != null) ? this.data.selectedRows[0].secondaryApprover.split("-")[1] : null);
    }
    this.setValidators();

  }
  setValidators() {
    this.timeSheetsTemplateAssignment.controls.primaryApprover.clearValidators();
    this.timeSheetsTemplateAssignment.controls.secondaryApprover.clearValidators();
    if (this.selectedTemplate.approvalLevel == 'LEVEL1') {
      this.timeSheetsTemplateAssignment.controls.primaryApprover.setValidators(Validators.required);
    }

    if (this.selectedTemplate.approvalLevel == 'LEVEL2') {
      this.timeSheetsTemplateAssignment.controls.primaryApprover.setValidators(Validators.required);
      this.timeSheetsTemplateAssignment.controls.secondaryApprover.setValidators(Validators.required);
    }
    this.timeSheetsTemplateAssignment.controls.primaryApprover.updateValueAndValidity();
    this.timeSheetsTemplateAssignment.controls.secondaryApprover.updateValueAndValidity();
  }

  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    this.dialogRef.close(this.data);
  }

  selectedTemplateValue() {
    console.log(this.timeSheetsTemplateAssignment.controls.timeSheetsTemplate.value);
    this.selectedTemplate = {
      approvalType: '',
      approvalLevel: '',
      templateName: '',
      timeSheetsTemplateId: '',
      primaryApprover: '',
      secondaryApprover: ''
    }
    this.timeSheetsTemplate.forEach(template => {
      if (template.timeSheetsTemplateId === this.timeSheetsTemplateAssignment.controls.timeSheetsTemplate.value) {
        this.selectedTemplate = {
          approvalType: template.approvalType,
          approvalLevel: template.approvalLevel,
          templateName: template.templateName,
          timeSheetsTemplateId: template.timeSheetsTemplateId,
          primaryApprover: template.primaryApprover,
          secondaryApprover: template.secondaryApprover
        }
      }
    });
    this.timeSheetsTemplateAssignment.controls.primaryApprover.setValue(this.selectedTemplate.primaryApprover);
    this.timeSheetsTemplateAssignment.controls.secondaryApprover.setValue(this.selectedTemplate.secondaryApprover);
    console.log(this.selectedTemplate)

    if (this.selectedTemplate.approvalType == 'TEMPLATEWISE') {
      this.timeSheetsTemplateAssignment.controls.primaryApprover.clearValidators();
      this.timeSheetsTemplateAssignment.controls.secondaryApprover.clearValidators();
      this.timeSheetsTemplateAssignment.controls.primaryApprover.disable();
      this.timeSheetsTemplateAssignment.controls.secondaryApprover.disable();
    } else {
      this.timeSheetsTemplateAssignment.controls.primaryApprover.enable();
      this.timeSheetsTemplateAssignment.controls.secondaryApprover.enable();
      this.timeSheetsTemplateAssignment.controls.primaryApprover.reset();
      this.timeSheetsTemplateAssignment.controls.secondaryApprover.reset();
      this.setValidators();
    }
    this.timeSheetsTemplateAssignment.controls.primaryApprover.updateValueAndValidity();
    this.timeSheetsTemplateAssignment.controls.secondaryApprover.updateValueAndValidity();
  }
  assignTemplate() {
    if (this.timeSheetsTemplateAssignment.valid) {

      const body = {
        "templateId": this.timeSheetsTemplateAssignment.controls.timeSheetsTemplate.value,
        "timeSheetsAssignmentId": this.timeSheetsTemplateAssignment.controls.timeSheetsAssignmentId.value,
        "effectiveFromDate": this.timeSheetsTemplateAssignment.controls.effectiveDate.value,
        "empCodeList": this.selectedRows,
        "primarySupervisorId": this.timeSheetsTemplateAssignment.controls.primaryApprover.value,
        "secondarySupervisorId": this.timeSheetsTemplateAssignment.controls.secondaryApprover.value
      }
      console.log(body);

      this.serviceApi.post("/v1/timesheets/template-assignment/", body).subscribe(res => {
        this.action = 'Response';
        this.error = res.message;
        this.close();
      }, (err) => {
        this.action = 'Error';
        this.error = err.message;

      }, () => {

      })

    } else {
      Object.keys(this.timeSheetsTemplateAssignment.controls).forEach(field => { // {1}
        const control = this.timeSheetsTemplateAssignment.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }

  }
}
@Component({
  templateUrl: './delete-timesheet-template-assignment.component.html'
})
export class DeleteTimeSheetTemplateAssignment implements OnInit {

  action: any;
  error: any;

  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<DeleteTimeSheetTemplateAssignment>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    console.log('data-->' + data);
  }
  ngOnInit() {
  }
  deletetimeSheetsTemplateAssignment() {
    this.serviceApi.delete('/v1/timesheets/template-assignment/' + this.data.timeSheetsAssignmentId).subscribe(
      res => {
        if (res != null) {
          this.action = 'Response';
          this.error = res.message;

          console.log('Timesheet Assignent Record Successfully Deleted');
        } else {
          console.log('Timesheet Assignent Record doesnot Exist');
        }
        this.close();
      }, err => {
        console.log('Something gone Wrong to delete the Shift Record from Database');
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
    this.serviceApi.get('/v1/timesheets/template-assignment/bulk/format/download').subscribe(res => {
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
    const url = '/v1/timesheets/template-assignment/bulk/upload';

    this.serviceApi.postWithFormData(url, formdata).subscribe(res => {
      this.action = 'Response';
      this.message = 'Template Assignment uploaded successfuly';
      this.close();
      const dialogRef = this.dialog.open(BulkUploadResponseComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: { res: res, title: 'Time Sheets Template Assignment' }
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
export class BulkUploadResponseComponent implements OnInit {

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
    public dialogRef: MatDialogRef<BulkUploadResponseComponent>,
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
