import { Component, OnInit, OnDestroy, Inject, Input, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { MatSelect } from '@angular/material';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Http } from '@angular/http';
import { KeycloakService } from '../../../../../keycloak/keycloak.service';
import { environment } from '../../../../../../environments/environment';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { ValidationMessagesService } from '../../../../../validation-messages.service';
import { DataTable } from 'primeng/primeng';
import { element } from '@angular/core/src/render3/instructions';
declare var $: any;
@Component({
  selector: 'app-org-locations',
  templateUrl: './org-locations.component.html',
  styleUrls: ['./org-locations.component.scss']
})
export class OrgLocationsComponent implements OnInit {
  @ViewChild("dt1") dt: DataTable;
  refreshTable = true;
  locationId: number;
  city: string;
  state: string;
  pfRegistrationCode: string;
  esicRegistrationCode: string;
  professionalTaxRegistrationCode: string;
  lwfRegistrationCode: string;
  baseUrl = environment.baseUrl;
  notificationMsg: any;
  action: any;
  public data: any;
  searchValue = new FormControl();
  someData = [];
  employeeList: any = [];
  // displayedColumns = ['country', 'state', 'city', 'pfRegistrationCode', 'esicRegistrationCode',
  //   'professionalTaxRegistrationCode', 'lwfRegistrationCode', 'action'];
  organizationInfo: any = [];

  columns = [
    { field: 'locationCode', header: 'Location Code' },
    { field: 'countryName', header: 'Country' },
    { field: 'stateName', header: 'State' },
    { field: 'cityName', header: 'City' },
    { field: 'organizations', header: 'Organizations' },
    { field: 'pfRegistrationCode', header: 'PF Registration Code' },
    { field: 'esicRegistrationCode', header: 'ESIC Registration Code' },
    { field: 'professionalTaxRegistrationCode', header: 'Professional Tax Registration Code' },
    { field: 'lwfRegistrationCode', header: 'LWF Registration Code' },
    { field: 'action', header: 'Actions' }
  ];



  dataSource: MatTableDataSource<UserData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(public dialog: MatDialog, private http: Http, private serviceApi: ApiCommonService,
    private validationMessagesService: ValidationMessagesService) {

    const rolesArr = KeycloakService.getUserRole();
  }

  ngOnInit() {
    this.getAllLocation();
    this.getOrganizations();
    this.getEmployeeList();
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
  resetFormControlValueOnLoad() {
    this.searchValue.reset();
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
  getAllLocation() {
    this.someData = [];
    this.serviceApi.get2('/v1/organization/orgLocations').subscribe(
      res => {
        res.forEach(element => {
          let organizations = [];
          if (element.organizations != null) {
            element.organizations.forEach(element => {
              organizations.push(
                element.companyName
              );
            });
          }

          this.someData.push({
            'countryName': element.countryName,
            'companyId': element.companyId,
            'orgProfileId': element.orgProfileId,
            'countryId': element.countryId,
            'locationId': element.locationId,
            'locationCode': element.locationCode.toUpperCase(),
            'cityId': element.cityId,
            'cityName': element.cityName,
            'stateId': element.stateId,
            'stateName': element.stateName,
            'pfRegistrationCode': element.pfRegistrationCode,
            'esicRegistrationCode': element.esicRegistrationCode.toUpperCase(),
            'professionalTaxRegistrationCode': element.proTaxRegistrationCode,
            'lwfRegistrationCode': element.lwfRegistrationCode,
            'organizations': organizations,
            'organizationObjectList': element.organizations,
            'taxDeclarationSupervisorList': element.taxDeclarationSupervisorList
          });
        });
      }, error => {
        console.log('err -->' + error);
      }, () => {
        this.dt.reset();
      }
    );
  }
  getOrganizations() {
    this.organizationInfo = []
    this.serviceApi.get('/v1/organization/orgProfileInfo').
      subscribe(
      res => {
        res.forEach(element => {
          this.organizationInfo.push({
            orgProfileId: element.orgProfileId,
            companyName: element.organizationBasicInfo.companyName,
          });
        });
      });
  }
  openDialog(): void {
    this.notificationMsg = '';
    this.action = '';
    const dialogRef = this.dialog.open(LocationDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { message: this.notificationMsg, status: this.action, organizationInfo: this.organizationInfo, employeeList: this.employeeList }
    });
    dialogRef.afterClosed().subscribe(result => {
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
          this.getAllLocation();
        }

      }
    });
  }
  modifyLocationDialog(data: any) {
      this.notificationMsg = '';
      this.action = '';
      console.log('modifyLocationDialog-->' + data);
      const dialogRef = this.dialog.open(ModifyLocationDialogComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: {
          locationId: data.locationId,
          orgProfileId: data.orgProfileId,
          country: data.countryId,
          city: data.cityId,
          state: data.stateId,
          pfRegistrationCode: data.pfRegistrationCode,
          esicRegistrationCode: data.esicRegistrationCode,
          professionalTaxRegistrationCode: data.professionalTaxRegistrationCode,
          lwfRegistrationCode: data.lwfRegistrationCode,
          message: this.notificationMsg,
          status: this.action,
          companyId: data.companyId,
          locationCode: data.locationCode,
          organizationInfo: this.organizationInfo,
          organizations: data.organizationObjectList,
          employeeList: this.employeeList,
          taxDeclarationSupervisorList: data['taxDeclarationSupervisorList']
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          // console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            console.log('Result value ..... ' + result.message);
            if (result.status === 'Response') {
              this.notificationMsg = result.message;
              this.successNotification(this.notificationMsg);
            } else if (result.status === 'Error') {
              this.notificationMsg = result.message;
              // this.warningNotification(this.notificationMsg);
            }
            this.getAllLocation();
          }

        }
      });
  }

  deleteLocation(data: any) {
      this.notificationMsg = '';
      this.action = '';
      const dialogRef = this.dialog.open(DeleteLocationDialogComponent, {
        // width: '500px',
        panelClass: 'custom-dialog-container',
        data: {
          locationId: data.locationId,
          orgProfileId: data.orgProfileId,
          city: data.city,
          state: data.state,
          pfRegistrationCode: data.pfRegistrationCode,
          esicRegistrationCode: data.esicRegistrationCode,
          professionalTaxRegistrationCode: data.professionalTaxRegistrationCode,
          lwfRegistrationCode: data.lwfRegistrationCode,
          message: this.notificationMsg,
          locationCode: data.locationCode,
          organizationInfo: this.organizationInfo,
          organizations: data.organizations,
          status: this.action
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
            } else if (result.status === 'Error') {
              this.notificationMsg = result.message;
              // this.warningNotification(this.notificationMsg);
            }
            this.getAllLocation();
          }

        }
      });
  }
}


@Component({
  selector: 'app-location-dialog',
  templateUrl: 'location-dialog-component.html',
  styleUrls: ['./location-dialog-component.scss']
})
export class LocationDialogComponent implements OnInit, AfterViewInit, OnDestroy {

  baseUrl = environment.baseUrl;
  countryList: any[];
  stateList: any[];
  cityList: any[];
  locationDialog: FormGroup;
  error = 'Error Message';
  action: any;
  countryID = "1"
  isValidFormSubmitted = true;
  requiredTextField;
  requiredDropdownButton;
  companyId: any;
  companyName: any;
  organizationInfo: any[];
  organizations;
  public countryFilterCtrl: FormControl = new FormControl();
  public stateFilterCtrl: FormControl = new FormControl();
  public cityFilterCtrl: FormControl = new FormControl();


  public filteredCountries: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredStates: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredCities: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  @ViewChild('singleSelect1') singleSelect1: MatSelect;
  @ViewChild('singleSelect2') singleSelect2: MatSelect;
  @ViewChild('singleSelect3') singleSelect3: MatSelect;
  employeeList = [];
  protected _onDestroy = new Subject<void>();

  ngOnInit() {
    this.getCompanyId();
    this.getCountries();
    // this.locationDialog.controls.country.setValue([]);
    this.countryFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        // this.filterCountries();
        this.filter(this.countryList, this.countryFilterCtrl, this.filteredCountries);
      });
    this.stateFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        // this.filterStates();
        this.filter(this.stateList, this.stateFilterCtrl, this.filteredStates);
      });
    this.cityFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        // this.filterCities();
        this.filter(this.cityList, this.cityFilterCtrl, this.filteredCities);
      });
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected setInitialValue() {
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




  // protected filterCountries() {
  //   if (!this.countryList) {
  //     return;
  //   }
  //   // get the search keyword
  //   let search = this.countryFilterCtrl.value;
  //   if (!search) {
  //     this.filteredCountries.next(this.countryList.slice());
  //     return;
  //   } else {
  //     search = search.toLowerCase();
  //   }
  //   // filter the countries
  //   this.filteredCountries.next(
  //     this.countryList.filter(bank => bank.viewValue.toLowerCase().indexOf(search) > -1)
  //   );
  // }
  // protected filterStates() {
  //   if (!this.stateList) {
  //     return;
  //   }
  //   // get the search keyword
  //   let search = this.stateFilterCtrl.value;
  //   if (!search) {
  //     this.filteredStates.next(this.stateList.slice());
  //     return;
  //   } else {
  //     search = search.toLowerCase();
  //   }
  //   // filter the states
  //   this.filteredStates.next(
  //     this.stateList.filter(bank => bank.viewValue.toLowerCase().indexOf(search) > -1)
  //   );
  // }
  // protected filterCities() {
  //   if (!this.cityList) {
  //     return;
  //   }
  //   // get the search keyword
  //   let search = this.cityFilterCtrl.value;
  //   if (!search) {
  //     this.filteredCities.next(this.cityList.slice());
  //     return;
  //   } else {
  //     search = search.toLowerCase();
  //   }
  //   // filter the cities
  //   this.filteredCities.next(
  //     this.cityList.filter(bank => bank.viewValue.toLowerCase().indexOf(search) > -1)
  //   );
  // }
  constructor(
    private _fb: FormBuilder, public serviceApi: ApiCommonService,
    public dialogRef: MatDialogRef<LocationDialogComponent>,
    private http: Http,
    @Inject(MAT_DIALOG_DATA) public data: any, private validationMessagesService: ValidationMessagesService) {
    this.employeeList = this.data.employeeList;
    console.log(this.data);
    this.validationMessagesService.currentRequiredTextField.subscribe(message => this.requiredTextField = message);
    this.validationMessagesService.currentRequiredDropdownButton.subscribe(message => this.requiredDropdownButton = message);
    this.organizationInfo = this.data.organizationInfo;
    this.locationDialog = this._fb.group({
      locationId: [],
      locationCode: ['', Validators.required],
      orgProfileId: [],
      country: ['', [Validators.required,]],
      city: ['', [Validators.required,]],
      state: ['', Validators.required],
      pfRegistrationCode: [''],
      esicRegistrationCode: [''],
      professionalTaxRegistrationCode: [''],
      lwfRegistrationCode: [''],
      organizations: [null],
      selectedEmployee: []
    });
  }
  getCountries() {
    this.countryList = []
    this.serviceApi.get2('/v1/organization/country').subscribe(
      res => {
        res.forEach(element => {
          this.countryList.push({
            value: element.countryId,
            viewValue: element.countryName
          })
        });
      }, error => {
        console.log('err -->' + error);
      },
      () => {
        this.filteredCountries.next(this.countryList.slice());
      });
  }
  getStates(country) {
    this.stateList = [];
    this.cityList = [];
    this.locationDialog.controls.state.patchValue('');
    this.locationDialog.controls.state.markAsTouched({ onlySelf: true });
    this.locationDialog.controls.city.patchValue('');
    this.locationDialog.controls.city.markAsTouched({ onlySelf: true });
    this.serviceApi.get2('/v1/organization/state/' + country.value).subscribe(
      res => {
        res.forEach(element => {
          this.stateList.push({
            value: element.stateId,
            viewValue: element.stateName
          })
        });
      }, error => {
        console.log('err -->' + error);
      },
      () => {
        this.filteredStates.next(this.stateList.slice());
      });
  }
  getCompanyId() {
    this.companyId = '';
    this.serviceApi.get2('/v1/organization/orgProfileInfo').subscribe(
      res => {
        this.companyId = res[0].organizationAddress.companyId;
      },
      (err) => {
        console.log("Error in fetchinh company Id")
      },
      () => {

      }
    );
  }
  getCities(state) {
    this.cityList = [];
    this.locationDialog.controls.city.patchValue('');
    this.locationDialog.controls.city.markAsTouched({ onlySelf: true });
    this.serviceApi.get2('/v1/organization/city/' + state.value).subscribe(
      res => {
        res.forEach(element => {
          this.cityList.push({
            value: element.cityId,
            viewValue: element.cityName
          })
        });
      }, error => {
        console.log('err -->' + error);
      },
      () => {
        this.filteredCities.next(this.cityList.slice());
      });
  }

  saveLocation() {
    if (this.locationDialog.valid) {
      let taxDeclarationSupervisor = [];
      this.locationDialog.controls.selectedEmployee.value.forEach(element => {
        taxDeclarationSupervisor.push({
          "empCode": element
        });
      });
      this.isValidFormSubmitted = true;
      const body = {
        'country': this.locationDialog.controls.country.value.value,
        'state': this.locationDialog.controls.state.value.value,
        'city': this.locationDialog.controls.city.value.value,
        'companyId': this.companyId,
        'orgProfileId': this.locationDialog.controls.orgProfileId.value,
        'organizations': this.locationDialog.controls.organizations.value,
        'esicRegistrationCode': this.locationDialog.controls.esicRegistrationCode.value.toUpperCase(),
        'locationId': 0,
        'locationCode': this.locationDialog.controls.locationCode.value,
        'lwfRegistrationCode': this.locationDialog.controls.lwfRegistrationCode.value.toUpperCase(),
        'pfRegistrationCode': this.locationDialog.controls.pfRegistrationCode.value.toUpperCase(),
        'proTaxRegistrationCode': this.locationDialog.controls.professionalTaxRegistrationCode.value.toUpperCase(),
        'taxDeclarationSupervisor': taxDeclarationSupervisor
      };

      console.log(JSON.stringify(body));
      this.serviceApi.post('/v1/organization/orgLocation', body).subscribe(
        res => {
          console.log('Successfull ...' + JSON.stringify(res));
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
      Object.keys(this.locationDialog.controls).forEach(field => { // {1}
        const control = this.locationDialog.get(field);            // {2}
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
  selector: 'app-modify-location-dialog',
  templateUrl: 'modify-location-dialog-component.html',
  styleUrls: ['./modify-location-dialog-component.scss']
})
export class ModifyLocationDialogComponent implements OnInit {

  baseUrl = environment.baseUrl;
  stateLists = [];
  locationDialog: FormGroup;
  error = 'Error Message';
  action: any;
  isValidFormSubmitted = true;
  requiredTextField;
  requiredDropdownButton;
  countryList: any[];
  stateList: any[];
  cityList: any[];
  organizationInfo: any[];
  public countryFilterCtrl: FormControl = new FormControl();
  public stateFilterCtrl: FormControl = new FormControl();
  public cityFilterCtrl: FormControl = new FormControl();


  public filteredCountries: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredStates: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredCities: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  @ViewChild('singleSelect1') singleSelect1: MatSelect;
  @ViewChild('singleSelect2') singleSelect2: MatSelect;
  @ViewChild('singleSelect3') singleSelect3: MatSelect;
  employeeList: any = [];
  protected _onDestroy = new Subject<void>();


  ngOnInit() {
    this.getCountries();
    this.getStates(this.data.country);
    this.getCities(this.data.state);
    this.locationDialog.controls.country.patchValue({ value: +this.data.country })
    this.locationDialog.controls.state.patchValue({ value: +this.data.state })
    this.locationDialog.controls.city.patchValue({ value: +this.data.city })
    // this.locationDialog.controls.country.setValue([]);
    this.countryFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        // this.filterCountries();
        this.filter(this.countryList, this.countryFilterCtrl, this.filteredCountries);
      });
    this.stateFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        // this.filterStates();
        this.filter(this.stateList, this.stateFilterCtrl, this.filteredStates);
      });
    this.cityFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        // this.filterCities();
        this.filter(this.cityList, this.cityFilterCtrl, this.filteredCities);
      });
  }



  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected setInitialValue() {
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




  constructor(
    private _fb: FormBuilder, private serviceApi: ApiCommonService,
    public dialogRef: MatDialogRef<ModifyLocationDialogComponent>,
    private http: Http,
    @Inject(MAT_DIALOG_DATA) public data: any, private validationMessagesService: ValidationMessagesService) {
    console.log(data);
    this.employeeList = data.employeeList;
    this.validationMessagesService.currentRequiredTextField.subscribe(message => this.requiredTextField = message);
    this.validationMessagesService.currentRequiredDropdownButton.subscribe(message => this.requiredDropdownButton = message);
    this.organizationInfo = this.data.organizationInfo;
    var selectedEmployee = [];
    data.taxDeclarationSupervisorList.forEach(element => {
      selectedEmployee.push(element.empCode);
    });
    this.locationDialog = this._fb.group({
      locationId: [data.locationId],
      locationCode: [data.locationCode, [Validators.required]],
      orgProfileId: [data.orgProfileId],
      country: [data.country, [Validators.required]],
      state: [data.state, [Validators.required]],
      city: [data.city, [Validators.required]],
      pfRegistrationCode: [data.pfRegistrationCode],
      esicRegistrationCode: [data.esicRegistrationCode],
      professionalTaxRegistrationCode: [data.professionalTaxRegistrationCode],
      lwfRegistrationCode: [data.lwfRegistrationCode],
      selectedEmployee: [selectedEmployee, Validators.required],
      organizations: [data.organizations]
    });
  }
  getCountries() {
    this.countryList = []
    this.serviceApi.get2('/v1/organization/country').subscribe(
      res => {
        res.forEach(element => {
          this.countryList.push({
            value: element.countryId,
            viewValue: element.countryName
          })
        });
      }, error => {
        console.log('err -->' + error);
      },
      () => {
        this.filteredCountries.next(this.countryList.slice());
      });
  }

  getStates(countryId) {
    console.log(countryId)
    this.stateList = [];
    this.cityList = [];
    this.locationDialog.controls.state.patchValue('');
    this.locationDialog.controls.state.markAsTouched({ onlySelf: true });
    this.locationDialog.controls.city.patchValue('');
    this.locationDialog.controls.city.markAsTouched({ onlySelf: true });
    this.serviceApi.get2('/v1/organization/state/' + countryId).subscribe(
      res => {
        res.forEach(element => {
          this.stateList.push({
            value: element.stateId,
            viewValue: element.stateName
          })
        });
      }, error => {
        console.log('err -->' + error);
      },
      () => {
        this.filteredStates.next(this.stateList.slice());
      });

  }

  getCities(stateId) {
    this.cityList = [];
    this.locationDialog.controls.city.patchValue('');
    this.locationDialog.controls.city.markAsTouched({ onlySelf: true });
    this.serviceApi.get2('/v1/organization/city/' + stateId).subscribe(
      res => {
        res.forEach(element => {
          this.cityList.push({
            value: element.cityId,
            viewValue: element.cityName
          })
        });
      }, error => {
        console.log('err -->' + error);
      },
      () => {
        this.filteredCities.next(this.cityList.slice());
      });

  }
  modifyLocation() {
    if (this.locationDialog.valid) {
      let taxDeclarationSupervisor = [];
      this.locationDialog.controls.selectedEmployee.value.forEach(element => {
        taxDeclarationSupervisor.push({
          "empCode": element
        });
      });
      this.isValidFormSubmitted = true;
      const body = {
        'companyId': this.data.companyId,
        'esicRegistrationCode': this.locationDialog.controls.esicRegistrationCode.value,
        'locationId': this.locationDialog.controls.locationId.value,
        'locationCode': this.locationDialog.controls.locationCode.value,
        'lwfRegistrationCode': this.locationDialog.controls.lwfRegistrationCode.value.toUpperCase(),
        'pfRegistrationCode': this.locationDialog.controls.pfRegistrationCode.value.toUpperCase(),
        'proTaxRegistrationCode': this.locationDialog.controls.professionalTaxRegistrationCode.value.toUpperCase(),
        'state': this.locationDialog.controls.state.value.value,
        'country': this.locationDialog.controls.country.value.value,
        'city': this.locationDialog.controls.city.value.value,
        'orgProfileId': this.locationDialog.controls.orgProfileId.value,
        'organizations': this.locationDialog.controls.organizations.value,
        'taxDeclarationSupervisor': taxDeclarationSupervisor
      };
      console.log('body -->' + body);
      this.serviceApi.put('/v1/organization/orgLocation/' + this.data.locationId, body).subscribe(
        res => {
          console.log('Successfull ...' + JSON.stringify(res));
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
      Object.keys(this.locationDialog.controls).forEach(field => { // {1}
        const control = this.locationDialog.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }
  compareObjects(o1: any, o2: any) {
    return o1 && o2 ? o1.value === o2.value : o1 === o2;
  }
  compareOrg(o1: any, o2: any) {
    return o1 && o2 ? o1.orgProfileId === o2.orgProfileId : o1 === o2;
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
  selector: 'app-delete-location-dialog',
  templateUrl: 'delete-location-dialog-component.html',
  styleUrls: ['./delete-location-dialog-component.scss']
})
export class DeleteLocationDialogComponent {
  baseUrl = environment.baseUrl;
  error = 'Error Message';
  action: any;
  constructor(
    private _fb: FormBuilder, private serviceApi: ApiCommonService,
    public dialogRef: MatDialogRef<DeleteLocationDialogComponent>,
    private http: Http,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('data-->' + data);
  }

  deleteLocation() {
    console.log('locationIdlocationId -->' + this.data.locationId);
    this.serviceApi.delete('/v1/organization/orgLocation/' + this.data.locationId).subscribe(
      res => {
        console.log('Delete Successfull ...' + JSON.stringify(res));
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

  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close(this.data);
  }
}
export interface UserData {
  countryId: string
  countryName: string
  locationId: number;
  orgProfileId: number;
  cityId: string;
  cityName: string;
  stateId: string;
  stateName: string;
  pfRegistrationCode: string;
  esicRegistrationCode: string;
  professionalTaxRegistrationCode: string;
  lwfRegistrationCode: string;
  companyId: string;
}
let someData: UserData[] = [];

