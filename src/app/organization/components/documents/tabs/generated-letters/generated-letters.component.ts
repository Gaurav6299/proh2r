import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { ValidationMessagesService } from '../../../../../validation-messages.service';
import { KeycloakService } from '../../../../../keycloak/keycloak.service';
import { DataTable } from 'primeng/primeng';
declare var $: any;
@Component({
  selector: 'app-generated-letters',
  templateUrl: './generated-letters.component.html',
  styleUrls: ['./generated-letters.component.scss']
})
export class GeneratedLettersComponent implements OnInit {
  @ViewChild("dt1") dt: DataTable;
  showHideFilter: false;
  employee = [];
  letterData = [];
  Responsestatus: any;
  errorMessage: any;
  action: any;
  publishedStaus: boolean;
  isValidFormSubmitted = true;
  generatedLetter = [];
  // displayedColumns = ['documentName', 'letterTemplateName', 'empName',
  //   'createdDate', 'modifiedDate', 'actions'];
  columns = [
    { field: 'documentName', header: 'Document Name' },
    { field: 'letterTemplateName', header: 'Letter Template' },
    { field: 'empName', header: 'Employee Name' },
    { field: 'createdDate', header: 'Created At' },
    { field: 'modifiedDate', header: 'Last Update At' },
    { field: 'actions', header: 'Actions' },
  ]
  dataSource: MatTableDataSource<Element>;
  selection = new SelectionModel<Element>(true, []);
  myControl = new FormControl();
  selectedWorkLocation = new FormControl();
  myControlYear = new FormControl();
  selectedYear = new FormControl();


  myControlEmployeeStatus = new FormControl();
  selectedEmployeeStatus = new FormControl();
  status = [
    { value: 'Published', viewValue: 'Published' },
    { value: 'UnPublished', viewValue: 'UnPublished' },
  ];
  statusData = this.status;

  myControlCostCenter = new FormControl();
  selectedCostCenter = new FormControl();



  constructor(public dialog: MatDialog, private fb: FormBuilder, private serviceApi: ApiCommonService,
    private validationMessagesService: ValidationMessagesService) {
    this.getEmployee();
    this.getGeneratedLetter();
    this.getLetter();
    const rolesArr = KeycloakService.getUserRole();
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
      message: this.errorMessage,
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
  getGeneratedLetter() {
    this.generatedLetter = [];
    this.serviceApi.get2('/v1/documents/generatedLetters/generate').
      subscribe(
        res => {
          console.log();
          res.forEach(element => {
            this.generatedLetter.push({
              'documentId': element.documentId,
              'letterTemplateName': element.letterTemplateName,
              'documentName': element.documentName,
              'createdDate': element.createdDate,
              'modifiedDate': element.modifiedDate,
              'empName': element.empName,
              'signatoryEmpCode': element.signatoryEmpCode,
              'publishedStaus': element.publishedStaus,
              'documentUrl': element.documentUrl
            });
          });
          // this.dataSource = new MatTableDataSource(generatedLetter);
        }, (err) => {
        }, () => {
          this.dt.reset();
        });
  }
  getEmployee() {
    this.employee = [];
    this.serviceApi.get('/v1/employee/filterEmployees').
      subscribe(
        res => {
          res.forEach(element => {
            this.employee.push({
              value: element.empCode,
              viewValue: element.empFirstName + ' ' + element.empLastName + ' ' + element.empCode,
            });
          });
        }, () => {
          console.log('Enter into Else Bloack');
        });
  }

  getLetter() {
    this.letterData = [];
    this.serviceApi.get('/v1/documents/lettertemplates/letterTemplate').
      subscribe(
        res => {
          res.forEach(element => {
            console.log('letterTemplateId------------------' + element.letterTemplateId);
            console.log('templateLabel------------------' + element.templateLabel);
            this.letterData.push({
              letterTemplateId: element.letterTemplateId,
              templateLabel: element.templateLabel,
            });
          });
        }, () => {
          console.log('Enter into Else Bloack while getting letter data:::::::');
          console.log(this.letterData);
        });
    console.log('getting letter data:::::::');
    console.log(this.letterData);
  }
  generateLetter() {
    const dialogRef = this.dialog.open(GenerateEmpLetter, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: {
        empList: this.employee,
        message: this.errorMessage,
        status: this.action
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          console.log('Result value ..... ' + result.message);
          if (result.status === 'Response') {
            this.errorMessage = result.message;
            this.successNotification(this.errorMessage);

            this.getGeneratedLetter();
          } else if (result.status === 'Error') {
            this.errorMessage = result.message;
            // this.warningNotification(this.errorMessage);
          }
        }
      }
      console.log('Enter in the Final Bloak for getting all values');
    });
  }
  downloadLetter(element: any) {
    console.log(element);    
    window.open(element.documentUrl);
  }

  searchYear(data: any) {
    // console.log('my method called' + data);
    // this.yearsData = this.years.filter(option =>
    //   option.value.toLowerCase().indexOf(this.myControlYear.value.toLowerCase()) === 0);
  }

  searchEmployeeStatus(data: any) {
    console.log('searchEmployeeStatus called' + data);
    this.statusData = this.status.filter(option =>
      option.value.toLowerCase().indexOf(this.myControlEmployeeStatus.value.toLowerCase()) === 0);
  }


  /** Whether the number of selected elements matches the total number of rows. */
  applyFilter(filterValue: string) {
    console.log('hello' + filterValue);
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
  deleteGeneratedLetter(data: any) {
      const dialogRef = this.dialog.open(DeleteGeneratedLetters, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: { documentId: data.documentId, message: this.errorMessage, status: this.action }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            console.log('Result value ..... ' + result.message);
            if (result.status === 'Response') {
              this.errorMessage = result.message;
              this.successNotification(this.errorMessage);

              this.getGeneratedLetter();
            }
            // tslint:disable-next-line:one-line
            else if (result.status === 'Error') {
              this.errorMessage = result.message;
              // this.warningNotification(this.errorMessage);
            }
          }
          // tslint:disable-next-line:one-line
        }
        //    this.employeeLeaveApplication.controls.assignLeaveApplication.setValue('');

        console.log('Enter in the Final Bloak for getting all values');

      });
  }

  publishGeneratedLetter(data: any, status: boolean) {
      console.log('going to publish::::');
      console.log(status);
      console.log(data.documentId);
      let dialogRef = this.dialog.open(PublishEmpLetter, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: { documentId: data.documentId, publishedStatus: status, message: this.errorMessage, status: this.action }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            console.log('Result value ..... ' + result.message);
            if (result.status === 'Response') {
              this.errorMessage = result.message;
              this.successNotification(this.errorMessage);

              this.getGeneratedLetter();
            }
            // tslint:disable-next-line:one-line
            else if (result.status === 'Error') {
              this.errorMessage = result.message;
              // this.warningNotification(this.errorMessage);
            }
          }
          // tslint:disable-next-line:one-line

        }
        console.log('Enter in the Final Bloak for getting all values');
      });
  }



  /** Selects all rows if they are not all selected; otherwise clear selection. */








  ngOnInit() {
  }
  ActionDropDown = [
    { value: 'Bulk Actions', viewValue: 'Bulk Actions' },
    { value: 'Publish', viewValue: 'Publish' },
    { value: 'UnPublish', viewValue: 'UnPublish' },
    { value: 'Download', viewValue: 'Download' },
    { value: 'Delete', viewValue: 'Delete' }
  ];

}
let generatedLetter = [];
export interface Element {

  select: any,
  documentName: any,
  letterTemplateName: any,
  empName: any,
  createdDate: any,
  modifiedDate: any,
  actions: any
}

@Component({
  selector: 'app-delete-generated-letters',
  templateUrl: './delete-generated-letter.html',
  styleUrls: ['./delete-generated-letter.scss']
})
export class DeleteGeneratedLetters implements OnInit {

  documentId: any;
  message: any;
  action: any;
  error = 'Error Message';
  constructor(
    public dialogRef: MatDialogRef<DeleteGeneratedLetters>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _fb: FormBuilder, private serviceApi: ApiCommonService) {

    this.documentId = this.data.documentId;
    this.message = this.data.message;
    this.action = this.data.action
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onDelete() {

    return this.serviceApi.delete('/v1/documents/generatedLetters/' + this.documentId)

      .subscribe(
        res => {
          console.log('DeleteEmpDocDialog deleted successfully');
          this.action = 'Response';
          this.error = res.message;
          this.close();
        }, err => {
          console.log('there is something error.....  ' + err.message);
          this.action = 'Error';
          this.error = err.message;
          this.close();
          console.log('there is something error');
        }
      );

  }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
  ngOnInit() {

  }



}
@Component({
  selector: 'app-publish-generated-letters',
  templateUrl: './publish-emp-letter.html',
  styleUrls: ['./delete-generated-letter.scss']
})
export class PublishEmpLetter implements OnInit {

  documentId: any;

  message: any;
  status: any;
  error = 'Error Message';
  action: any;
  publishedStatus: boolean;
  constructor(
    public dialogRef: MatDialogRef<PublishEmpLetter>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _fb: FormBuilder, private serviceApi: ApiCommonService) {
    this.documentId = this.data.documentId;
    this.publishedStatus = this.data.publishedStatus;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onpublish() {
    this.serviceApi.put('/v1/documents/generatedLetters/publishById/' + this.documentId + '/' + <Boolean>this.publishedStatus, null)
      .subscribe(
        res => {
          console.log('Applied Leave Successfully...' + JSON.stringify(res));
          this.action = 'Response';
          this.error = res.message;
          this.close();
        },
        err => {
          console.log('there is something error.....  ' + err.message);
          this.action = 'Error';
          this.error = err.message;
          this.close();
        });
  }
  ngOnInit() {

  }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
}


@Component({
  selector: 'app-generate-letters',
  templateUrl: './generate-letter.html',
  styleUrls: ['./delete-generated-letter.scss']
})
// tslint:disable-next-line:component-class-suffix
export class GenerateEmpLetter implements OnInit {
  message: any;
  status: any;
  action: any;
  error = 'Error Message';
  employee = [];
  letterTemplate = [];
  signatory = [];
  letterGeneration: FormGroup;
  selectedEmpCode = '';
  searchEmployee = new FormControl();
  seletedEmployeesCode = [];
  empCode: any;
  publishedStatus: boolean;

  isValidFormSubmitted = true;
  requiredTextField;
  requiredRadioButton;
  requiredDropdownButton;
  constructor(
    public dialogRef: MatDialogRef<PublishEmpLetter>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _fb: FormBuilder, private serviceApi: ApiCommonService,
    private validationMessagesService: ValidationMessagesService) {
    this.employee = this.data.empList;
    this.message = this.data.message;
    this.status = this.data.status;

    this.validationMessagesService.currentRequiredTextField.subscribe(message => this.requiredTextField = message);
    this.validationMessagesService.currentRequiredRadioButton.subscribe(message => this.requiredRadioButton = message);
    this.validationMessagesService.currentRequiredDropdownButton.subscribe(message => this.requiredDropdownButton = message);
  }
  ngOnInit() {
    this.getLetter();
    this.getSignatory();
    this.letterGeneration = this._fb.group({
      template: ['', [Validators.required]],
      signatory: ['', [Validators.required]],
      docName: ['', [
        Validators.required,
        this.validationMessagesService.alphaNumericValidation
      ]],
      selectedEmployee: ['', [Validators.required]]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  generateLetter(status: boolean) {
    if (this.letterGeneration.valid) {
      this.isValidFormSubmitted = true;
      this.publishedStatus = status;
      let empArray = [];
      empArray = this.letterGeneration.controls.selectedEmployee.value;
      for (let i = 0; i < empArray.length; i++) {
        this.selectedEmpCode += empArray[i] + ',';
      }
      this.selectedEmpCode.trim();
      const bearerData = '';
      const body = {
        'authSignatoryId': this.letterGeneration.controls.signatory.value,
        'documentId': 0,
        'documentName': this.letterGeneration.controls.docName.value,
        'letterTemplateId': this.letterGeneration.controls.template.value,
        'publishedStatus': this.publishedStatus,
        'selectedEmployee': this.selectedEmpCode
      };
      this.serviceApi.post('/v1/documents/generatedLetters/generate', body)
        .subscribe(
          res => {
            console.log('Generated Letter Successfully...' + JSON.stringify(res));
            this.action = 'Response';
            this.error = res.message;
            this.close();
          }, err => {
            console.log('there is something error.....  ' + err.message);
            this.action = 'Error';
            this.error = err.message;
            this.close();
          });
    } else {
      Object.keys(this.letterGeneration.controls).forEach(field => { // {1}
        const control = this.letterGeneration.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
  getLetter() {
    this.letterTemplate = [];
    this.serviceApi.get('/v1/documents/lettertemplates/letterTemplate').
      subscribe(
        res => {
          res.forEach(element => {
            this.letterTemplate.push({
              letterTemplateId: element.letterTemplateId,
              letterHeaderTemplate: element.letterHeaderTemplate,
              letterFooterTemplate: element.letterFooterTemplate,
              templateLabel: element.templateLabel,
              createdOn: element.createdDate,
              lastUpdatedOn: element.modifiedDate
            });
          });
        },
        () => {
          console.log('Enter into Else Block');
        }
      );


  }

  getSignatory() {
    this.signatory = [];
    this.serviceApi.get('/v1/documents/lettertemplates/authorizedSignatory').
      subscribe(
        res => {
          res.forEach(element => {
            this.signatory.push({
              authSignatoryId: element.authSignatoryId,
              employeeName: element.employeeName,
              empCode: element.empCode,
              empDesignation: element.empDesignation,
            });
          });
        },
        () => {
          console.log('Enter into Else Bloack');
        }
      );



  }

}

