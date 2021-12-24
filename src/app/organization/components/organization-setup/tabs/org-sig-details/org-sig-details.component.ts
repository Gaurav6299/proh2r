import { ChangeDetectionStrategy, Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { Http } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { environment } from '../../../../../../environments/environment';
import { KeycloakService } from '../../../../../keycloak/keycloak.service';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { BlockScrollStrategy } from '@angular/cdk/overlay/typings/scroll/block-scroll-strategy';
import { ValidationMessagesService } from '../../../../../validation-messages.service';
import { MatSelect } from '@angular/material';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { OrganizationHeaderComponent } from '../../../organization-header/organization-header.component';
import { DataTable } from 'primeng/primeng';

declare var $: any;
@Component({
  selector: 'app-org-sig-details',
  templateUrl: './org-sig-details.component.html',
  styleUrls: ['./org-sig-details.component.scss']
})
export class OrgSigDetailsComponent implements OnInit {
  @ViewChild("dt1") dt: DataTable;
  // @ViewChild(OrganizationHeaderComponent) orgHeaderChild: OrganizationHeaderComponent;

  // readonly = true;
  // readwrite = false;
  // signatoryInfoList = [];
  // id = '';
  // name = '';
  // deg = '';
  // fName = '';
  // baseUrl = environment.baseUrl;
  // requiredTextField;
  // public signatoryInfoForm: FormGroup;
  // constructor(private fb: FormBuilder, private http: Http, private serviceApi: ApiCommonService,
  //   private validationMessagesService: ValidationMessagesService) {
  //   this.getRecordOnLoading();
  //   this.validationMessagesService.currentRequiredTextField.subscribe(message => this.requiredTextField = message);
  //   const rolesArr = KeycloakService.getUserRole();
  // }
  // successNotification(successMessage: any) {
  //   $.notifyClose();
  //   $.notify({
  //     icon: 'check_circle',
  //     message: successMessage,
  //   },
  //     {
  //       type: 'success',
  //       timer: 4000,
  //       placement: {
  //         from: 'top',
  //         align: 'center'
  //       }
  //     });
  // }
  // warningNotification(warningMessage: any) {
  //   $.notifyClose();
  //   $.notify({
  //     icon: 'error',
  //     message: warningMessage,
  //   },
  //     {
  //       type: 'warning',
  //       timer: 4000,
  //       placement: {
  //         from: 'top',
  //         align: 'center'
  //       }
  //     });
  // }
  // ngOnInit() {
  //   this.signatoryInfoForm = new FormGroup({
  //     signatoryName: new FormControl(Validators.required),
  //     signatoryDesignation: new FormControl(Validators.required),
  //     signatoryFatherName: new FormControl()
  //   });
  // }

  // getRecordOnLoading() {
  //   this.serviceApi.get2('/v1/organization/orgSignatoryInfo').subscribe(
  //     res => {
  //       console.log('-------------  Signatory Informations --------------- ');
  //       res.forEach(element => {
  //         this.id = element.signatoryId;
  //         this.name = element.signatoryName;
  //         this.deg = element.signatoryDesignation;
  //         this.fName = element.signatoryFatherName;
  //         this.signatoryInfoList.push({
  //           id: element.signatoryId,
  //           fullName: element.signatoryName,
  //           designation: element.signatoryDesignation,
  //           fatherName: element.signatoryFatherName
  //         });
  //       });
  //     }, error => {
  //       console.log('there is something json');
  //     });
  // }

  // keyPressSaveOrgSignatoryInfo(event: any) {
  //   if (event.keyCode === 13) {
  //     this.cancel();
  //   }
  // }

  // edit() {
  //   this.readwrite = true;
  //   this.readonly = false;
  //   this.signatoryInfoList.forEach(element => {
  //     this.signatoryInfoForm = this.fb.group({
  //       signatoryName: [element.fullName, [
  //         Validators.required,
  //         this.validationMessagesService.textTypeStringValidation
  //       ]],
  //       signatoryDesignation: [element.designation, [
  //         Validators.required,
  //         this.validationMessagesService.textTypeStringValidation
  //       ]],
  //       signatoryFatherName: [element.fatherName],
  //     });
  //   });
  // }
  // cancel() {
  //   this.readwrite = false;
  //   this.readonly = true;
  // }
  // save() {
  //   if (this.signatoryInfoForm.valid) {
  //     console.log(JSON.stringify(this.signatoryInfoForm.value));
  //     this.serviceApi.put('/v1/organization/orgSignatoryInfo/'
  //       + this.id, JSON.stringify(this.signatoryInfoForm.value)).subscribe(
  //       res => {
  //         console.log('-------------  Signatory Informations --------------- ');
  //         this.successNotification(res.message);
  //         this.readwrite = false;
  //         this.readonly = true;
  //       }, error => {
  //         console.log('there is something misshappend json');
  //         this.warningNotification(error.message);
  //         this.readwrite = false;
  //         this.readonly = true;
  //       }, () => {
  //         this.getRecordOnLoading();
  //         // this.orgHeaderChild.loadData();
  //       });

  //   }
  // }

  sigListData = [];
  signatoryId: string;
  signatoryName: string;
  signatoryDesignation: string;
  signatoryFatherName: string;
  public data: any;
  myData: Array<any>;
  baseUrl = environment.baseUrl;
  notificationMsg: any;
  action: any;
  isValidFormSubmitted = true;
  requiredTextField;
  requiredRadioButton;
  // displayedColumns = ['signatoryName', 'signatoryDesignation', 'signatoryId'];

  columns = [
    { field: 'signatoryName', header: 'Name' },
    { field: 'signatoryDesignation', header: 'Designation' },
    { field: 'signatoryId', header: 'Actions' },
  ]

  dataSource: MatTableDataSource<BankDetailsData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  searchValue = new FormControl();
  constructor(public dialog: MatDialog, private http: Http, private serviceApi: ApiCommonService,
    private validationMessagesService: ValidationMessagesService) {
    this.getAllSignatoryInformation();
    this.validationMessagesService.currentRequiredTextField.subscribe(message => this.requiredTextField = message);
    this.validationMessagesService.currentRequiredRadioButton.subscribe(message => this.requiredRadioButton = message);
    const rolesArr = KeycloakService.getUserRole();
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
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  resetSearchField() {
    this.searchValue.reset();
  }

  ngOnInit() {

  }

  openAddSignatoryInformationDialog(): void {
    this.notificationMsg = '';
    this.action = '';
    const dialogRef = this.dialog.open(OrgAddSigInformation, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: {
        signatoryId: this.signatoryId,
        signatoryName: this.signatoryName,
        signatoryDesignation: this.signatoryDesignation,
        signatoryFatherName: this.signatoryFatherName,
        message: this.notificationMsg,
        status: this.action
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed....................' + result.message);
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          console.log('Result value ..... ' + result.message);
          if (result.status === 'Response') {
            this.notificationMsg = result.message;
            this.successNotification(this.notificationMsg);
          } else if (result.status === 'Error') {
            this.notificationMsg = result.message;
            // this.warningNotification(this.notificationMsg);
          }
          this.getAllSignatoryInformation();
        }

      }

    });
  }

  openEditableDialog(data: any) {
      this.notificationMsg = '';
      this.action = '';
      const dialogRef = this.dialog.open(OrgAddSigInformation, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: {
          signatoryId: data.signatoryId,
          signatoryName: data.signatoryName,
          signatoryDesignation: data.signatoryDesignation,
          signatoryFatherName: data.signatoryFatherName,
          status: this.action,
          message: this.notificationMsg
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        // console.log('The dialog was closed....................' + result.message);
        if (result !== undefined) {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            console.log('Result value ..... ' + result.message);
            if (result.status === 'Response') {
              this.notificationMsg = result.message;
              this.successNotification(this.notificationMsg);
            } else if (result.status === 'Error') {
              this.notificationMsg = result.message;
              // this.warningNotification(this.notificationMsg);
            }
            this.getAllSignatoryInformation();
          }

        }
      });
  }

  openDeleteDialog(value: any) {
      this.notificationMsg = '';
      this.action = '';
      console.log('Request for delete the Reocord Id ---------' + value.signatoryId);
      const dialogRef = this.dialog.open(OrgSigDeleteInformation, {
        // width: '500px',
        panelClass: 'custom-dialog-container',
        data: {
          signatoryId: value.signatoryId,
          message: this.notificationMsg,
          status: this.action
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        // console.log('The dialog was closed....................' + result.message);
        if (result !== undefined) {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            console.log('Result value ..... ' + result.message);
            if (result.status === 'Response') {
              this.notificationMsg = result.message;
              this.successNotification(this.notificationMsg);
            } else if (result.status === 'Error') {
              this.notificationMsg = result.message;
              // this.warningNotification(this.notificationMsg);
            }
            this.getAllSignatoryInformation();
          }
        }
      });
  }


  getAllSignatoryInformation() {
    this.sigListData = [];
    this.serviceApi.get2('/v1/organization/orgSignatoryInfo').
      subscribe(
        res => {
          res.forEach(element => {
            this.sigListData.push({
              signatoryId: element.signatoryId,
              signatoryName: element.signatoryName,
              signatoryDesignation: element.signatoryDesignation,
              signatoryFatherName: element.signatoryFatherName,
            });
          });
        }, () => {
          console.log('Enter into Else Bloack');
          this.dt.reset();
        });
  }
}

export interface BankDetailsData {
  bankName: string;
  accountNumber: string;
  bankCorporateId: string;
  companyId: string;
  ifscCode: string;
  accountID: number;
}
const someData: BankDetailsData[] = [];
@Component({
  templateUrl: 'org-add-sig-details.component.html',
  styleUrls: ['./org-sig-add-dialog.scss']
})
// tslint:disable-next-line:component-class-suffix
export class OrgAddSigInformation implements OnInit {
  baseUrl = environment.baseUrl;
  saveButton: boolean;
  updateBtton: boolean;
  headerName: any;
  isValidFormSubmitted = true;
  requiredTextField;
  requiredRadioButton;
  requiredDropdownButton;
  error = 'Error Message';
  action: any;
  public signatoryInformationForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<OrgAddSigInformation>,
    @Inject(MAT_DIALOG_DATA) public data: any, private http: Http, private _fb: FormBuilder,
    private serviceApi: ApiCommonService, private validationMessagesService: ValidationMessagesService) {
    this.validationMessagesService.currentRequiredTextField.subscribe(message => this.requiredTextField = message);
    this.validationMessagesService.currentRequiredDropdownButton.subscribe(message => this.requiredDropdownButton = message);
    if (this.data.signatoryId != null) {
      this.headerName = 'Edit';
      this.updateBtton = true;
      this.saveButton = false;

      this.signatoryInformationForm = this._fb.group({
        signatoryFatherName: [this.data.signatoryFatherName],
        signatoryDesignation: [this.data.signatoryDesignation, [Validators.required]],
        signatoryName: [this.data.signatoryName, [Validators.required]],
        signatoryId: [this.data.signatoryId]
      });
    } else {
      this.headerName = 'Add New';
      this.updateBtton = false;
      this.saveButton = true;
      this.signatoryInformationForm = this._fb.group({
        signatoryFatherName: [''],
        signatoryDesignation: ['', [Validators.required]],
        signatoryName: ['', [Validators.required]],
        signatoryId: [0]
      });
    }

  }
  ngOnInit() {

  }

  saveSignatoryInformation(value: any) {
    const body = {
      'signatoryFatherName': this.signatoryInformationForm.controls.signatoryFatherName.value,
      'signatoryDesignation': this.signatoryInformationForm.controls.signatoryDesignation.value,
      'signatoryName': this.signatoryInformationForm.controls.signatoryName.value,
      'signatoryId': 0
    };

    if (this.signatoryInformationForm.valid) {
      this.isValidFormSubmitted = true;
      // const body = this.bankInformationForm.value;
      console.log('Data Send For Save Signatory Information :::: ' + JSON.stringify(body));
      return this.serviceApi.post('/v1/organization/orgSignatoryInfo', body)

        .subscribe(
          res => {
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
      Object.keys(this.signatoryInformationForm.controls).forEach(field => { // {1}
        const control = this.signatoryInformationForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }

  updateSignatoryInformation(value: any) {
    console.log('>>>>>>>>>>>>>>>>Enter for Update <<<<<<<<<<<<<<<<<<<<<<<');
    const body = {
      'signatoryFatherName': this.signatoryInformationForm.controls.signatoryFatherName.value,
      'signatoryDesignation': this.signatoryInformationForm.controls.signatoryDesignation.value,
      'signatoryName': this.signatoryInformationForm.controls.signatoryName.value,
      'signatoryId': this.signatoryInformationForm.controls.signatoryId.value
    };

    if (this.signatoryInformationForm.valid) {
      this.isValidFormSubmitted = true;
      // const body = this.bankInformationForm.value;
      const val = this.signatoryInformationForm.controls.signatoryId.value;
      console.log('Data Send For Update Bank Information Of ID :::::: ' + val + ' Body :::: ' + JSON.stringify(body));
      return this.serviceApi.put('/v1/organization/orgSignatoryInfo/' + +val, body)

        .subscribe(
          res => {
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
      Object.keys(this.signatoryInformationForm.controls).forEach(field => { // {1}
        const control = this.signatoryInformationForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
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
  templateUrl: 'org-delete-sig-details.component.html',
  styleUrls: ['./org-sig-add-dialog.scss']
})
// tslint:disable-next-line:component-class-suffix
export class OrgSigDeleteInformation implements OnInit {
  baseUrl = environment.baseUrl;
  public bankInformationForm: FormGroup;
  error = 'Error Message';
  action: any;
  constructor(
    public dialogRef: MatDialogRef<OrgSigDeleteInformation>,
    @Inject(MAT_DIALOG_DATA) public data: any, private http: Http, private _fb: FormBuilder, private serviceApi: ApiCommonService) {
  }
  onDelete() {
    const val = this.data.signatoryId;
    return this.serviceApi.delete('/v1/organization/delete/SignatoryInfo/' + val)

      .subscribe(
        res => {
          this.action = 'Response';
          this.error = res.message;
          this.close();
        }, err => {
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

  onNoClick(): void {
    this.dialogRef.close(this.data);
  }
}
