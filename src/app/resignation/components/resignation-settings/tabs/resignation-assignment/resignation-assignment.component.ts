import { Component, OnInit, Inject, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { Http } from '@angular/http';
import { KeycloakService } from '../../../../../keycloak/keycloak.service';
import { MatPaginator, MatSort, } from '@angular/material';
import { MatPaginatorModule } from '@angular/material/paginator';
import { element } from 'protractor';
import { ValidationMessagesService } from '../../../../../validation-messages.service';
import { DataTable } from 'primeng/primeng';
import { environment } from '../../../../../../environments/environment';
declare var $: any;
@Component({
  selector: 'app-resignation-assignment',
  templateUrl: './resignation-assignment.component.html',
  styleUrls: ['./resignation-assignment.component.scss']
})
export class ResignationAssignmentComponent implements OnInit {
  action: string;
  notificationMsg: any;
  employeeResignationAssignment: FormGroup;
  displayedColumns = [
    { field: 'empName', header: 'Employee Name' },
    { field: 'location', header: 'Location' },
    { field: 'band', header: 'Band' },
    { field: 'department', header: 'Department' },
    { field: 'designation', header: 'Designation' },
    { field: 'resignationTemplateName', header: 'Separation Template' },
    { field: 'l1SupervisorName', header: 'L1 Manager' },
    { field: 'l2SupervisorName', header: 'L2 Manager' },
    { field: 'hrmanagerSupervisorName', header: 'HR Manager' },
    { field: 'action', header: 'Actions' }
  ];
  allLocation = [];
  allDepartment = [];
  allDesignation = [];
  allBand = [];
  @ViewChild("dt1") dt: DataTable;
  // dataSource1 = new MatTableDataSource<Element>();
  // selection = new SelectionModel<Element>(true, []);
  checkedRowData = [];
  assignResignationData = [];
  resignationTemplate = [];

  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;
  approvers: any[];


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

  constructor(public dialog: MatDialog, private fb: FormBuilder, private http: Http, private serviceApi: ApiCommonService) {
    const rolesArr = KeycloakService.getUserRole();
  }

  ngOnInit() {
    this.getResignationAssignment();
    this.getResignationTemplate();
    this.getSupervisorList();
  }

  getResignationTemplate() {
    this.resignationTemplate = [];
    this.serviceApi.get('/v1/resignation/settings/resignationTemplate').subscribe(res => {
      this.resignationTemplate = res;
    }, (err) => {

    }, () => {

    });
  }

  // applyFilter(filterValue: string) {
  //   this.dataSource1.filter = filterValue.trim().toLowerCase();
  // }



  getSupervisorList() {
    this.approvers = [];
    this.serviceApi.get('/v1/employee/filterEmployees').
      subscribe(
        res => {
          res.forEach(element => {
            this.approvers.push({
              value: element.empCode,
              viewValue: element.empFirstName + ' ' + element.empLastName + '-' + element.empCode
            });
          });
        });
  }


  getResignationAssignment() {
    this.assignResignationData = [];
    this.allBand = [];
    this.allDepartment = [];
    this.allDesignation = [];
    this.allLocation = [];
    console.log('Resignation Assign Template');
    this.serviceApi.get('/v1/resignation/assignment/list')
      .subscribe(
        res => {
          console.log('........' + JSON.stringify(res));
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
            console.log(element);
            this.assignResignationData.push({
              resignationTemplateAssignmentId: element.resignationTemplateAssignmentId,
              empCodeList: element.empCodeList,
              empName: element.empName,
              resignationTemplate: element.resignationTemplate,
              resignationTemplateName: (element.resignationTemplate != null) ? element.resignationTemplate.resignationTemplateName : null,
              hrmanagerSupervisor: element.hrmanagerSupervisor,
              l2Supervisor: element.l2Supervisor,
              l1Supervisor: element.l1Supervisor,
              hrmanagerSupervisorName: element.hrmanagerSupervisorName,
              l2SupervisorName: element.l2SupervisorName,
              l1SupervisorName: element.l1SupervisorName,

              empCode: element.empCode,
              location: element.location,
              band: element.band,
              department: element.department,
              designation: element.designation
            });
          });
          // this.dataSource1 = new MatTableDataSource(this.assignResignationData);
          // this.dataSource1.paginator = this.paginator;
          // this.dataSource1.sort = this.sort;
          console.log(this.assignResignationData);
        }, error => {
        }, () => {
          this.dt.reset();

        });
  }

  openAddDialog(value: any): void {
    this.notificationMsg = '';
    this.action = '';
    console.log(value);
    const dialogRef = this.dialog.open(AddResignationAssignment, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: {
        approvers: this.approvers,
        resignationTemplate: this.resignationTemplate,
        message: this.notificationMsg,
        status: this.action,
        empCodeList: value.empCodeList,
        employeeName: value.employeeName,
        resignationApprover: value.resignationApprover,
        resignationApproverId: value.resignationApproverId,
        templateId: value.templateId,
        templateName: value.templateName,
        templateType: value.templateType,
        actions: value.actions,
        empCode: value.empCode
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          this.getResignationAssignment();
        }
        else if (result.status === 'Error') {
          this.notificationMsg = result.message;
          // this.warningNotification(this.notificationMsg);
        }
      }

      console.log('The dialog was closed');
    });
  }



  editResignationAssignmentFunction(value: any) {
    this.notificationMsg = '';
    this.action = '';
    console.log(value);
      const dialogRef = this.dialog.open(EditResignationTemplateAssignment, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: {
          approvers: this.approvers,
          resignationTemplate: value.resignationTemplate,
          hrmanagerSupervisor: value.hrmanagerSupervisor,
          l1Supervisor: value.l1Supervisor,
          resignationTemplateAssignmentId: value.resignationTemplateAssignmentId,
          l2Supervisor: value.l2Supervisor,
          resignationApprover: value.resignationApprover,
          resignationApproverId: value.resignationApproverId,
          templateId: value.templateId,
          templateName: value.templateName,
          templateType: value.templateType,
          actions: value.actions
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            this.getResignationAssignment();
            console.log('Result value ..... ' + result.message);
          }
          else if (result.status === 'Error') {
            this.notificationMsg = result.message;
            // this.warningNotification(this.notificationMsg);
          }

        }

        console.log('The dialog was closed');
      });
  }

  ResignationDelete(data: any) {
    console.log(data);
      this.notificationMsg = '';
      this.action = '';
      const dialogRef = this.dialog.open(ResignationDelete, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: {
          templateId: data.resignationTemplateAssignmentId,
          message: this.notificationMsg,
          status: this.action
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          console.log(result);
          if (result.message) {
            console.log('Result value ..... ' + result.message);
            this.getResignationAssignment();
          }
        }

        console.log('The dialog was closed');
      });
  }

  getRowData(elementObj: any, event: any) {
    console.log('event ' + event.checked);
    console.log('element........' + elementObj.employeeName);
    console.log('element........' + elementObj.templateName);
    const empCode = elementObj.employeeName.split('-');
    console.log('element........' + empCode[1]);

    if (event.checked) {
      this.checkedRowData.push(
        empCode[1]
      );
      console.log(JSON.stringify(this.checkedRowData));
    } else {
      console.log('ENter in the Else Block');
      for (let i = 0; i < this.checkedRowData.length; i++) {
        if (this.checkedRowData[i] === empCode[1]) {
          this.checkedRowData.splice(i, 1);
          console.log('Match Found');
        } else {
          console.log('Not Matched');
        }
      }
    }
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
            this.getResignationAssignment();
          }
          else if (result.status === 'Error') {
          }
        }
      }
    });
  } 

}



@Component({
  templateUrl: './EditResignationTemplateAssignment.component.html',
  styleUrls: ['./EditResignationTemplateAssignment.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class EditResignationTemplateAssignment implements OnInit {

  selectedApprover: any;
  approver: any;
  tempApprover: any;
  EmployeeWise: boolean;
  TemplateWise: boolean;
  employeeWiseHideShow: boolean;
  templateWiseHideShow: boolean;
  resignationTemplate = [];
  approvers = [];
  ApproversCopy = [];
  editResignationAssignment: FormGroup;
  action: string;
  error: any;
  formData: any;
  myControl = new FormControl();
  notificationMsg: any;
  levelOfApprovers: any[];
  message: any;



  constructor(public dialogRef: MatDialogRef<EditResignationTemplateAssignment>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder, private serviceApi: ApiCommonService) {
    this.levelOfApprovers = [];
    console.log(this.data);
    this.approvers = this.data.approvers;
    this.resignationTemplate = this.data.resignationTemplate;
    console.log(this.resignationTemplate);
    console.log(this.resignationTemplate['resignationTemplateName']);

    this.levelOfApprovers = this.resignationTemplate['levelOfApprovers'];
    console.log(this.levelOfApprovers);

  }

  ngOnInit() {
    this.editResignationAssignment = this._fb.group({
      resignationTemplateId: [this.resignationTemplate['resignationTemplateId']],
      assignmentId: [this.data.resignationTemplateAssignmentId],
      templateName: [this.resignationTemplate['resignationTemplateName']],
      l1Supervisor: [this.data.l1Supervisor],
      l2Supervisor: [this.data.l2Supervisor],
      hrmanagerSupervisor: [this.data.hrmanagerSupervisor],
      comment: [null, Validators.required]
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


  updateResignationTemplate() {

    const body = {
      "hrmanagerSupervisor": this.editResignationAssignment.controls.hrmanagerSupervisor.value,
      "l1Supervisor": this.editResignationAssignment.controls.l1Supervisor.value,
      "l2Supervisor": this.editResignationAssignment.controls.l2Supervisor.value,
      "resignationTemplate": {
        "resignationTemplateId": this.editResignationAssignment.controls.resignationTemplateId.value,
      }
    }

    return this.serviceApi.put('/v1/resignation/assignment/' + this.editResignationAssignment.controls.assignmentId.value, body).
      subscribe(res => {
        this.action = 'Response';
        this.message = res.message;
        console.log('Message ::: ' + this.error);
        this.successNotification(this.message);
        this.close();
      }, err => {
        this.action = 'Error';
        this.error = err.message;
        this.close();
        console.log('Message ::: ' + this.error);
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
export interface Element {
  empName: string;
  resignationPolicy: string;
  approver: string;
  actions: string;
}
const ELEMENT_DATA1: Element[] = [

];


@Component({
  templateUrl: './AddResignationAssignment.component.html',
  styleUrls: ['./AddResignationAssignment.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class AddResignationAssignment implements OnInit {

  selectedApprover: any;
  approver: any;
  tempApprover: any;
  templateApprover: any;
  EmployeeWise = false;
  TemplateWise = false;
  addResignationAssignment: FormGroup;
  myControl = new FormControl();
  Policies = [];

  ApproversCopy = [];
  approvers = [];

  approverValidate: boolean;
  approver1: any;
  action: string;
  error: any;
  notificationMsg: any;
  requiredDropdownField: any;
  templateAssigmentFormValidate: boolean;
  resignationTemplate = [];
  levelOfApprovers = [];
  empCode: any[];
  message: any;
  constructor(public dialogRef: MatDialogRef<AddResignationAssignment>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder, private serviceApi: ApiCommonService, private validationMessagesService: ValidationMessagesService) {
    this.validationMessagesService.currentRequiredDropdownButton.subscribe(message => this.requiredDropdownField = message);
    this.approvers = this.data.approvers;
    this.resignationTemplate = this.data.resignationTemplate;
    this.empCode = [];
    this.empCode.push("" + this.data.empCode + "");
    console.log(this.empCode);
  }

  ngOnInit() {
    this.addResignationAssignment = this._fb.group({
      resignationTemplateId: [null, Validators.required],
      l1Supervisor: [null],
      l2Supervisor: [null],
      hrmanagerSupervisor: [null],
      comment: [null, Validators.required]
    });
  }

  selectResignationTemplate(selectedTemplate: any) {
    var template;
    template = this.resignationTemplate.filter(template => template['resignationTemplateId'] === selectedTemplate['value'])[0];
    console.log(template);
    this.levelOfApprovers = template.levelOfApprovers;
    console.log(this.levelOfApprovers);
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


  assignResignationTemplate() {

    const body = {
      "empCodeList": this.empCode,
      "hrmanagerSupervisor": this.addResignationAssignment.controls.hrmanagerSupervisor.value,
      "l1Supervisor": this.addResignationAssignment.controls.l1Supervisor.value,
      "l2Supervisor": this.addResignationAssignment.controls.l2Supervisor.value
    }
    console.log(body);
    if (this.addResignationAssignment.valid) {
      this.templateAssigmentFormValidate = true;
      return this.serviceApi.post('/v1/resignation/assignment/' + this.addResignationAssignment.controls.resignationTemplateId.value, body)

        .subscribe(res => {
          this.action = 'Response';
          this.message = res.message;
          console.log('Message ::: ' + this.error);
          this.successNotification(this.message);
          this.message = res.message;
          this.close();
        }, err => {
          this.action = 'Error';
          this.error = err.message;
          this.close();
          console.log('message ::: ' + this.error);
        });

    } else {
      Object.keys(this.addResignationAssignment.controls).forEach(field => { // {1}
        const control = this.addResignationAssignment.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  close(): void {
    this.data.message = this.message;
    this.dialogRef.close(this.data);
  }
}

@Component({
  templateUrl: './ResignationDelete.component.html',
  styleUrls: ['./ResignationDelete.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class ResignationDelete implements OnInit {

  deleteResignationRequest: FormGroup;
  action: string;
  error: any;
  message: any;
  constructor(public dialogRef: MatDialogRef<ResignationDelete>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder, private serviceApi: ApiCommonService) {
    this.deleteResignationRequest = this._fb.group({
      templateId: [data.templateId],
    });
  }
  ngOnInit() {
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
  confirmDelete(value: any) {
    const id = this.deleteResignationRequest.controls.templateId.value;
    console.log('Id.... ' + id);
    return this.serviceApi.delete('/v1/resignation/assignment/' + id)
      .subscribe(
        res => {
          this.action = 'Response';
          this.message = res.message;
          this.successNotification(this.message);
          console.log('Resignation request deleted');
          this.close();
        }, err => {

          this.action = 'Error';
          this.error = err.message;
          console.log('error');
          this.close();
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
    this.serviceApi.get('/v1/resignation/assignment/download/format').subscribe(res => {
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
    const url = '/v1/resignation/assignment/bulk/upload';

    this.serviceApi.postWithFormData(url, formdata).subscribe(res => {
      this.action = 'Response';
      this.message = 'Template Assignment uploaded successfuly';
      this.close();
      const dialogRef = this.dialog.open(BulkUploadResponseComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: { res: res, title: 'Separation Template Assignment' }
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