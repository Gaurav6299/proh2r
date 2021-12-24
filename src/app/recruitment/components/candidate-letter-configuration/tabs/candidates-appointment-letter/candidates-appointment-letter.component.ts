import { Component, OnInit, Inject, Input, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { SelectionModel } from '@angular/cdk/collections';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { KeycloakService } from '../../../../../keycloak/keycloak.service';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { element } from 'protractor';
declare var $: any;

@Component({
  selector: 'app-candidates-appointment-letter',
  templateUrl: './candidates-appointment-letter.component.html',
  styleUrls: ['./candidates-appointment-letter.component.scss']
})
export class CandidatesAppointmentLetterComponent implements OnInit {

  showHideFilter = false;

  // 'select',
  displayedColumns = ['canName', 'canEmail', 'canPhone',
    'canExp', 'canSkills', 'canRegDate', 'canStatus', 'actions'];
  dataSource1: MatTableDataSource<Element>;
  selection = new SelectionModel<Element>(true, []);
  candidateApplicationsInfo = [];

  status: any;
  errorMessage: any;
  action: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  notificationMsg: any;

  panelFirstWidth: any;
  panelFirstHeight: any;
  isLeftVisible: any;
  existGeneratedLetterList =[];
  letterTamplateList = [];
  locationArrayList = [];
  generateLetterForm: FormGroup;
  constructor(public dialog: MatDialog, private fb: FormBuilder, private http: Http, private serviceApi: ApiCommonService,
  private router: Router) {
    const rolesArr = KeycloakService.getUserRole();
  }
  successNotification(successMessage: any) {
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

  ngOnInit() {
    this.getAllSelectedCandidate();
    this.getGeneratedLettersRecord();
    this.getLetter();
    this.getAllLocationList();
    this.setPanel();
    this.dataSource1 = new MatTableDataSource<Element>(ELEMENT_DATA);
    this.generateLetterForm = this.fb.group({
      candidateOfferLetterId: [],
      candidateDetailsId: [],
      candidateName: [],
      candidateAppointmentLetterTemplateId: [''],
      candidateContactNo: [],
      candidateEmailAddr: [],
      candidateExperience: [],
      candidateJoiningDate: [],
      candidateDesignation: [],
      candidateSalary: [],
      candidateWorkLocation: []
    });

  }


  getLetter() {
    this.letterTamplateList = [];
    this.serviceApi.get('/v1/documents/lettertemplates/letterTemplate').
      subscribe(
      res => {
        res.forEach(element => {
          this.letterTamplateList.push({
            letterTemplateId: element.letterTemplateId,
            letterHeaderTemplate: element.letterHeaderTemplate,
            letterFooterTemplate: element.letterFooterTemplate,
            templateLabel: element.templateLabel,
            createdOn: element.createdDate,
            lastUpdatedOn: element.modifiedDate,
            actions: ''
          });
        });
      }, () => {
        console.log('Enter into Else Bloack');
      });
  }

  getAllLocationList() {
    this.locationArrayList = [];
    this.serviceApi.get('/v1/organization/orgLocation').
      subscribe(
      res => {
        res.forEach(element => {
          this.locationArrayList.push({
            locationId: element.locationId,
            companyId: element.companyId,
            state: element.state,
            city: element.city,
            pfRegistrationCode: element.pfRegistrationCode,
            esicRegistrationCode: element.esicRegistrationCode,
            proTaxRegistrationCode: element.proTaxRegistrationCode,
            lwfRegistrationCode: element.lwfRegistrationCode
          });
        });
      }, () => {
        console.log('Enter into Else Bloack');
      });
  }

  getAllSelectedCandidate() {
    this.candidateApplicationsInfo = [];
    const candidateStatus = 'SELECTED';
    this.serviceApi.get('/v1/recruitment/candidates/' + candidateStatus).
      subscribe(
      res => {
        res.forEach(element => {
          this.candidateApplicationsInfo.push({
            canID: element.id,
            canName: element.cndFirstName,
            canEmail: element.cndEmail,
            canPhone: element.cndMobileNo,
            canExp: element.canExperienceInYear,
            canSkills: element.canSkillSets,
            canLocation: element.cndCity,
            canRegDate: element.canRegistrationDate,
            canResume: element.canResumeId,
            canStatus: element.canStatus
          });
        });
        this.dataSource1 = new MatTableDataSource(this.candidateApplicationsInfo);
        this.dataSource1.paginator = this.paginator;
        this.dataSource1.sort = this.sort;
      },
      err => {
        if (err.status === 404 || err.statusText === 'OK') {
          this.candidateApplicationsInfo = [];
          this.dataSource1 = new MatTableDataSource(this.candidateApplicationsInfo);
          this.dataSource1.paginator = this.paginator;
          this.dataSource1.sort = this.sort;
        }
      });
  }


  getGeneratedLettersRecord() {
    this.existGeneratedLetterList = [];
    this.serviceApi.get('/v1/recruitment/generate/offer-letter/').subscribe(
      res => {
        console.log(res);
        res.forEach(element => {
          this.existGeneratedLetterList.push(element);
        });
      }, err => {
      }, () => {
        console.log(this.existGeneratedLetterList);
      });

  }
  setPanel() {
    if ($('.divtoggleDiv').length > 0) {
      $('.divtoggleDiv')[1].style.display = 'none';
      $('.divtoggleDiv').width(this.panelFirstWidth);
    }
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    // this.dataSource1 = new MatTableDataSource<Element>(ELEMENT_DATA);
    this.setPanel();
    this.dataSource1.paginator = this.paginator;
    this.dataSource1.sort = this.sort;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource1.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource1.data.forEach(row => this.selection.select(row));
  }
  applyFilter(filterValue: string) {
    console.log('hello' + filterValue);
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource1.filter = filterValue;
  }

  backButtonFunction() {
    this.generateLetterForm.reset();
    this.setPanel ();
    // this.isLeftVisible = false;
    // this.isLeftVisible = !this.isLeftVisible;
    // this.setPanel();
  }


  clickCancelForm() {
    this.router.navigate(['']);
}

  generateAppointmentLetter(element: any) {
    $('.divtoggleDiv')[1].style.display = 'block';
    console.log('Generate Appointment Letter ' + element);
    this.generateLetterForm.reset();

    const obj = this.existGeneratedLetterList.filter(function (object, index, arr) {
      console.log(index + ' ----- ' + object + ' -------- ' + arr);
      if (object.candidateEmailAddr === element.canEmail) {
        return true;
      } else {
        return false;
      }
    });


    if (obj.length !== 0) {
      this.generateLetterForm = this.fb.group({
        candidateOfferLetterId: [],
        candidateDetailsId: [element.canID],
        candidateName: [element.canName.toUpperCase(), Validators.required],
        candidateAppointmentLetterTemplateId: [obj[0].candidateAppointmentLetterTemplateId],
        candidateContactNo: [element.canPhone, Validators.required],
        candidateEmailAddr: [element.canEmail],
        candidateExperience: [element.canExp],
        candidateJoiningDate: [obj[0].candidateJoiningDate],
        candidateDesignation: [],
        candidateSalary: [obj[0].candidateSalary],
        candidateWorkLocation: [+obj[0].candidateWorkLocation]
      });


      // this.generateLetterForm = this.fb.group({
      //   candidateOfferLetterId: [],
      //   candidateDetailsId: [element.canID],
      //   candidateName: [element.canName.toUpperCase(), Validators.required],
      //   candidateOfferLetterTemplateId: [obj[0].candidateOfferLetterTemplateId],
      //   candidateContactNo: [element.canPhone, Validators.required],
      //   candidateEmailAddr: [element.canEmail],
      //   candidateExperience: [element.canExp],
      //   candidateJoiningDate: [obj[0].candidateJoiningDate],
      //   candidateDesignation: [],
      //   candidateSalary: [obj[0].candidateSalary],
      //   candidateWorkLocation: [obj[0].candidateWorkLocation]
      // });
    } else {
      this.generateLetterForm = this.fb.group({
        candidateOfferLetterId: [obj[0].canGenerateLetterRecordId],
        candidateDetailsId: [element.canID],
        candidateName: [element.canName.toUpperCase(), Validators.required],
        candidateAppointmentLetterTemplateId: [obj[0].candidateAppointmentLetterTemplateId],
        candidateContactNo: [element.canPhone, Validators.required],
        candidateEmailAddr: [element.canEmail],
        candidateExperience: [element.canExp],
        candidateJoiningDate: [obj[0].candidateJoiningDate],
        candidateDesignation: [],
        candidateSalary: [obj[0].candidateSalary],
        candidateWorkLocation: [obj[0].candidateWorkLocation]
      });


      // this.generateLetterForm = this.fb.group({
      //   candidateOfferLetterId: [],
      //   candidateDetailsId: [element.canID],
      //   candidateName: [element.canName.toUpperCase(), Validators.required],
      //   candidateOfferLetterTemplateId: [''],
      //   candidateContactNo: [element.canPhone, Validators.required],
      //   candidateEmailAddr: [element.canEmail],
      //   candidateExperience: [element.canExp],
      //   candidateJoiningDate: [],
      //   candidateDesignation: [],
      //   candidateSalary: [],
      //   candidateWorkLocation: []
      // });
    }


 
  }


  saveAppointmentLetter() {
    console.log('Generated For candidate id ::: ' + this.generateLetterForm.value);
    const body = this.generateLetterForm.value;
    const letterType = 'APPOINTMENT_LETTER';
    console.log(JSON.stringify(body));
    this.serviceApi.post('/v1/recruitment/generate/appointment-letter/', body).subscribe(
      res => {
        console.log('Generate Offter letter Successfully');
        this.action = 'Response';
        this.successNotification(res.message);
      }, err => {
        console.log('Something gone wrong Generate Offter letter');
        this.action = 'Error';
        // this.warningNotification(err.message);
      }, () => {
        console.log('Final block Run of Generate Offter letter');
      });
  }


  sendMailOffterLetter(element: any) {
    this.notificationMsg = '';
    this.action = '';
    const dialogRef = this.dialog.open(SendMailAppointmentLetterDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { element: element, message: this.notificationMsg, status: this.action }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed....................' + result.message);
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          console.log('Result value ..... ' + result.message);
          if (result.status === 'Response') {
            this.notificationMsg = result.message;
            this.successNotification(this.notificationMsg);
          }
          // tslint:disable-next-line:one-line
          else if (result.status === 'Error') {
            this.notificationMsg = result.message;
            // this.warningNotification(this.notificationMsg);
          }
        }
        // tslint:disable-next-line:one-line
        this.getAllSelectedCandidate();
      }
    });
  }
}


@Component({
  templateUrl: './mail-confirm-component.html',
  styleUrls: ['./dialog.component.scss']
})
export class SendMailAppointmentLetterDialogComponent implements OnInit {
  notificationMsg: string;
  CandidateOptions: FormGroup;
  action: string;
  error: any;
  SelectedOption: string;
  selected = 'Pending';
  id: Number;
  ID: any;
  employeeList: any = [];
  dataElement: any;


  generateLetterForm: FormGroup;
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<SendMailAppointmentLetterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder, private serviceApi: ApiCommonService) {
    this.ID = data.element.canID;
    this.dataElement = data.element;
  }


  successNotification(successMessage: any) {
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

  ngOnInit() {
    this.generateLetterForm = this._fb.group({
      candidateOfferLetterId: [],
      candidateDetailsId: [this.dataElement.canID],
      candidateName: [this.dataElement.canName.toUpperCase(), Validators.required],
      candidateLetterTemplateId: ['', Validators.required],
      candidateContactNo: [this.dataElement.canPhone, Validators.required],
      candidateEmailAddr: [this.dataElement.canEmail],
      candidateExperience: [this.dataElement.canExp],
      candidateJoiningDate: [],
      candidateDesignation: [],
      candidateSalary: [],
      candidateWorkLoction: []
    });
  }


  sendMailOffterLetter() {
    console.log('Send Mail for Candidate ID ::: ' + this.ID);
    const body = this.generateLetterForm.value;
    const letterType = 'APPOINTMENT_LETTER';
    this.serviceApi.post('/v1/recruitment/send/' + letterType + '/', body).subscribe(
      res => {
        console.log('Offter letter Send to Mail Successfully ::: ' + JSON.stringify(res));
        this.action = 'Response';
        this.error = res.message;
        this.close();
      }, err => {
        console.log('Something gone wrongto Offter letter Send to Mail ' + err.message);
        this.action = 'Error';
        this.error = err.message;
        this.close();
      });
  }

  close(): void {
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}

export interface Element {
  canID: any;
  canName: any;
  canEmail: any;
  canPhone: any;
  canExp: any;
  canSkills: any;
  canLocation: any;
  canRegDate: any;
  canResume: any;
  canStatus: any;
}

const ELEMENT_DATA: Element[] = [];



