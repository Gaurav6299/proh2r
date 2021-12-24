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
declare var $: any;

@Component({
  selector: 'app-org-bank-info',
  templateUrl: './org-bank-info.component.html',
  styleUrls: ['./org-bank-info.component.scss']
})
export class OrgBankInfoComponent implements OnInit, AfterViewInit {
  bankListData = [];
  public data: any;
  bankName: string;
  accountNumber: number;
  bankCorporateId: string;
  companyId: string;
  ifscCode: string;
  accountID: string;
  myData: Array<any>;
  baseUrl = environment.baseUrl;
  notificationMsg: any;
  action: any;
  isValidFormSubmitted = true;
  requiredTextField;
  requiredRadioButton;
  displayedColumns = ['bankName', 'accountNumber','ifscCode', 'bankCorporateId','accountID'];
  dataSource: MatTableDataSource<BankDetailsData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  searchValue = new FormControl();
  constructor(public dialog: MatDialog, private http: Http, private serviceApi: ApiCommonService,
    private validationMessagesService: ValidationMessagesService) {
    this.getAllBankListInformation();
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

  openAddBankInformationDialog(): void {
    this.notificationMsg = '';
    this.action = '';
    const dialogRef = this.dialog.open(OrgAddBankInformation, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: {
        bankName: this.bankName,
        accountNumber: this.accountNumber,
        bankCorporateId: this.bankCorporateId,
        companyId: this.companyId,
        ifscCode: this.ifscCode,
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
          this.getAllBankListInformation();
        }
   
      }

    });
  }

  openEditableDialog(data: any) {
      this.notificationMsg = '';
      this.action = '';
      const dialogRef = this.dialog.open(OrgAddBankInformation, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: {
          bankName: data.bankName,
          accountNumber: data.accountNumber,
          bankCorporateId: data.bankCorporateId,
          companyId: data.companyId,
          ifscCode: data.ifscCode,
          accountID: data.accountID,
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
            this.getAllBankListInformation();
          }
  
        }
      });
  }

  openDeleteDialog(value: any) {
      this.notificationMsg = '';
      this.action = '';
      console.log('Request for delete the Reocord Id ---------' + value.accountID);
      const dialogRef = this.dialog.open(OrgDeleteBankInformation, {
        // width: '500px',
        panelClass: 'custom-dialog-container',
        data: {
          accountID: value.accountID, message: this.notificationMsg,
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
            this.getAllBankListInformation();
          }
        }
      });
  }


  getAllBankListInformation() {
    this.bankListData = [];
    this.serviceApi.get2('/v1/organization/orgBankInfo').
      subscribe(
      res => {
        res.forEach(element => {
          this.bankListData.push({
            bankName: element.bankName,
            accountNumber: element.accountNumber,
            bankCorporateId: element.bankCorporateId,
            companyId: element.companyId,
            ifscCode: element.ifscCode,
            accountID: element.accountID
          });
        });
        this.dataSource = new MatTableDataSource(this.bankListData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, () => {
        console.log('Enter into Else Bloack');
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
  templateUrl: 'org-add-bank-info.html',
  styleUrls: ['./bankInfo-dialog-component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class OrgAddBankInformation implements OnInit {

  public bankFilterCtrl: FormControl = new FormControl();
  public ifscFilterCtrl: FormControl = new FormControl();
  public filteredBanks: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredIfscCodes: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  @ViewChild('singleSelect1') singleSelect1: MatSelect;
  @ViewChild('singleSelect2') singleSelect2: MatSelect;
  protected _onDestroy = new Subject<void>();

  baseUrl = environment.baseUrl;
  bankList = [];
  ifscCodeList = [];
  saveButton: boolean;
  updateBtton: boolean;
  headerName: any;
  isValidFormSubmitted = true;
  requiredTextField;
  requiredRadioButton;
  requiredDropdownButton;
  companyId:any
  error = 'Error Message';
  action: any;
  public bankInformationForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<OrgAddBankInformation>,
    @Inject(MAT_DIALOG_DATA) public data: any, private http: Http, private _fb: FormBuilder,
    private serviceApi: ApiCommonService, private validationMessagesService: ValidationMessagesService) {
    this.validationMessagesService.currentRequiredTextField.subscribe(message => this.requiredTextField = message);
    this.validationMessagesService.currentRequiredDropdownButton.subscribe(message => this.requiredDropdownButton = message);
    if (this.data.accountID != null) {
      this.headerName = 'Edit';
      this.updateBtton = true;
      this.saveButton = false;

      this.bankInformationForm = this._fb.group({
        bankName: ['', [Validators.required]],
        accountNumber: [this.data.accountNumber, [
          Validators.required,
          this.validationMessagesService.numericWithoutDecimalValidation,
          this.validationMessagesService.bankAccountNumberValidation
    
        ]],
        bankCorporateId: [this.data.bankCorporateId, [
          this.validationMessagesService.alphaNumericValidation
        ]],
        ifscCode: ['', [Validators.required]],
        accountID: [this.data.accountID]
      });
    } else {
      this.headerName = 'Add New';
      this.updateBtton = false;
      this.saveButton = true;

      this.bankInformationForm = this._fb.group({
        bankName: ['', [Validators.required]],
        accountNumber: ['', [
          Validators.required,
          this.validationMessagesService.numericWithoutDecimalValidation,
          this.validationMessagesService.bankAccountNumberValidation
        ]],
        bankCorporateId: ['', [
          this.validationMessagesService.alphaNumericValidation
        ]],
        ifscCode: ['', [Validators.required,]],
        accountID: [this.data.accountID]
      });
    }

  }
  ngOnInit() {
    this.getCompanyId();
    this.getBankList();
    if(this.data.accountID != null){
      this.getBranchList(this.data.bankName);
      console.log(this.data.bankName)
      this.bankInformationForm.controls.bankName.patchValue({viewValue:this.data.bankName})
      this.bankInformationForm.controls.ifscCode.patchValue({value:this.data.ifscCode})
    }
    this.bankFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filter(this.bankList,this.bankFilterCtrl,this.filteredBanks);
      });
      this.ifscFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filter(this.ifscCodeList,this.ifscFilterCtrl,this.filteredIfscCodes);
      });

  }
  
  ngAfterViewInit() {
    this.setInitialValue();
  }
  compareObjects(o1: any, o2: any) {
    return o1 && o2 ? o1.value === o2.value : o1 === o2;
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  
  protected setInitialValue() {
    this.filteredBanks
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect1.compareWith = (a: any, b: any) => a && b && a.viewValue === b.viewValue;
      });
      this.filteredIfscCodes
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect2.compareWith = (a: any, b: any) => a && b && a.value === b.value;
      });
  }
  
  protected filter(listToBeFiltered,filterCtrl,filteredList) {
    if (!listToBeFiltered) {
      return;
    }
    // get the search keyword
    let search = filterCtrl.value;
    if (!search) {
      filteredList.next(listToBeFiltered.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the countries
    filteredList.next(
      listToBeFiltered.filter(bank => bank.viewValue.toLowerCase().indexOf(search) > -1)
    );
  }
  getBankList() {
    this.bankList=[]; 
    this.serviceApi.get2('/v1/organization/banklists').subscribe(
      res => {
        res.forEach(element => {
          this.bankList.push({
            value: element.bankId,
            viewValue: element.bankName
          });
        });
      },
      (err)=>{
        console.log("Error in fetching Bank List.")
      },
      ()=>{
        this.filteredBanks.next(this.bankList.slice());
        if(this.data.accountID != null){
        }
        console.log("Fetched Bank List successfully.")
      });
  }

  getBranchList(bank) {
    this.ifscCodeList=[]; 
    this.bankInformationForm.controls.ifscCode.patchValue('');
    this.bankInformationForm.controls.ifscCode.markAsTouched({ onlySelf: true });
    this.serviceApi.get('/v1/organization/branchesDetails/'+bank).subscribe(
      res => {
        res.forEach(element => {
          this.ifscCodeList.push({
            value: element.ifscCode,
            viewValue: element.ifscCode
          });
        });
      },
      (err)=>{
        console.log("Error in Ifsc Code List.")
      },
      ()=>{
        this.filteredIfscCodes.next(this.ifscCodeList.slice());
        console.log("Fetched Ifsc Code List successfully.")
      });
  }
  getCompanyId() {
    // this.companyId='';
    // this.serviceApi.get2('/v1/organization/orgProfileInfo').subscribe(
    //   res => {
    //     this.companyId=res[0].organizationAddress.companyId
    //   },
    //   (err)=>{
    //     console.log("Error in fetching company Id")
    //   },
    //   ()=>{
  
    //   }
    //   );
    }

  saveBankInformation(value: any) {

    const body = {
      'bankName': this.bankInformationForm.controls.bankName.value.viewValue,
      'accountID': 0,
      'accountNumber': this.bankInformationForm.controls.accountNumber.value,
      'bankCorporateId': this.bankInformationForm.controls.bankCorporateId.value.toUpperCase(),
      'ifscCode': this.bankInformationForm.controls.ifscCode.value.value.toUpperCase(),
      'companyId':this.companyId
    };

    if (this.bankInformationForm.valid) {
      this.isValidFormSubmitted = true;
      // const body = this.bankInformationForm.value;
      console.log('Data Send For Save Bank Information :::: ' + JSON.stringify(body));
      return this.serviceApi.post('/v1/organization/orgBankInfo', body)
       
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
      Object.keys(this.bankInformationForm.controls).forEach(field => { // {1}
        const control = this.bankInformationForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }

  updateBankInformation(value: any) {
    console.log('>>>>>>>>>>>>>>>>Enter for Update <<<<<<<<<<<<<<<<<<<<<<<');
    const body = {
      'bankName': this.bankInformationForm.controls.bankName.value.viewValue,
      'accountID': this.bankInformationForm.controls.accountID.value,
      'accountNumber': this.bankInformationForm.controls.accountNumber.value,
      'bankCorporateId': this.bankInformationForm.controls.bankCorporateId.value.toUpperCase(),
      'ifscCode': this.bankInformationForm.controls.ifscCode.value.value.toUpperCase(),
      'companyId':this.companyId
    };

    if (this.bankInformationForm.valid) {
      this.isValidFormSubmitted = true;
      // const body = this.bankInformationForm.value;
      const val = this.bankInformationForm.controls.accountID.value;
      console.log('Data Send For Update Bank Information Of ID :::::: ' + val + ' Body :::: ' + JSON.stringify(body));
      return this.serviceApi.put('/v1/organization/orgBankInfo/' + +val, body)
       
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
      Object.keys(this.bankInformationForm.controls).forEach(field => { // {1}
        const control = this.bankInformationForm.get(field);            // {2}
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
  templateUrl: 'org-delete-bank-info.html',
  styleUrls: ['./bankInfo-dialog-component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class OrgDeleteBankInformation implements OnInit {
  baseUrl = environment.baseUrl;
  public bankInformationForm: FormGroup;
  error = 'Error Message';
  action: any;
  constructor(
    public dialogRef: MatDialogRef<OrgAddBankInformation>,
    @Inject(MAT_DIALOG_DATA) public data: any, private http: Http, private _fb: FormBuilder, private serviceApi: ApiCommonService) {
  }



  onDelete() {
    const val = this.data.accountID;
    return this.serviceApi.delete('/v1/organization/orgBankInfo/' + +val)
     
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
