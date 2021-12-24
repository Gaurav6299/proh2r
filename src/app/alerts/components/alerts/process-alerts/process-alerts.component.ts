import { Component, OnInit, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { MatTableDataSource, MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { RequestOptions } from '@angular/http';
import { Headers } from '@angular/http';
declare var $: any;
@Component({
  selector: 'app-process-alerts',
  templateUrl: './process-alerts.component.html',
  styleUrls: ['./process-alerts.component.scss']
})
export class ProcessAlertsComponent implements OnInit {
  overduelenth: any
  upcomminglength: any
  archievedlength: any
  isOverDueEnable: boolean = true;
  isUpCommingEnable: boolean = false;
  isArchievedEnable: boolean = false;
  upcommingData = [];
  archiveData = [];
  overDueData = [];




  displayColumnForOverDue = ['LabelValue', 'date', 'actionid'];
  dataSourceForOverdue = new MatTableDataSource<OverDueInterface>(OVERDUE_ELEMENT_DATA);


  displayColumnForUpComming = ['LabelValue', 'date', 'actionid'];
  dataSourceUpComming = new MatTableDataSource<UpCommingInterface>(UPCOMMING_ELEMENT_DATA);


  displayColumnForArchive = ['LabelValue', 'actionid'];
  dataSourceArchive = new MatTableDataSource<UpCommingInterface>(Archieved_ELEMENT_DATA);




  constructor(private http: Http, private _fb: FormBuilder, public dialog: MatDialog) {

    this.getArchivedData();
    this.getOverDueData();
    this.getUpcommingData();

  }

  getOverDueData() {
    //OVERDUE_ELEMENT_DATA=[]

    this.http.get('assets/data/alert/overdue.json').map(res => res.json()).subscribe(
      res => {

        res.forEach(element => {
          this.overduelenth = res.length;
          this.overDueData.push({


            recordId: element.recordId,
            LabelName: element.LabelName,
            LabelValue: element.LabelValue,
            Date: element.Date
          });



        });
      },
      error => {
        console.log('there is something json');
      },
      () => {

        this.dataSourceForOverdue = new MatTableDataSource<OverDueInterface>(this.overDueData);
      }
    );
  }


  getUpcommingData() {
    this.http.get('assets/data/alert/upcomming.json').map(res => res.json()).subscribe(
      res => {

        res.forEach(element => {
          this.upcomminglength = res.length;
          this.upcommingData.push({


            recordId: element.recordId,
            LabelName: element.LabelName,
            LabelValue: element.LabelValue,
            Date: element.Date
          });



        });
      },
      error => {
        console.log('there is something json');
      },
      () => {

        this.dataSourceUpComming = new MatTableDataSource<UpCommingInterface>(this.upcommingData);
      }
    );
  }


  getArchivedData() {

    this.http.get('assets/data/alert/archived.json').map(res => res.json()).subscribe(
      res => {

        res.forEach(element => {
          this.archievedlength = res.length;
          this.archiveData.push({
            recordId: element.recordId,
            LabelName: element.LabelName,
            LabelValue: element.LabelValue,
            Date: element.Date
          });



        });
      },
      error => {
        console.log('there is something json');
      },
      () => {

        this.dataSourceArchive = new MatTableDataSource<ArchievedInterface>(this.archiveData);
      }
    );
  }

  runPayroll(data: any) {

  }
  hideshowoverdue() {
    this.isOverDueEnable = true;
    this.isUpCommingEnable = false;
    this.isArchievedEnable = false;
  }
  hideShowUpComming() {
    this.isOverDueEnable = false;
    this.isUpCommingEnable = true;
    this.isArchievedEnable = false;
  }

  hideShowArchive() {
    this.isOverDueEnable = false;
    this.isUpCommingEnable = false;
    this.isArchievedEnable = true;
  }
  clickToUndu() {

  }

  ngOnInit() {

  }







  //-----------------above code clossed--------------------//
}
export interface Element {
  fieldName: string;
  fieldMandantory: string;
  accessibility: string;
  fieldSensitive: string;
  fieldDefault: string;
}

const ELEMENT_DATA: Element[] = [
];


export interface OverDueInterface {
  recordId: Number,
  LabelName: String,
  LabelValue: String,
  date: String
}

let OVERDUE_ELEMENT_DATA: OverDueInterface[] = [];
export interface UpCommingInterface {

  fieldName: string;
  fieldMandantory: string;
  accessibility: string;
  fieldSensitive: string;
  fieldDefault: string;
}

const UPCOMMING_ELEMENT_DATA: UpCommingInterface[] = [
];

export interface ArchievedInterface {
  fieldName: string;
  fieldMandantory: string;
  accessibility: string;
  fieldSensitive: string;
  fieldDefault: string;
}

const Archieved_ELEMENT_DATA: ArchievedInterface[] = [
];
