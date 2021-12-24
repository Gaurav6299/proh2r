import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { DataTable } from 'primeng/primeng';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { element } from '@angular/core/src/render3/instructions';
import { environment } from '../../../../../../environments/environment';
declare var $: any;

@Component({
  selector: 'app-onduty-attendance-template-assignment',
  templateUrl: './onduty-attendance-template-assignment.component.html',
  styleUrls: ['./onduty-attendance-template-assignment.component.scss']
})
export class OndutyAttendanceTemplateAssignmentComponent implements OnInit {
  columns = [
    { field: 'employeeName', header: 'Employee Name' },
    { field: 'location', header: 'Location' },
    { field: 'band', header: 'Band' },
    { field: 'department', header: 'Department' },
    { field: 'designation', header: 'Designation' },
    { field: 'currentOnDutyTempName', header: 'Current Template' },
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
  onDutyTemplateAssignmentsArr = [];
  onDutyTemplate: any[];
  employeeList: any[];
  constructor(private serviceApi: ApiCommonService, public dialog: MatDialog) {
    this.getAllOnDutyAssignments();
    this.getAllOnDutyAttendanceTemplate();
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

  getAllOnDutyAttendanceTemplate() {
    this.onDutyTemplate = [];
    this.serviceApi.get("/v1/attendance/settings/onduty/template/get/all").subscribe(res => {
      this.onDutyTemplate = res;
    })
  }

  openDeleteOnDutyTemplate(selectedRow: any) {
    console.log(selectedRow.onDutyAssignmentId);
    const dialogRef = this.dialog.open(DeleteOnDutyTemplateAssignmentComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: {
        onDutyAssignmentId: selectedRow.onDutyAssignmentId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result !== undefined) {
        if (result.message) {
          if (result.status === 'Response') {
            this.successNotification(result.message);
            this.selectedRows = [];
            this.getAllOnDutyAssignments();
          } else if (result.status === 'Error') {
            // this.notificationMsg = result.message;
            // this.warningNotification(this.notificationMsg);
          }
        }
      }
    });
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



  getAllOnDutyAssignments() {
    this.selectedRows = [];
    this.onDutyTemplateAssignmentsArr = [];
    this.allBand = [];
    this.allDepartment = [];
    this.allDesignation = [];
    this.allLocation = [];
    this.serviceApi.get("/v1/attendance/settings/onduty-assignments/").subscribe(res => {
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
        this.onDutyTemplateAssignmentsArr.push({
          employeeName: element.employeeName,
          location: element.location,
          band: element.band,
          department: element.department,
          designation: element.designation,
          currentOnDutyTempName: element.currentOnDutyTempName,
          currentOnDutyTemplateId: element.currentOnDutyTemplateId,
          primaryApprover: element.primaryApprover,
          secondaryApprover: element.secondaryApprover,
          effectiveFrom: element.assignmentDate,
          empCode: element.empCode,
          onDutyAssignmentId: element.onDutyAssignmentId
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
    if (element === 'bulk' && this.selectedRows.length > 0) {

      const dialogRef = this.dialog.open(BulkOndutyAttendanceTemplateAssignmentComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: {
          title: "On Duty Template Assignment",
          onDutyTemplate: this.onDutyTemplate,
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
              this.getAllOnDutyAssignments();
              this.selectedRows = [];
            } else if (result.status === 'Error') {
            }
          }
        }
      });
    }

    if (element === 'new') {

      const dialogRef = this.dialog.open(BulkOndutyAttendanceTemplateAssignmentComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: {
          title: "On Duty Attendance Template Assignment",
          onDutyTemplate: this.onDutyTemplate,
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
              this.getAllOnDutyAssignments();
              this.selectedRows = [];
            } else if (result.status === 'Error') {
            }
          }
        }
      });
    }
    if (element === 'update') {
      const dialogRef = this.dialog.open(BulkOndutyAttendanceTemplateAssignmentComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: {
          title: "Update On Duty Template Assignment",
          selectedRows: [row],
          onDutyTemplate: this.onDutyTemplate,
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
              this.getAllOnDutyAssignments();
              this.selectedRows = [];
            } else if (result.status === 'Error') {
            }
          }
        }
      });

    }
  }
  openDialogToBulkUploadTemplateAssigment() {
    const dialogRef = this.dialog.open(BulkUploadOnDutyTemplateAssignment, {
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
            this.getAllOnDutyAssignments();
          }
          else if (result.status === 'Error') {
          }
        }
      }
    });
  } 

}


@Component({
  templateUrl: './bulk-onduty-template-assignment.component.html'
})
export class BulkOndutyAttendanceTemplateAssignmentComponent implements OnInit {
  title: any;
  onDutyTemplateAssignment: FormGroup;
  action: any;
  error: any;
  onDutyTemplate = [];
  employeeList = [];
  selectedRows = [];
  selectedTemplate = {
    approvalType: '',
    approvalLevel: '',
    templateName: '',
    onDutyTemplateId: '',
    primaryApprover: '',
    secondaryApprover: ''
  }

  ngOnInit() {
    // throw new Error("Method not implemented.");
  }

  constructor(private serviceApi: ApiCommonService, public dialogRef: MatDialogRef<BulkOndutyAttendanceTemplateAssignmentComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private _fb: FormBuilder, ) {
    this.title = data.title;
    console.log(data);
    this.onDutyTemplateAssignment = this._fb.group({
      onDutyTemplate: [null, Validators.required],
      primaryApprover: [null],
      secondaryApprover: [null],
      effectiveDate: [null, Validators.required]
    });
    this.employeeList = data.employeeList;
    data.onDutyTemplate.forEach(template => {
      this.onDutyTemplate.push({
        templateName: template.templateName,
        onDutyTemplateId: template.onDutyTemplateId,
        approvalType: template.approvalType,
        primaryApprover: template.primaryApprover,
        secondaryApprover: template.secondaryApprover,
        approvalLevel: template.approvalLevel
      })
    });
    data.selectedRows.forEach(element => {
      this.selectedRows.push(element.empCode)
    });
    if (this.data.option === 'update') {

      this.onDutyTemplateAssignment.controls.onDutyTemplate.setValue(this.data.selectedRows[0].currentOnDutyTemplateId);
      console.log(this.data.selectedRows);
      this.onDutyTemplateAssignment.controls.effectiveDate.setValue(this.data.selectedRows[0].effectiveFrom);

      this.selectedTemplateValue();
      this.onDutyTemplateAssignment.controls.primaryApprover.setValue((this.data.selectedRows[0].primaryApprover != null) ? this.data.selectedRows[0].primaryApprover.split("-")[1] : null);
      this.onDutyTemplateAssignment.controls.secondaryApprover.setValue((this.data.selectedRows[0].secondaryApprover != null) ? this.data.selectedRows[0].secondaryApprover.split("-")[1] : null);


    }

    this.setValidators();

  }
  setValidators() {
    this.onDutyTemplateAssignment.controls.primaryApprover.clearValidators();
    this.onDutyTemplateAssignment.controls.secondaryApprover.clearValidators();
    if (this.selectedTemplate.approvalLevel == 'FIRST_LEVEL') {
      this.onDutyTemplateAssignment.controls.primaryApprover.setValidators(Validators.required);
    }

    if (this.selectedTemplate.approvalLevel == 'SECOND_LEVEL') {
      this.onDutyTemplateAssignment.controls.primaryApprover.setValidators(Validators.required);
      this.onDutyTemplateAssignment.controls.secondaryApprover.setValidators(Validators.required);
    }
    this.onDutyTemplateAssignment.controls.primaryApprover.updateValueAndValidity();
    this.onDutyTemplateAssignment.controls.secondaryApprover.updateValueAndValidity();
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
    console.log(this.onDutyTemplateAssignment.controls.onDutyTemplate.value);
    this.selectedTemplate = {
      approvalType: '',
      approvalLevel: '',
      templateName: '',
      onDutyTemplateId: '',
      primaryApprover: '',
      secondaryApprover: ''
    }
    this.onDutyTemplate.forEach(template => {
      if (template.onDutyTemplateId === this.onDutyTemplateAssignment.controls.onDutyTemplate.value) {
        this.selectedTemplate = {
          approvalType: template.approvalType,
          approvalLevel: template.approvalLevel,
          templateName: template.templateName,
          onDutyTemplateId: template.onDutyTemplateId,
          primaryApprover: template.primaryApprover,
          secondaryApprover: template.secondaryApprover
        }
      }
    });
    this.onDutyTemplateAssignment.controls.primaryApprover.setValue(this.selectedTemplate.primaryApprover);
    this.onDutyTemplateAssignment.controls.secondaryApprover.setValue(this.selectedTemplate.secondaryApprover);
    console.log(this.selectedTemplate)
    this.setValidators();

  }

  assignTemplate() {
    if (this.onDutyTemplateAssignment.valid) {

      const body = {
        "assignmentDate": this.onDutyTemplateAssignment.controls.effectiveDate.value,
        "empCodeList": this.selectedRows,
        "primaryApprover": this.onDutyTemplateAssignment.controls.primaryApprover.value,
        "secondaryApprover": this.onDutyTemplateAssignment.controls.secondaryApprover.value
      }
      console.log(body);

      this.serviceApi.post("/v1/attendance/settings/onduty-assignments/" + this.onDutyTemplateAssignment.controls.onDutyTemplate.value, body).subscribe(res => {
        this.action = 'Response';
        this.error = res.message;
        this.close();
      }, (err) => {
        this.action = 'Error';
        this.error = err.message;
        this.close();
      }, () => {
        this.close();
      })

    } else {
      Object.keys(this.onDutyTemplateAssignment.controls).forEach(field => { // {1}
        const control = this.onDutyTemplateAssignment.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }

  }
}

@Component({
  templateUrl: './delete-onduty-template-assignment.component.html'
})
export class DeleteOnDutyTemplateAssignmentComponent implements OnInit {

  action: any;
  error: any;

  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<DeleteOnDutyTemplateAssignmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    console.log('data-->' + data);
  }
  ngOnInit() {
  }
  deleteOnDutyTemplateAssignment() {
    this.serviceApi.delete('/v1/attendance/settings/onduty-assignments/' + +this.data.onDutyAssignmentId).subscribe(
      res => {
        if (res != null) {
          this.action = 'Response';
          this.error = res.message;

          console.log('Attendace Assignent Record Successfully Deleted');
        } else {
          console.log('Attendace Assignent Record doesnot Exist');
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

export class BulkUploadOnDutyTemplateAssignment implements OnInit {
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
  constructor(public dialogRef: MatDialogRef<BulkUploadOnDutyTemplateAssignment>, private fb: FormBuilder, private serviceApi: ApiCommonService, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  downloadFormat() {
    this.serviceApi.get('/v1/attendance/settings/onduty-assignments/download/bulk/format').subscribe(res => {
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
    const url = '/v1/attendance/settings/onduty-assignments/bulk/upload';

    this.serviceApi.postWithFormData(url, formdata).subscribe(res => {
      this.action = 'Response';
      this.message = 'Template Assignment uploaded successfuly';
      this.close();
      const dialogRef = this.dialog.open(OnDutyBulkUploadResponseComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: { res: res, title: 'On Duty Template Assignment' }
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
export class OnDutyBulkUploadResponseComponent implements OnInit {

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
    public dialogRef: MatDialogRef<OnDutyBulkUploadResponseComponent>,
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