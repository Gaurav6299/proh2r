import { Component, OnInit, Input, HostListener, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { Http } from '@angular/http';
import { Headers } from '@angular/http';
import { RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common/src/directives/ng_if';
import { KeycloakService } from '../../../../../keycloak/keycloak.service';
import { environment } from '../../../../../../environments/environment';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { ValidationMessagesService } from '../../../../../validation-messages.service';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { MatSelect, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { OrganizationService } from './organization.service';
import { Inject } from '@angular/core';
import { DataTable } from 'primeng/primeng';
import { ImageCroppedEvent } from 'ngx-image-cropper';
// import { UploadFileService } from '../../../services/UploadFileService.service';
import { UploadFileService } from '../../../../../services/UploadFileService.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
declare var $: any;
@Component({
  selector: 'app-org-profile',
  templateUrl: './org-profile.component.html',
  styleUrls: ['./org-profile.component.scss']
})
export class OrgProfileComponent implements OnInit {
  notificationMsg: any;
  public countryFilterCtrl: FormControl = new FormControl();
  public stateFilterCtrl: FormControl = new FormControl();
  public cityFilterCtrl: FormControl = new FormControl();


  public filteredCountries: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredStates: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredCities: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  @ViewChild('singleSelect1') singleSelect1: MatSelect;
  @ViewChild('singleSelect2') singleSelect2: MatSelect;
  @ViewChild('singleSelect3') singleSelect3: MatSelect;
  @ViewChild("dt1") dt: DataTable;
  protected _onDestroy = new Subject<void>();
  // @ViewChild(OrganizationHeaderComponent) orgHeaderChild: OrganizationHeaderComponent;
  organizationName: any;
  formbuilder: any;
  httpData: any;

  basicInfoId: any;
  nps_temp: any;
  orgAddressId: any;
  pfstatus: any;
  LWFStatus: any;
  esicStatus: any;
  ProfessionalTaxStatus: any;
  IncomeTaxStatus: any;
  NPSStatus: any;
  baseUrl = environment.baseUrl;

  companyName: any;
  ContactNumber: any;
  contactPerson: any;
  panNumber: any;
  gstIn: any;
  linNumber: any;
  retAge: any;
  investmentMonth: any;
  tanNumber: any;
  form16Date: any;
  headoffAdd: any;
  tdsRange: any;

  add1: any;
  add2: any;
  city: any;
  state: any;
  country: any;
  pincode: any;
  isLeftVisible: any;

  readonly = true;
  statutoryreadonly = true;
  readwrite = false;
  Statutoryreadwrite = false;
  addreadonly = true;

  addreadwrite = false;
  InvestmentdisableSelect = false;
  AgedisableSelect = false;
  StatedisableSelect = false;
  pffalse: any;
  pftrue: any;
  pfradiohideshow: any;
  esicDanger: any;
  esicSuccess: any;
  esicradiohideshow: any;
  lwfDanger: any;
  lwfSuccess: any;
  lwfradiohideshow: any;
  prfesionaltaxDanger: any;
  prfesionaltaxSuccess: any;
  prfesionalradiohideshow: any;
  panelFirstWidth: any;
  incometaxDanger: any;
  incometaxSuccess: any;
  incomeradiohideshow: any;
  npsDanger: any;
  npsSuccess: any;
  npsradiohideshow: any;
  saveandcanclebuttondivBasicInfo: any;
  saveandcanclebuttondivStatutoryInfo: any;
  orgProfileId
  saveandcanclebuttondivAddressInfo: any;
  editbuttondivBasicInfo: any;
  editbuttondivStatutoryInfo
  editbuttondivAddressInfo: any;
  public BasicInformationOfOrganization: FormGroup;
  public organizationAddressInfoForm: FormGroup;
  public organizationBasicInfoForm: FormGroup;

  ages = [];
  displayedColumns = [
    { field: 'companyImage', header: 'Company Logo' },
    { field: 'companyName', header: 'Registered Company Name' },
    { field: 'headOfficeAddress', header: 'Head Office Address' },
    { field: 'contactNumber', header: 'Contact number' },
    { field: 'parentCompany', header: 'Parent Company' },
    { field: 'action', header: 'Actions' }
  ];
  IvestestmentMonths = [
    { value: 'January', viewValue: 'January' },
    { value: 'February', viewValue: 'February' },
    { value: 'March', viewValue: 'March' },
    { value: 'April', viewValue: 'April' },
    { value: 'May', viewValue: 'May' },
    { value: 'June', viewValue: 'June' },
    { value: 'July', viewValue: 'July' },
    { value: 'August', viewValue: 'August' },
    { value: 'September', viewValue: 'September' },
    { value: 'October', viewValue: 'October' },
    { value: 'November', viewValue: 'November' },
    { value: 'December', viewValue: 'December' }
  ];
  selectedRow: any;
  basicInfoList = [];
  subCompaniesList = [];
  addressInfoList = [];
  employeeList = [];
  States = [];
  City = [];
  Countries = [];
  requiredTextField;
  requiredRadioButton;
  requiredDropdownButton;
  requiredeDatePicker: any;
  isValidFormSubmitted = true;
  currentFileUpload: File;
  selectedFiles: FileList;
  companyImage;
  authorizedSignatory = new FormControl();
  totalEmployee = new FormControl();
  totalAdmin = new FormControl();
  companyLocation = new FormControl();
  tolatPayroll = new FormControl();
  parentCompanySelected: any;
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

  // ---------------------------------------------------------------------------------------------------------------------------


  uploadFile() {
    $('#uploadFileSubCompany').click();
  }
  event: any;
  selectedFileName;
  selectFile(event) {
    this.selectedFiles = null;
    this.selectedFiles = event.target.files;
    this.selectedFileName = event.target.files[0].name;
    // this.upload();
    this.event = event;
    const dialogRef = this.dialog.open(SubOrganizationImageCropperComponent, {
      // width: '800px',
      panelClass: 'custom-dialog-container',
      data: { event: event }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.croppedFile) {
          this.currentFileUpload = result.croppedFile;
          this.upload();
        }
      }

    });
  }
  upload() {
    console.log('upload method called-->');
    const url = '/v1/organization/profileImage/' + this.orgProfileId;
    this.uploadService.pushFileToStorage(this.currentFileUpload, url, "org", this.selectedFileName).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
      } else if (event instanceof HttpResponse) {
        console.log('File is completely uploaded!');
        this.successNotification(event.body['message']);
        //  this.successNotification("Profile Picture changed successfully");
      }
    },
      err => {
        console.log('error :::' + err);
        // this.warningNotification(JSON.parse(err.error.toString()).message);
      },
      () => {
        // this.loadData();
        this.getCompanyBasicInformation();
      }
    );
    this.selectedFiles = undefined;
  }
  // ---------------------------------------------------------------------------------------------------------------------------

  setFormValue(row: any) {
    this.orgProfileId = row.orgProfileId;
    this.parentCompanySelected = row.parentCompany;
    var selectedbasicInfo = this.basicInfoList.filter(basicInfo => basicInfo.orgProfileId === row.orgProfileId)[0];
    this.BasicInformationOfOrganization = this._fb.group({
      basicInfoId: [selectedbasicInfo.organizationBasicInfo.basicInfoId, Validators.required],
      orgAddressId: [selectedbasicInfo.organizationAddress.orgAddressId, [Validators.required]],
      CompanyName: [selectedbasicInfo.organizationBasicInfo.companyName, [Validators.required]],
      contactPerson: [selectedbasicInfo.organizationBasicInfo.contactPerson, [Validators.required]],
      ContactNumber: [selectedbasicInfo.organizationBasicInfo.contactNumber, [
        Validators.required,
        this.validationMessagesService.contactNumberValidation
      ]],
      PanNumber: [selectedbasicInfo.organizationBasicInfo.panNumber, [
        Validators.required,
        this.validationMessagesService.panCardValidation
      ]],
      gstIn: [selectedbasicInfo.organizationBasicInfo.gstIn, [
        Validators.required]],
      LINNumber: [selectedbasicInfo.organizationBasicInfo.linNumber, [Validators.required]],
      Age: [selectedbasicInfo.organizationBasicInfo.retirementAge, [Validators.required]],
      InvestmentMonth: ['' + selectedbasicInfo.organizationBasicInfo.investmentDeclarationsMonth, Validators.required],
      PFStatus: ['' + selectedbasicInfo.organizationBasicInfo.isPFRegistered, [Validators.required]],
      ESICStatus: ['' + selectedbasicInfo.organizationBasicInfo.isESICRegistered, [Validators.required]],
      LWFStatus: ['' + selectedbasicInfo.organizationBasicInfo.lwfregistered, [Validators.required]],
      ProfessionalTaxStatus: ['' + selectedbasicInfo.organizationBasicInfo.professionalTaxRegistered, [Validators.required]],
      IncomeTaxStatus: ['' + selectedbasicInfo.organizationBasicInfo.incomeTaxRegistered, [Validators.required]],
      TanNumber: [selectedbasicInfo.organizationBasicInfo.tanNumber, [
        Validators.required,
        this.validationMessagesService.TANNumberValidation
      ]],
      NPSStatus: ['' + selectedbasicInfo.organizationBasicInfo.nps, [Validators.required]],
      Form16Date: [selectedbasicInfo.organizationBasicInfo.issueForm16sMonth, [Validators.required]],
      HeadOfficeAddress: [selectedbasicInfo.organizationBasicInfo.headOfficeAddress, [Validators.required]],
      AssesmentRange: [selectedbasicInfo.organizationBasicInfo.tdsAssessmentRange, [Validators.required]],
      PinCode: [selectedbasicInfo.organizationAddress.pinCode, [Validators.required]]
    });


    this.basicInfoId = selectedbasicInfo.organizationBasicInfo.basicInfoId;
    this.orgAddressId = selectedbasicInfo.organizationAddress.orgAddressId;
    this.companyImage = environment.storageServiceBaseUrl + selectedbasicInfo.organizationBasicInfo.docId;
    // this.orgService.sendCompanyName(this.companyName);
    this.ContactNumber = selectedbasicInfo.organizationBasicInfo.contactNumber;
    this.contactPerson = selectedbasicInfo.organizationBasicInfo.contactPerson;
    this.panNumber = selectedbasicInfo.organizationBasicInfo.panNumber;
    this.gstIn = selectedbasicInfo.organizationBasicInfo.gstIn;
    this.linNumber = selectedbasicInfo.organizationBasicInfo.linNumber;
    this.retAge = selectedbasicInfo.organizationBasicInfo.retirementAge;
    this.investmentMonth = '' + selectedbasicInfo.organizationBasicInfo.investmentDeclarationsMonth;
    this.pfstatus = '' + selectedbasicInfo.organizationBasicInfo.isPFRegistered;
    this.esicStatus = '' + selectedbasicInfo.organizationBasicInfo.isESICRegistered;
    this.LWFStatus = '' + selectedbasicInfo.organizationBasicInfo.lwfregistered;
    this.IncomeTaxStatus = '' + selectedbasicInfo.organizationBasicInfo.incomeTaxRegistered;
    this.ProfessionalTaxStatus = '' + selectedbasicInfo.organizationBasicInfo.professionalTaxRegistered;
    this.NPSStatus = '' + selectedbasicInfo.organizationBasicInfo.nps;



    this.tanNumber = selectedbasicInfo.organizationBasicInfo.tanNumber;
    this.form16Date = selectedbasicInfo.organizationBasicInfo.issueForm16sMonth;
    this.headoffAdd = selectedbasicInfo.organizationBasicInfo.headOfficeAddress;
    this.tdsRange = selectedbasicInfo.organizationBasicInfo.tdsAssessmentRange;

    this.add1 = selectedbasicInfo.organizationAddress.addressLine1;
    this.add2 = selectedbasicInfo.organizationAddress.addressLine2;
    this.city = selectedbasicInfo.organizationAddress.city;
    this.state = selectedbasicInfo.organizationAddress.state;
    this.country = selectedbasicInfo.organizationAddress.country;
    this.pincode = selectedbasicInfo.organizationAddress.pinCode;

    this.pfradiohideshow = false;
    this.esicradiohideshow = false;
    if (selectedbasicInfo.organizationBasicInfo.isPFRegistered === true) {
      this.pftrue = true;
      this.pffalse = false;
    } else if (selectedbasicInfo.organizationBasicInfo.isPFRegistered === false) {
      this.pffalse = true;
      this.pftrue = false;
    }

    if (selectedbasicInfo.organizationBasicInfo.isESICRegistered === true) {
      this.esicSuccess = true;
      this.esicDanger = false;
    } else if (selectedbasicInfo.organizationBasicInfo.isESICRegistered === false) {
      this.esicDanger = true;
      this.esicSuccess = false;
    }


    this.lwfradiohideshow = false;
    if (selectedbasicInfo.organizationBasicInfo.lwfregistered === true) {
      this.lwfDanger = false;
      this.lwfSuccess = true;
    } else if (selectedbasicInfo.organizationBasicInfo.lwfregistered === false) {
      this.lwfDanger = true;
      this.lwfSuccess = false;
    }

    this.prfesionalradiohideshow = false;
    if (selectedbasicInfo.organizationBasicInfo.professionalTaxRegistered === true) {
      this.prfesionaltaxSuccess = true;
      this.prfesionaltaxDanger = false;
    } else if (selectedbasicInfo.organizationBasicInfo.professionalTaxRegistered === false) {
      this.prfesionaltaxDanger = true;
      this.prfesionaltaxSuccess = false;
    }

    this.incomeradiohideshow = false;
    if (selectedbasicInfo.organizationBasicInfo.incomeTaxRegistered === true) {
      this.incometaxSuccess = true;
      this.incometaxDanger = false;
    } else if (selectedbasicInfo.organizationBasicInfo.incomeTaxRegistered === false) {
      this.incometaxDanger = true;
      this.incometaxSuccess = false;
    }

    this.npsradiohideshow = false;
    if (selectedbasicInfo.organizationBasicInfo.nps === true) {
      this.npsSuccess = true;
      this.npsDanger = false;
    } else if (selectedbasicInfo.organizationBasicInfo.nps === false) {
      this.npsDanger = true;
      this.npsSuccess = false;
    }

    var selectedAddressInfo = this.addressInfoList.filter(address => address.orgProfileId == selectedbasicInfo.orgProfileId)[0];
    if (selectedAddressInfo != undefined) {
      this.organizationAddressInfoForm = this._fb.group({
        companyId: [selectedAddressInfo.companyId],
        addressLine1: [selectedAddressInfo.addressLine1, Validators.required],
        addressLine2: [selectedAddressInfo.addressLine2],
        orgAddressId: [selectedAddressInfo.orgAddressId],
        city: [
          {
            value: selectedAddressInfo.cityId,
            viewValue: selectedAddressInfo.cityName
          }
          , Validators.required],
        state: [
          {
            value: selectedAddressInfo.stateId,
            viewValue: selectedAddressInfo.stateName
          }, Validators.required],
        country: [
          {
            value: selectedAddressInfo.countryId,
            viewValue: selectedAddressInfo.countryName
          }, Validators.required],
        pinCode: [selectedAddressInfo.pinCode, Validators.required]

      });
      this.getCountryInformation();
      this.getStateInformation(+selectedAddressInfo.countryId);
      this.getCityInformation(+selectedAddressInfo.stateId);
    }
  }

  setPanel() {
    $('.divtoggleDiv')[1].style.display = 'none';
    $('.divtoggleDiv').width(this.panelFirstWidth);
  }
  openRightPan(row: any) {
    console.log(row);
    this.selectedRow = row;
    $('.divtoggleDiv')[1].style.display = 'block';
    this.isLeftVisible = !this.isLeftVisible;
    this.getCompanyAddressInformation();
  }


  openAddSubCompanyDialog() {
    const dialogRef = this.dialog.open(AddUpdateCompanyProfileComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed....................' + result.message);
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message !== null) {
          this.notificationMsg = result.message;
          this.successNotification(this.notificationMsg);
          this.getCompanyBasicInformation();
          this.getCompanyAddressInformation();
        }
      }
    });
  }

  openDeleteDialog(row: any) {
    const dialogRef = this.dialog.open(DeleteCompanyProfileComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: row
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed....................' + result.message);
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message !== null) {
          this.notificationMsg = result.message;
          this.successNotification(this.notificationMsg);
          this.getCompanyBasicInformation();
        }
      }
    });
  }


  constructor(private orgService: OrganizationService, private _fb: FormBuilder, private http: Http, private serviceApi: ApiCommonService, private uploadService: UploadFileService, private apiCommonService: ApiCommonService,
    private validationMessagesService: ValidationMessagesService, public dialog: MatDialog) {
    console.log('------------------' + KeycloakService.getUserRole());
    this.validationMessagesService.currentRequiredTextField.subscribe(message => this.requiredTextField = message);
    this.validationMessagesService.currentRequiredDropdownButton.subscribe(message => this.requiredDropdownButton = message);
    this.validationMessagesService.currentRequiredRadioButton.subscribe(message => this.requiredRadioButton = message);
    this.validationMessagesService.currentRequiredDateButton.subscribe(message => this.requiredeDatePicker = message);
    const rolesArr = KeycloakService.getUserRole();
    this.getEmployeeList();
  }
  ngOnInit() {
    this.orgService.getUploadedFileStatus().subscribe(res => {
      if (res) {
        this.getCompanyBasicInformation();
      }
    })
    for (let i = 0; i <= 60; i++) {
      this.ages.push({
        value: i,
        viewValue: i
      });
      this.organizationAddressInfoForm = this._fb.group({
        companyId: [],
        addressLine1: ['', Validators.required],
        addressLine2: [],
        orgAddressId: [],
        city: ['', [Validators.required,]],
        state: ['', Validators.required],
        country: ['', Validators.required],
        pinCode: ['', Validators.required]
      });
    }
    this.countryFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        // this.filterCountries();
        this.filter(this.Countries, this.countryFilterCtrl, this.filteredCountries);
      });
    this.stateFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        // this.filterStates();
        this.filter(this.States, this.stateFilterCtrl, this.filteredStates);
      });
    this.cityFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        // this.filterCities();
        this.filter(this.City, this.cityFilterCtrl, this.filteredCities);
      });
    this.getCompanyAddressInformation();



    this.InvestmentdisableSelect = true;
    this.AgedisableSelect = true;
    this.StatedisableSelect = true;
    this.editbuttondivBasicInfo = true;
    this.editbuttondivStatutoryInfo = true;
    this.editbuttondivAddressInfo = true;
    this.saveandcanclebuttondivBasicInfo = false;
    this.saveandcanclebuttondivAddressInfo = false;

    this.BasicInformationOfOrganization = this._fb.group({
      basicInfoId: ['', Validators.required],
      orgAddressId: ['', [Validators.required]],
      CompanyName: ['', [Validators.required]],
      contactperson: ['', [Validators.required]],
      ContactNumber: ['', [
        Validators.required,
        this.validationMessagesService.contactNumberValidation
      ]],
      PanNumber: ['', [
        Validators.required,
        this.validationMessagesService.panCardValidation
      ]],
      gstIn: ['', [Validators.required]],
      LINNumber: ['', [Validators.required]],
      Age: ['', [Validators.required]],
      InvestmentMonth: ['', Validators.required],
      PFStatus: ['', [Validators.required]],
      ESICStatus: ['', [Validators.required]],
      LWFStatus: ['', [Validators.required]],
      ProfessionalTaxStatus: ['', [Validators.required]],
      IncomeTaxStatus: ['', [Validators.required]],
      TanNumber: ['', [
        Validators.required,
        this.validationMessagesService.TANNumberValidation
      ]],
      NPSStatus: ['', [Validators.required]],
      Form16Date: ['', [Validators.required]],
      HeadOfficeAddress: ['', [Validators.required]],
      AssesmentRange: ['', [Validators.required]],
      AddressLine1: ['', [Validators.required]],
      AddressLine2: ['', [Validators.required]],
      City: ['', [Validators.required]],
      State: ['', [Validators.required]],
      country: ['', [Validators.required]],
      PinCode: ['', [Validators.required]]
    });
    this.getCompanyBasicInformation();
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

  getCompanyAddressInformation() {
    this.addressInfoList = [];
    console.log('Enter to Get the Address of The Company Address Information');
    this.serviceApi.get('/v1/organization/orgAddress').subscribe(
      res => {
        this.addressInfoList = res;
      }, err => {
      }, () => {
        if (this.selectedRow != undefined) {
          this.setFormValue(this.selectedRow);
        }
        this.hideSaveandCancleButtonOfOrgAddressInfo(false);
      });
    console.log(this.organizationAddressInfoForm);
    console.log(JSON.stringify(this.organizationAddressInfoForm.controls.orgAddressId.value));
  }
  compareObjects(o1: any, o2: any) {
    return o1 && o2 ? o1.value === o2.value : o1 === o2;
  }

  getCompanyBasicInformation() {
    this.subCompaniesList = [];
    this.basicInfoList = [];
    this.serviceApi.get('/v1/organization/orgProfileInfo').subscribe(res => {
      res.forEach(element => {
        console.log(element);
        this.basicInfoList.push(element);
        this.subCompaniesList.push({
          "companyImage": environment.storageServiceBaseUrl + element.organizationBasicInfo.docId,
          "companyName": element.organizationBasicInfo.companyName,
          "contactPerson": element.organizationBasicInfo.contactPerson,
          "headOfficeAddress": element.organizationBasicInfo.headOfficeAddress,
          "contactNumber": element.organizationBasicInfo.contactNumber,
          "parentCompany": element.parent ? 'Yes' : 'No',
          "orgProfileId": element.orgProfileId
        });
      });
    }, (error) => {
      console.log('there is something error in fieldTypes.json');
    }, () => {
      if (this.selectedRow != undefined) {
        this.setFormValue(this.selectedRow);
      }
      this.basicInfoList.forEach(basicInfo => {
        if (basicInfo.parent) {
          this.companyName = basicInfo.organizationBasicInfo.companyName;
          this.orgService.sendCompanyName(this.companyName);
          this.orgService.sendParentOrgProfileId(basicInfo.orgProfileId);
        }
      });
      this.dt.reset();
    });

  }

  keyPressSaveAddress(event: any) {
    if (event.keyCode === 13) {
      this.cancelAddressInformationSave();
    }
  }
  keyPressSaveOrgInformation(event: any) {
    if (event.keyCode === 13) {
      this.cancelCompanyInformationSave();
    }
  }



  ngAfterViewInit() {

  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected setInitialValue() {
    console.log(this.singleSelect1);
    this.filteredCountries
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect1.compareWith = (a: any, b: any) => a && b && a.value === b.value;
      });
    this.filteredStates
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect2.compareWith = (a: any, b: any) => a && b && a.value === b.value;
      });
    this.filteredCities
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect3.compareWith = (a: any, b: any) => a && b && a.value === b.value;
      });
  }

  protected filter(listToBeFiltered, filterCtrl, filteredList) {
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
  getCountryInformation() {
    this.Countries = []
    this.serviceApi.get2('/v1/organization/country').subscribe(
      res => {
        res.forEach(element => {
          this.Countries.push({
            value: element.countryId,
            viewValue: element.countryName
          })
        });
      }, error => {
        console.log('err -->' + error);
      },
      () => {
        this.filteredCountries.next(this.Countries.slice());
      });
  }

  getStateInformation(countryId: number) {
    console.log(countryId)
    this.States = [];
    this.City = [];
    // this.organizationAddressInfoForm.controls.state.patchValue('');
    // this.organizationAddressInfoForm.controls.state.markAsTouched({ onlySelf: true });
    // this.organizationAddressInfoForm.controls.city.patchValue('');
    // this.organizationAddressInfoForm.controls.city.markAsTouched({ onlySelf: true });
    this.serviceApi.get2('/v1/organization/state/' + countryId).subscribe(
      res => {
        res.forEach(element => {
          this.States.push({
            value: element.stateId,
            viewValue: element.stateName
          })
        });
      }, error => {
        console.log('err -->' + error);
      },
      () => {
        this.filteredStates.next(this.States.slice());
      });

  }

  getCityInformation(stateId) {
    this.City = [];
    this.serviceApi.get2('/v1/organization/city/' + stateId).subscribe(
      res => {
        res.forEach(element => {
          this.City.push({
            value: element.cityId,
            viewValue: element.cityName
          })
        });
      }, error => {
        console.log('err -->' + error);
      },
      () => {
        this.filteredCities.next(this.City.slice());
      });
  }
  editStatutoryInfo(fieldEditable: any) {
    console.log(this.retAge);
    this.Statutoryreadwrite = true;
    this.statutoryreadonly = false;
    this.InvestmentdisableSelect = false;
    this.AgedisableSelect = false;
    this.npsradiohideshow = true;
    this.prfesionalradiohideshow = true;
    this.incomeradiohideshow = true;
    this.lwfradiohideshow = true;
    this.pfradiohideshow = true;
    this.esicradiohideshow = true;
    this.pffalse = false;
    this.pftrue = false;
    this.esicDanger = false;
    this.esicSuccess = false;
    this.npsSuccess = false;
    this.npsDanger = false;
    this.lwfDanger = false;
    this.lwfSuccess = false;
    this.prfesionaltaxSuccess = false;
    this.prfesionaltaxDanger = false;
    this.incometaxDanger = false;
    this.incometaxSuccess = false;
    this.saveandcanclebuttondivStatutoryInfo = true;
    this.editbuttondivStatutoryInfo = false;
    this.getCompanyBasicInformation();
    this.cancelAddressInformationSave();
  }



  editBasicInfo(fieldEditable: any) {
    console.log(this.retAge);
    this.readwrite = true;
    this.readonly = false;
    this.InvestmentdisableSelect = false;
    this.AgedisableSelect = false;
    this.npsradiohideshow = true;
    this.prfesionalradiohideshow = true;
    this.incomeradiohideshow = true;
    this.lwfradiohideshow = true;
    this.pfradiohideshow = true;
    this.esicradiohideshow = true;
    this.pffalse = false;
    this.pftrue = false;
    this.esicDanger = false;
    this.esicSuccess = false;
    this.npsSuccess = false;
    this.npsDanger = false;
    this.lwfDanger = false;
    this.lwfSuccess = false;
    this.prfesionaltaxSuccess = false;
    this.prfesionaltaxDanger = false;
    this.incometaxDanger = false;
    this.incometaxSuccess = false;
    this.saveandcanclebuttondivBasicInfo = true;
    this.editbuttondivBasicInfo = false;
    this.getCompanyBasicInformation();
    this.cancelAddressInformationSave();
  }

  saveAddressInformation() {
    if (this.organizationAddressInfoForm.valid) {
      this.isValidFormSubmitted = true;
      const body = this.organizationAddressInfoForm.value;

      body.city = body.city.value;
      body.country = body.country.value;
      body.state = body.state.value;
      console.log(body);
      this.serviceApi.put('/v1/organization/orgAddress/' + body.orgAddressId, body).subscribe(
        res => {
          console.log('resposne --> ' + res);
          this.successNotification(res.message);
        }, error => {
          // error = error.json();
          console.log('err -->' + error);
          // this.warningNotification(error.message);
        }, () => {
          this.getCompanyAddressInformation();
          this.cancelCompanyInformationSave();
          // this.getCompanyAddressInformation();
          // this.hideSaveandCancleButtonOfOrgAddressInfo(false);
          // this.hideSaveandCancleButtonAddresInf();

        });
    } else {
      Object.keys(this.organizationAddressInfoForm.controls).forEach(field => { // {1}
        const control = this.organizationAddressInfoForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }
  openleftPan() {
    this.selectedRow = undefined;
    this.isLeftVisible = !this.isLeftVisible;
    this.getCompanyBasicInformation();
    this.getCompanyAddressInformation();
    this.setPanel();

  }

  cancelAddressInformationSave() {
    this.getCompanyAddressInformation();
    this.hideSaveandCancleButtonOfOrgAddressInfo(false);
  }

  cancelCompanyInformationSave() {
    this.hideSaveandCancleButtonOfOrgBasicInfo(false);
  }
  cancelCompanyStatutoryInformation() {
    this.getCompanyBasicInformation();
    this.hideSaveandCancleButtonOfStatutoryInfo(false);
  }
  saveBasicInformation(type) {
    console.log(this.BasicInformationOfOrganization.controls.Form16Date.value);

    if (type === "basic") {
      if (this.BasicInformationOfOrganization.controls.CompanyName.valid && this.BasicInformationOfOrganization.controls.ContactNumber.valid && this.BasicInformationOfOrganization.controls.HeadOfficeAddress.valid) {
        this.isValidFormSubmitted = true;
        const body = {
          'companyName': this.BasicInformationOfOrganization.controls.CompanyName.value,
          'contactPerson': this.BasicInformationOfOrganization.controls.contactPerson.value,
          'contactNumber': this.BasicInformationOfOrganization.controls.ContactNumber.value,
          'headOfficeAddress': this.BasicInformationOfOrganization.controls.HeadOfficeAddress.value,
        };

        this.serviceApi.put('/v1/organization/orgBasicInfo/' + this.basicInfoId, body).subscribe(
          res => {
            console.log('resposne --> ' + JSON.stringify(res));
            this.successNotification(res.message);
          }, error => {
            error = error.json();
            console.log('err -->' + error);
            this.warningNotification(error.message);
          }, () => {
            this.getCompanyBasicInformation();
            // this.setFormValue(this.selectedRow);
            this.hideSaveandCancleButtonOfOrgBasicInfo(false);
            this.getCompanyBasicInformation();
          });
      } else {
        this.BasicInformationOfOrganization.controls.CompanyName.markAsTouched({ onlySelf: true });
        this.BasicInformationOfOrganization.controls.contactPerson.markAsTouched({ onlySelf: true });
        this.BasicInformationOfOrganization.controls.ContactNumber.markAsTouched({ onlySelf: true });
        this.BasicInformationOfOrganization.controls.HeadOfficeAddress.markAsTouched({ onlySelf: true });

      }
    }

    if (type === "statutory") {
      if (this.BasicInformationOfOrganization.controls.PanNumber.valid && this.BasicInformationOfOrganization.controls.gstIn.valid && this.BasicInformationOfOrganization.controls.InvestmentMonth.valid && this.BasicInformationOfOrganization.controls.ESICStatus.valid
        && this.BasicInformationOfOrganization.controls.TanNumber.valid && this.BasicInformationOfOrganization.controls.Form16Date.valid && this.BasicInformationOfOrganization.controls.PFStatus.valid) {
        this.isValidFormSubmitted = true;
        const body = {
          'panNumber': this.BasicInformationOfOrganization.controls.PanNumber.value,
          'gstIn': this.BasicInformationOfOrganization.controls.gstIn.value,
          'investmentDeclarationsMonth': this.BasicInformationOfOrganization.controls.InvestmentMonth.value,
          'tanNumber': this.BasicInformationOfOrganization.controls.TanNumber.value,
          'isESICRegistered': this.BasicInformationOfOrganization.controls.ESICStatus.value,
          'isPFRegistered': this.BasicInformationOfOrganization.controls.PFStatus.value,
          'issueForm16sMonth': this.BasicInformationOfOrganization.controls.Form16Date.value,
        };

        this.serviceApi.put('/v1/organization/orgBasicInfo/' + this.basicInfoId, body).subscribe(
          res => {
            console.log('resposne --> ' + JSON.stringify(res));
            this.successNotification("Statutory details saved successfully.");
          }, error => {
            error = error.json();
            console.log('err -->' + error);
            this.warningNotification(error.message);
          }, () => {
            this.getCompanyBasicInformation();
            // this.setFormValue(this.selectedRow);
            this.hideSaveandCancleButtonOfStatutoryInfo(false);
            this.getCompanyBasicInformation();
          });
      } else {
        this.BasicInformationOfOrganization.controls.PanNumber.markAsTouched({ onlySelf: true });
        this.BasicInformationOfOrganization.controls.gstIn.markAsTouched({ onlySelf: true });
        this.BasicInformationOfOrganization.controls.InvestmentMonth.markAsTouched({ onlySelf: true });
        this.BasicInformationOfOrganization.controls.TanNumber.markAsTouched({ onlySelf: true });
        this.BasicInformationOfOrganization.controls.ESICStatus.markAsTouched({ onlySelf: true });
        this.BasicInformationOfOrganization.controls.PFStatus.markAsTouched({ onlySelf: true });
        this.BasicInformationOfOrganization.controls.Form16Date.markAsTouched({ onlySelf: true });

      }

    }


  }

  hideSaveandCancleButtonOfOrgAddressInfo(fieldReadable) {
    this.addreadonly = true;
    this.addreadwrite = false;
    this.editbuttondivAddressInfo = true;
    this.saveandcanclebuttondivAddressInfo = true;
    this.editbuttondivAddressInfo = true;
    this.saveandcanclebuttondivAddressInfo = false;
  }

  hideSaveandCancleButtonOfOrgBasicInfo(fieldReadable) {
    this.readwrite = false;
    this.readonly = true;
    this.prfesionalradiohideshow = false;
    this.incomeradiohideshow = false;
    this.lwfradiohideshow = false;
    this.pfradiohideshow = false;
    this.esicradiohideshow = false;
    this.lwfradiohideshow = false;
    this.npsradiohideshow = false;
    this.saveandcanclebuttondivBasicInfo = false;
    this.editbuttondivBasicInfo = true;
  }

  hideSaveandCancleButtonOfStatutoryInfo(fieldReadable) {
    this.Statutoryreadwrite = false;
    this.statutoryreadonly = true;
    this.prfesionalradiohideshow = false;
    this.incomeradiohideshow = false;
    this.lwfradiohideshow = false;
    this.pfradiohideshow = false;
    this.esicradiohideshow = false;
    this.lwfradiohideshow = false;
    this.npsradiohideshow = false;
    this.saveandcanclebuttondivStatutoryInfo = false;
    this.editbuttondivStatutoryInfo = true;
  }
  hideSaveandCancleButtonAddresInf() {
    this.addreadonly = true;
    this.addreadwrite = false;
    this.editbuttondivAddressInfo = true;
    this.saveandcanclebuttondivAddressInfo = true;
    this.editbuttondivAddressInfo = true;
    this.saveandcanclebuttondivAddressInfo = false;
  }


  editAddressInfo(fieldEditable: any) {
    this.addreadonly = false;
    this.addreadwrite = true;
    this.StatedisableSelect = false;
    this.editbuttondivAddressInfo = false;
    this.saveandcanclebuttondivAddressInfo = true;
    this.getStateInformation(this.organizationAddressInfoForm.controls.country.value.value);
    this.getCityInformation(this.organizationAddressInfoForm.controls.state.value.value);
  }


}

@Component({
  templateUrl: 'add-update-company-profile.html',
})
export class AddUpdateCompanyProfileComponent implements OnInit {
  action: String;
  message: any;
  error: any;
  companyProfileFormGroup: FormGroup;
  constructor(public dialogRef: MatDialogRef<AddUpdateCompanyProfileComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService, private _fb: FormBuilder) {
    this.companyProfileFormGroup = this._fb.group({
      "companyName": [null, Validators.required],
      "companyId": [0]
    });
    if (data != undefined) {
      // this.companyProfileFormGroup.controls.basicInfoId.setValue(data.basicInfoId);
      // this.companyProfileFormGroup.controls.companyName.setValue(data.companyName);
    }
  }
  ngOnInit() {

  }
  close(): void {
    this.data.message = this.message;
    this.dialogRef.close(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createSubDepartment() {
    if (this.companyProfileFormGroup.valid) {
      const body = {
        "captureEmployeeMood": false,
        "orgProfileId": 0,
        "organizationBasicInfo": {
          "basicInfoId": 0,
          "companyId": this.companyProfileFormGroup.controls.companyId.value,
          "companyName": this.companyProfileFormGroup.controls.companyName.value,
          "isESICRegistered": false,
          "isPFRegistered": false
        },
        "organizationAddress": {
          "orgAddressId": 0
        },
        "parent": false
      }
      this.serviceApi.post("/v1/organization/", body).subscribe(res => {
        this.message = res.message;
      }, (err) => {
        console.log('Something gone Wrong');
        console.log('err -->' + err);
        // this.warningNotification(err.message);
      }, () => {
        this.close();

      });
    } else {
      Object.keys(this.companyProfileFormGroup.controls).forEach(field => { // {1}
        const control = this.companyProfileFormGroup.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }

  updateSubDepartment() {
    if (this.companyProfileFormGroup.valid) {
      this.serviceApi.put("/v1/organization/sub-department/" + this.companyProfileFormGroup.controls.basicInfoId.value, this.companyProfileFormGroup.value).subscribe(res => {
        if (res != null) {
          this.message = res.message;
          this.close();
        }
      }, err => {
        console.log('Something gone Wrong');
        console.log('err -->' + err);
        // this.warningNotification(err.message);
      }, () => {

      });
    } else {
      Object.keys(this.companyProfileFormGroup.controls).forEach(field => { // {1}
        const control = this.companyProfileFormGroup.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }

}


@Component({
  templateUrl: 'delete-company-profile.html',
})
export class DeleteCompanyProfileComponent implements OnInit {
  message: any;
  constructor(public dialogRef: MatDialogRef<DeleteCompanyProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    console.log(this.data);
  }
  deleteCompany() {
    this.serviceApi.delete('/v1/organization/' + this.data.orgProfileId).subscribe(
      res => {
        console.log('Department Delete Saved...' + JSON.stringify(res));
        if (res != null) {
          this.message = res.message;
          this.close();
        } else {
        }
      }, err => {
        console.log('Something gone Wrong');
        console.log('err -->' + err);
        // this.warningNotification(err.message);
      }, () => {
        // this.getAllCategories();
      });

  }
  ngOnInit() {
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
  selector: 'subOrganization-image-cropper.component',
  templateUrl: 'subOrganization-image-cropper.component.html',
})
export class SubOrganizationImageCropperComponent implements OnInit {
  imageChangedEvent: any = '';
  error = 'Error Message';
  action: any;
  showCropper = false;
  croppedImage: any = '';
  ngOnInit() { }
  constructor(public dialogRef: MatDialogRef<SubOrganizationImageCropperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(data);
    this.imageChangedEvent = data.event;
  }
  close(): void {
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.data.base64 = event.base64
    this.data.croppedFile = event.file
    console.log(event);
  }
  imageLoaded() {
    this.showCropper = true;
    console.log('Image loaded')
  }
  cropperReady() {
    console.log('Cropper ready')
  }
  loadImageFailed() {
    console.log('Load failed');
  }
}


