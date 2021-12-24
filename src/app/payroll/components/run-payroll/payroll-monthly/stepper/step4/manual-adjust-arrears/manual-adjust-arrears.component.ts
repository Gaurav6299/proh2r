import { ChangeDetectionStrategy, Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import 'rxjs/add/operator/map';
import { RequestOptions } from '@angular/http';
import { Headers } from '@angular/http';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import 'fullcalendar';
import * as $ from 'jquery';

@Component({
  selector: 'app-manual-adjust-arrears',
  templateUrl: './manual-adjust-arrears.component.html',
  styleUrls: ['./manual-adjust-arrears.component.scss']
})
export class ManualAdjustArrearsComponent implements OnInit, AfterViewInit {

  dataSourceManualArrears = new MatTableDataSource<ElementManualArrears>(ELEMENT_DATA_MANNUAL_ARREARS);
  displayedColumnsManualArrears = ['monthYear', 'grossAllowance', 'grossDeduction', 'pfWage', 'pfPensionPaid', 'pfCeiling', 'recordId'];

  dataSourceArrearDays = new MatTableDataSource<ElementArrearDays>(ELEMENT_DATA_ARREARS_DAYS);
  displayedColumnsArrearDays = ['monthYear', 'noOfLopDays', 'noOfLopReversalDays', 'recordId'];

  dataSourceSalaryRevisionArrears = new MatTableDataSource<ElementSalaryRevisionArrears>(ELEMENT_DATA_SALARY_REVISION_ARREARS);
  displayedColumnsSalaryRevisionArrears = ['salaryRevisiontoStartFrom', 'salaryRevisionToBeMadeTill',
    'oldCTCGross', 'newCTCGross', 'Comment', 'salaryRevisiontArrearId'];

  displayedColumns = ['date', 'typeOfArrear', 'action'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  isLeftVisible = true;
  selectformControl = new FormControl();
  showHideFilter: any;
  showHideAddTable = false;

  @ViewChild(MatSort) sort: MatSort;

  selectObject = [
    { value: 'August-2017', viewValue: 'August-2017' },
    { value: 'July-2017', viewValue: 'July-2017' },
    { value: 'June-2017', viewValue: 'June-2017' }
  ];

  constructor(public dialog: MatDialog, private fb: FormBuilder,
    private http: Http) {
  }

  ngOnInit() {
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    console.log('hello' + filterValue);
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSourceManualArrears.filter = filterValue;
  }

  onNoClick(): void {
  }

  clickOnAddSalaryRevisionArrears() {
    console.log('Enter in the Addition of Salary Revision Arrears');
    const dialogRef = this.dialog.open(AddSalaryRevisionComponent, {
      width: '600px',
      // data: { actionId: data.actionId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }


  // ********************* Click Function  For MANUAL ARREAR Add, Edit and Delete  (START) *****************
  clickOnAddManualArrears() {
    console.log('Enter in the Add Section of Manual Arrears');
    const dialogRef = this.dialog.open(AddManualArrearsComponent, {
      width: '800px',
      height: '500px',
      // data: { actionId: data.actionId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  clickOnEditManualArrears() {
    console.log('Enter in the Edit Section of Manual Arrears');
    const dialogRef = this.dialog.open(AddManualArrearsComponent, {
      width: '800px',
      height: '500px',
      // data: { actionId: data.actionId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  clickOnDeleteManualArrears(data: any) {
    console.log('Enter in the Delete Section of Manual Arrears');
    const dialogRef = this.dialog.open(DeleteManualArrearsComponent, {
      
      panelClass: 'custom-dialog-container',
      // data: { actionId: data.actionId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed -->' + result);
    });
  }
  // ********************* Click Function  For MANUAL ARREAR Add, Edit and Delete (END) *****************/



  onClickDropdownAction() {
    console.log('Enter in the Selection of Action For Further Task');
    console.log('Data is : ' + this.selectformControl);
    this.showHideAddTable = true;
  }


  // ********************** CLick Function For ARREAR DAYS  Add, Edit, Delete (START) *******************/
  clickOnAddArrearDaysDialogbox() {
    console.log('Enter in the Addition of New Arrears Manual Arrears');
    const dialogRef = this.dialog.open(AddNewArrearDaysComponent, {
      width: '800px',
      // data: { actionId: data.actionId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed -->' + result);
    });
  }

  onClickEditArrearDays(data: any) {
    console.log('Enter  in the Edit Section of Arrear Days Performing task on Table' + data.element);
    this.selectformControl.setValue('July-2017');
    this.showHideAddTable = true;
  }

  clickOnDeleteArrearDaysRecord(data: any) {
    console.log('Enter in the Delete Arrear Days');
    const dialogRef = this.dialog.open(DeleteArrearDaysComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      // data: { actionId: data.actionId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed -->' + result);
    });
  }

  clickOnDeleteMonthArrearDaysRecord(data: any) {
    console.log('Enter in the Delete Arrear Days From tyhe Table Of Full Month');
    const dialogRef = this.dialog.open(DeleteMonthArrearDaysComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      // data: { actionId: data.actionId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed -->' + result);
    });
  }
  // ********************** CLick Function For ARREAR DAYS  Add, Edit, Delete (END) *******************/

}


@Component({
  templateUrl: 'add-salary-revision-component.html',
  styleUrls: ['dialog-model.scss']
})
export class AddSalaryRevisionComponent implements OnInit {

  foods = [
    { value: '11-12-2017 to Present => Rs. 50000.0', viewValue: '11-12-2017 to Present => Rs. 50000.0' },
    { value: '1-11-2017 to 10-12-2017 => Rs. 20000.0 ', viewValue: '1-11-2017 to 10-12-2017 => Rs. 20000.0' }
  ];

  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<AddSalaryRevisionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('data-->' + data);
  }
  ngOnInit() {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  templateUrl: 'addEdit-manual-arrears-dialog.html',
  styleUrls: ['dialog-model.scss']
})
export class AddManualArrearsComponent implements OnInit {

  manualArrearAdditionForm: FormGroup;
  dynamicFileds = [];
  i = 0;
  constructor(private http: Http,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddManualArrearsComponent>,
    @Inject(MAT_DIALOG_DATA) public data1: any) {
    console.log('data-->' + data1);
    this.manualArrearAdditionForm = this.fb.group({
      fieldMaster: this.fb.array([
      ])
    });

    const headers = new Headers({
      // 'Authorization': 'Bearer ' + bearerData,
      'Content-Type': 'application/json'
    });
    const options = new RequestOptions({ headers: headers });
    // const body = new URLSearchParams();
    //    this.http.get(this.baseUrl + '/v1/organization/employeefields/section', options).subscribe(
    this.http.get('assets/data/processPayroll/customFieldsArrears.json', options).map(res => res.json()).subscribe(
      // tslint:disable-next-line:max-line-length
      // this.http.get(this.baseUrl + '/v1/organization/allFieldBySectionName/Basic Information', options).subscribe(
      res => {
        console.log('res -->' + res);
        res.forEach(element1 => {
          console.log('element -->' + element1);
          this.dynamicFileds.push(element1);
        });
        this.dynamicFileds.forEach(data => {
          console.log('sectionName -->' + data.sectionName);
          if (data.employeeProfileLocation === 'Manual Arrears') {
            const control = <FormArray>this.manualArrearAdditionForm.controls['fieldMaster'];
            control.push(
              this.fb.group({
                sectionId: [data.sectionId],
                sectionName: [data.sectionName],
                sectionLocation: [data.employeeProfileLocation],
                accessLevel: [data.accessLevel],
                editable: [false],
                totalLabel: [data.totalLabel],
                totalValue: [data.totalValue],
                fields: this.fb.array([
                ]),
              })
            );
            data.fields.forEach(fieldsData => {
              this.initFieldMaster(this.i, fieldsData);
            });
            this.i++;
          }
        });
      },
      error => {
        console.log('err -->' + error);
      }
    );
  }

  get fieldMaster(): FormArray {
    return this.manualArrearAdditionForm.get('fieldMaster') as FormArray;
  }

  initFieldMaster(i: any, fieldsData: any) {
    console.log('initial Field Master-->' + i);
    console.log('fieldName -->' + fieldsData.fieldName);
    const control = (<FormArray>this.manualArrearAdditionForm.controls['fieldMaster']).at(i).get('fields') as FormArray;
    control.push(
      this.fb.group({
        fieldId: [fieldsData.fieldId],
        fieldName: [fieldsData.fieldName],
        fieldPlaceholderValue: ['Enter Text'],
        fieldValue: [fieldsData.fieldValue],
        fieldDescription: [fieldsData.fieldDescription],
        fieldType: [fieldsData.fieldType],
        accessLevel: [fieldsData.accessLevel],
        includeInOnboarding: [fieldsData.includeInOnboarding],
        default: [fieldsData.default],
        sensitive: [fieldsData.sensitive],
        options: [fieldsData.options],
        mandatory: [fieldsData.mandatory],
      })
    );

  }


  ngOnInit() {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  doTotal(data: FormGroup) {
    let sum = 0;
    console.log('Enter in the Calculation Method And Data is >>> ' + data);
    data.controls.fields.value.forEach(element => {
      console.log(element + '--' + element.fieldValue);
      if (element.fieldValue !== null) {
        sum = sum + +element.fieldValue;
      } else {
      }
    });
    data.controls.totalValue.setValue(sum);
  }
}

@Component({
  templateUrl: 'manual-arrear-delete-dialog.html',
  styleUrls: ['dialog-model.scss']
})
export class DeleteManualArrearsComponent implements OnInit {


  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<DeleteManualArrearsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('data-->' + data);
  }
  ngOnInit() {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  onDeleteManualArrearDetails() {
    console.log('Ente in the Delete Data from Database Function');
  }
}


@Component({
  templateUrl: 'add-new-arrear-day.html',
  styleUrls: ['dialog-model.scss']
})
export class AddNewArrearDaysComponent implements OnInit {

  selecttypeOfArrear = new FormControl();
  backgroundColor = 'rgb(234, 97, 83)';
  lop = 'fullDay';
  lopTypes = [
    'fullDay',
    'halfDay',
    'quarterDay',
    'thridByFourthDay',
    'clear'
  ];
  employeeLop: FormGroup;
  fullDay = new FormControl();
  halfDay = new FormControl();
  quarterDay = new FormControl();
  thridByFourthDay = new FormControl();
  // clear = new FormControl();
  fullCalendarDate = '2018-01-12';
  lopDays: string[] = new Array(31);

  dynamicFileds = [];
  i = 0;
  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<AddNewArrearDaysComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('data-->' + data);
  }
  ngOnInit() {
    var self = this;
    let containerEl: JQuery = $('#calendar');
    containerEl.fullCalendar({
      // options here
      header: {
        left: '',
        center: 'title',
        right: ''
      },
      // height: 600,
      defaultDate: self.fullCalendarDate,
      navLinks: false, // can click day/week names to navigate views
      editable: true,
      showNonCurrentDates: false,
      eventLimit: true, // allow "more" link when too many events
      events: [
      ],
      dayClick: function (date, jsEvent, view) {
        $(this).css('background-color', self.backgroundColor);
        console.log('lop-->' + self.lop);
        // alert('Clicked on: ' + date.format());

        // alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
        // alert('Current view: ' + view.name);

        // console.log('date-->' + date +  'jsEvent-->' + jsEvent + 'view-->' + view);
        var dayNumber = date.format();

        var daySplit = dayNumber.split('-');
        var day = daySplit[2];

        switch (day) {
          case '01': {
            self.lopDays[0] = self.lop;
            break;
          }
          case '02': {
            self.lopDays[1] = self.lop;
            break;
          }
          case '03': {
            self.lopDays[2] = self.lop;
            break;
          }
          case '04': {
            self.lopDays[3] = self.lop;
            break;
          }
          case '05': {
            self.lopDays[4] = self.lop;
            break;
          }
          case '06': {
            self.lopDays[5] = self.lop;
            break;
          }
          case '07': {
            self.lopDays[6] = self.lop;
            break;
          }
          case '08': {
            self.lopDays[7] = self.lop;
            break;
          }
          case '09': {
            self.lopDays[8] = self.lop;
            break;
          }
          case '10': {
            self.lopDays[9] = self.lop;
            break;
          }
          case '11': {
            self.lopDays[10] = self.lop;
            break;
          }
          case '12': {
            self.lopDays[11] = self.lop;
            break;
          }
          case '13': {
            self.lopDays[12] = self.lop;
            break;
          }
          case '14': {
            self.lopDays[13] = self.lop;
            break;
          }
          case '15': {
            self.lopDays[14] = self.lop;
            break;
          }
          case '16': {
            self.lopDays[15] = self.lop;
            break;
          }
          case '17': {
            self.lopDays[16] = self.lop;
            break;
          }
          case '18': {
            self.lopDays[17] = self.lop;
            break;
          }
          case '19': {
            self.lopDays[18] = self.lop;
            break;
          }
          case '20': {
            self.lopDays[19] = self.lop;
            break;
          }
          case '21': {
            self.lopDays[20] = self.lop;
            break;
          }
          case '22': {
            self.lopDays[21] = self.lop;
            break;
          }
          case '23': {
            self.lopDays[22] = self.lop;
            break;
          }
          case '24': {
            self.lopDays[23] = self.lop;
            break;
          }
          case '25': {
            self.lopDays[24] = self.lop;
            break;
          }
          case '26': {
            self.lopDays[25] = self.lop;
            break;
          }
          case '27': {
            self.lopDays[26] = self.lop;
            break;
          }
          case '28': {
            self.lopDays[27] = self.lop;
            break;
          }
          case '29': {
            self.lopDays[28] = self.lop;
            break;
          }
          case '30': {
            self.lopDays[29] = self.lop;
            break;
          }
          case '31': {
            self.lopDays[30] = self.lop;
            break;
          }
          default: {
            console.log('nvalid choice');
            break;
          }
        }
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
    console.log('dialog closed');
  }

  closeDialog() {
    this.dialogRef.close('lopDays-->' + this.lopDays);
  }
  setData(event: any) {
    console.log('event-->' + event + 'backgroundColor' + this.backgroundColor);
    if (event.value === 'fullDay') {
      this.backgroundColor = 'rgb(234, 97, 83)';
    } else if (event.value === 'halfDay') {
      this.backgroundColor = 'rgb(91, 192, 222)';
    } else if (event.value === 'quarterDay') {
      this.backgroundColor = 'rgb(109, 87, 157)';
    } else if (event.value === 'thridByFourthDay') {
      this.backgroundColor = 'rgb(235, 127, 55)';
    } else if (event.value === 'clear') {
      this.backgroundColor = 'rgb(255, 255, 255)';
    }

  }

  clickOnTypeOfArrearAction() {
    console.log('Enter in the Type Of Arrears Selection >> ' + this.selecttypeOfArrear);
  }


}

@Component({
  templateUrl: 'arrear-days-delete-dialog.html',
  styleUrls: ['dialog-model.scss']
})
export class DeleteArrearDaysComponent implements OnInit {


  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<DeleteArrearDaysComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('data-->' + data);
  }
  ngOnInit() {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  onDeleteArrearDays() {
    console.log('Ente in the Delete Data from Database Function');
  }
}

@Component({
  templateUrl: 'table-arrear-days-delete-dialog.html',
  styleUrls: ['dialog-model.scss']
})
export class DeleteMonthArrearDaysComponent implements OnInit {


  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<DeleteMonthArrearDaysComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('data-->' + data);
  }
  ngOnInit() {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  onDeleteArrearDays() {
    console.log('Ente in the Delete Data from Database Function');
  }
}




export interface ElementManualArrears {
  recordId: string;
  monthYear: string;
  grossAllowance: string;
  grossDeduction: string;
  pfWage: string;
  pfPensionPaid: string;
  pfCeiling: string;
}

export interface ElementArrearDays {
  recordId: string;
  monthYear: string;
  noOfLopDays: string;
  noOfLopReversalDays: string;
}

export interface ElementSalaryRevisionArrears {
  salaryRevisiontArrearId: number;
  salaryRevisiontoStartFrom: string;
  salaryRevisionToBeMadeTill: string;
  oldCTCGross: string;
  newCTCGross: string;
  Comment: string;
}

export interface Element {
  arrearDaysRecordId: number;
  date: string;
  typeOfArrear: string;
  action: string;
}

const ELEMENT_DATA_MANNUAL_ARREARS: ElementManualArrears[] = [
  {
    recordId: '1',
    monthYear: 'June-2017',
    grossAllowance: '100',
    grossDeduction: '1000',
    pfWage: '500',
    pfPensionPaid: '5000',
    pfCeiling: 'false'
  }
];

const ELEMENT_DATA_ARREARS_DAYS: ElementArrearDays[] = [
  { monthYear: 'June', noOfLopDays: '16-02-2018', noOfLopReversalDays: 'Normal Arrear', recordId: '1' }
];
const ELEMENT_DATA_SALARY_REVISION_ARREARS: ElementSalaryRevisionArrears[] = [];
const ELEMENT_DATA: Element[] = [
  { arrearDaysRecordId: 1, date: '16-02-2018', typeOfArrear: 'Normal Arrear', action: '1' }
];
