import { Component, OnInit, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import 'rxjs/add/operator/map';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { ApiCommonService } from '../../../services/api-common.service';
import * as $1 from 'jquery';
import * as _moment from 'moment';
import { MatTableDataSource, MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import 'fullcalendar';
import { KeycloakService } from '../../../keycloak/keycloak.service';
declare var $: any;
import { Router } from '@angular/router';
import { duration } from 'moment';

@Component({
  selector: 'app-interview-schedul-calendar',
  templateUrl: './interview-schedul-calendar.component.html',
  styleUrls: ['./interview-schedul-calendar.component.scss']
})
export class InterviewSchedulCalendarComponent implements OnInit, OnChanges {

  backgroundColor = 'rgb(234, 97, 83)';
  lop = 'fullDay';
  lopTypes = [
    'fullDay',
    'halfDay',
    'quarterDay',
    'thridByFourthDay',
    'clear'
  ];
  selEvent = [];
  employeeLop: FormGroup;
  fullDay = new FormControl();
  halfDay = new FormControl();
  quarterDay = new FormControl();
  thridByFourthDay = new FormControl();

  lopDays: string[] = new Array(31);
  loginempCode: any;
  fullCalendarDate: any;
  eventList = [];
  fromDate: any;
  firstDD: any;
  firstMonth: any;

  toDate: any;
  lastDD: any;
  lastMonth: any;
  public selectEmp: FormGroup;
  dynamicFileds = [];
  i = 0;
  employeeList = [];
  reqId: any;
  selectedId: any;
  selId: any;

  constructor(public router: Router, public dialog: MatDialog, private fb: FormBuilder, private serviceApi: ApiCommonService) {
    console.log('calendar loading');
    this.serviceApi.get('/v1/employee/filterEmployees').
      subscribe(
        res => {
          res.forEach(element => {
            // tslint:disable-next-line:max-line-length
            this.employeeList.push({ fullName: element.empFirstName + ' ' + element.empLastName + ' - ' + element.empCode, value: element.empCode });
          });
        });
    this.selectEmp = this.fb.group(
      {
        selectEmployee: ['', Validators.required],
      }
    );
    this.loginempCode = this.getUsername();
    this.reqId = this.loginempCode;
  }

  getUsername() {
    return KeycloakService.getUsername();
  }
  ngOnInit() {
    this.setEvent();
  }

  selected(data: any) {
    console.log(data.value);
    this.reqId = data.value;
    this.setEvent();
    this.loadEvents();
  }
  loadEvents() {
    $1('#calendar').fullCalendar('removeEvents');
    $1('#calendar').fullCalendar('refetchEvents');
  }

  formateDate(firstDay: Date, lastDay: Date) {
    console.log(firstDay.getMonth());
    if ((firstDay.getMonth() + 1) < 10) {
      this.firstMonth = '0' + (firstDay.getMonth() + 1);
    } else if ((firstDay.getMonth() + 1) >= 10) {
      this.firstMonth = (firstDay.getMonth() + 1);
    }

    if (firstDay.getDate() < 10) {
      this.firstDD = '0' + firstDay.getDate();
    } else if (firstDay.getDate() >= 10) {
      this.firstDD = firstDay.getDate();
    }

    if ((lastDay.getMonth() + 1) < 10) {
      this.lastMonth = '0' + (lastDay.getMonth() + 1);
    } else if ((lastDay.getMonth() + 1) >= 10) {
      this.lastMonth = (lastDay.getMonth() + 1);
    }

    if (lastDay.getDate() < 10) {
      this.lastDD = '0' + lastDay.getDate();
    } else if (lastDay.getDate() >= 10) {
      this.lastDD = lastDay.getDate();
    }

    this.toDate = lastDay.getFullYear() + '-' + this.lastMonth + '-' + this.lastDD;
    this.fromDate = firstDay.getFullYear() + '-' + this.firstMonth + '-' + this.firstDD;
    this.fullCalendarDate = firstDay.getFullYear() + '-' + this.firstMonth + '-' + this.firstDD;
    console.log(' From Date ::: ' + this.fromDate);
    console.log(' To  Date ::: ' + this.toDate);
  }


  getCurrentMonthDate() {
    console.log('getCurrendMonthDate -->');
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.formateDate(firstDay, lastDay);
  }

  ngOnChanges() {
    this.setEvent();
  }

  formatDateToISO(dateStr) {

    var date = Object.assign(dateStr);
    var datearray = date.split("/");
    // var newdate = datearray[1] + '/' + datearray[0] + '/' + datearray[2];
    var newdate = datearray[2] + '-' + datearray[1] + '-' + datearray[0];
    return newdate;

  }

  setEvent() {
    var self = this;
    this.eventList = [];

    let containerEl: JQuery = $1('#calendar');
    containerEl.fullCalendar({
      header: {
        left: 'prev,next today',
        center: 'title',
        right: ' agendaWeek,month,listMonth'
      },
      defaultView: 'agendaWeek',
      height: 500,
      defaultDate: self.fullCalendarDate,
      navLinks: false,
      editable: true,
      droppable: true,
      showNonCurrentDates: false,
      eventLimit: true,
      eventRender: function (event, element) {
        if (event.color == 'GREEN') {
          element.css({
            'background-color': 'green',
            'border-color': 'grey',

          });
        }
        else if (event.color == 'RED') {
          element.css({
            'background-color': 'red',
            'border-color': 'grey',

          });
        }
        else if (event.color == 'MAROON') {
          element.css({
            'background-color': '#FF5733',
            'border-color': 'grey',
          });
        }
        else {
          element.css({
            'background-color': 'yellow',
            'border-color': 'grey',
            'color': 'black',

          });
        }
      },

      eventClick: function (calEvent, event, view) {
        self.getEvent(calEvent);
      },
      events: function (start, end, timezone, callback) {
        self.eventList = [];
        self.selEvent = [];

        console.log('It worked' + self.reqId);
        var moment = $1('#calendar').fullCalendar('getDate');
        const date = new Date(moment.format());
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        self.formateDate(firstDay, lastDay);
        self.serviceApi.get('/v1/scheduler/' + self.reqId).subscribe(
          res => {
            if (res != null) {
              res.forEach(element1 => {
                self.eventList.push({
                  id: element1.interviewercalenderId,
                  title: element1.title,
                  start: element1.startDateTime,
                  end: element1.endDateTime,
                  color: element1.colour,
                  candidateId:element1.candidateId,
                  interviewerId:element1.interviewerId,
                  candidateStatus:element1.candidateStatus,
                  candidateName:element1.candidateName,
                  interviewerName:element1.interviewerName,
                  reason:element1.reason,
                  interviewType:element1.interviewType,
                  allDay: element1.allDay,
                });
              });
              console.log(JSON.stringify(self.eventList));
            } else {
              console.log('Data doesnt Exist');
            }
          }, err => {
            console.log(err);
          }, () => {
            callback(self.eventList);
          }
        );
      },
      eventResize: function(event, delta, revertFunc) {

       
    
        if (!confirm("is this okay?")) {
          revertFunc();
        }
    
      },
      eventDrop: function(event, delta, revertFunc) {
        if (!confirm("Are you sure about this change?")) {
            console.log("Reverting...");
            revertFunc();
        }
    },
      dayClick: function (date) {
        var dayNumber = date.format();
        self.getData(dayNumber);
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
      },

    });

  }

  getEvent(data: any) {
    const dialogRef = this.dialog.open(InterviewEventViewDialogComponent, {
      width: '850px',
      data: {
        event: data
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadEvents();
    });
  }



  getData(data: any) {
    this.selId = this.reqId;
    const dialogRef = this.dialog.open(InterviewEventCalanderDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: {
        dateFormat: data,
        id: this.selId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadEvents();
    });
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




}

// -------------delete fields modal start -------------------------
@Component({
  templateUrl: 'interview-calendar-dialog-component.html',
  styleUrls: ['./dialog-component.scss']
})
export class InterviewEventCalanderDialogComponent {
  error = 'Error Message';
  action: any;
  ScheduleDate: string;
  day: any;
  date: any;
  public addNewEvent: FormGroup;
  employeeList = [];
  Candidates = [];
  emp: any;
  event: any;
  dataSource: MatTableDataSource<any>;
  reqID: any = 0;
  selectcandidate: any;
  dateAndTime: string;
  allDay: any;
  endDateandTime: string;
  show: boolean = false;
  interviewType: any;

  constructor(
    private _fb: FormBuilder, private serviceApi: ApiCommonService,
    public dialogRef: MatDialogRef<InterviewEventCalanderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.ScheduleDate = data.dateFormat;
    this.reqID = data.id;

    console.log('-------' + this.ScheduleDate + '-------');
    this.serviceApi.get('/v1/employee/filterEmployees').
      subscribe(
        res => {
          res.forEach(element => {
            this.employeeList.push({ fullName: element.empFirstName + ' ' + element.empLastName + ' - ' + element.empCode, value: element.empCode });
          });
        });

    this.serviceApi.get('/v1/recruitment/candidates/schedule').
      subscribe(
        res => {
          res.forEach(element => {
            this.Candidates.push({
              canID: element.id,
              canName: element.cndFirstName,
              canExp: element.canExperienceInYear
            });
          });
        });

    this.addNewEvent = this._fb.group({
      selectEmployee: ['', Validators.required],
      event: '',
      selectCandidate: '',
      selectType: ''
    });

  }
  expCheck(data: any) {
    if (data >= 1) {
      this.show = true;
    }
  }

  addEvent() {
    this.emp = this.addNewEvent.controls.selectEmployee.value;
    this.event = this.addNewEvent.controls.event.value;
    this.selectcandidate = this.addNewEvent.controls.selectCandidate.value;
    this.interviewType = this.addNewEvent.controls.selectType.value,
      console.log(this.ScheduleDate)
    console.log(this.emp);
    console.log(this.event);
    if (this.ScheduleDate.indexOf('T') > -1) {
      this.dateAndTime = this.ScheduleDate;
      this.endDateandTime = this.ScheduleDate;
      this.allDay = false;
    }
    else {
      this.dateAndTime = this.ScheduleDate + 'T09:00:00';
      this.endDateandTime = this.ScheduleDate + 'T06:00:00';
      this.allDay = true;
    }
    var body = {
      "interviewerId": this.reqID,
      "title": this.event,
      "startDateTime": this.dateAndTime,
      "endDateTime": this.endDateandTime,
      "candidateId": this.selectcandidate,
      "interviewType": this.interviewType,
      "colour": "YELLOW",   
      "allDay": this.allDay,
    }
    // 'Candidate Name :'+this.selectcandidate+','+ 
    return this.serviceApi.post('/v1/scheduler/', body).
      subscribe(
        res => {
          this.action = 'Response';
          this.error = res.message;
          this.successNotification(this.error);
          this.close();
        },
        err => {
          this.action = 'Error';
          this.error = err.message;
          // this.warningNotification(this.error)
          this.close();
        });
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

  close(): void {
    console.log('message---------' + this.error);
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    this.dialogRef.close(this.data);
  }
}

@Component({
  templateUrl: 'interview-eventView-dialog-component.html',
  styleUrls: ['./viewdialog-component.scss']
})
export class InterviewEventViewDialogComponent {
  error: string;
  action: any;
  eventListId: any = [];
  status: string;
  comments: string;
  public comment: FormGroup;
  // public marks: FormGroup;
  constructor(public dialog: MatDialog, private _fb: FormBuilder, public dialogRef: MatDialogRef<InterviewEventViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    console.log(this.data.event);
    this.serviceApi.get('/v1/scheduler/' + this.data.event.id).subscribe(
      res => {
        res.forEach(element1 => {
          this.eventListId.push({
            id: element1.interviewercalenderId,
            color: element1.colour,
          });
        });
      }
    );
    this.comment = this._fb.group({
      comments: '',
    });
   
  }
  colour = this.data.event.color;
  events = this.data.event.title;
  date = this.data.event.start._i;
  time = this.data.event.start._i;
  id = this.data.event.id;
  canName=this.data.event.candidateName;
  InterviewerName=this.data.event.interviewerId;
  reason=this.data.event.reason;
  interviewType=this.data.event.interviewType;
  canStatus=this.data.event.candidateStatus;
  approveRejectEvent(data: string) {
    return this.serviceApi.put('/v1/scheduler/' + this.id + '/action?action=' + data + '&comments=' + this.comment.controls.comments.value, null).
      subscribe(
        res => {
          this.action = 'Response';
          this.error = res.message;
          this.successNotification(this.error);
          this.close();
        },
        err => {
          this.action = 'Error';
          this.error = err.message;
          // this.warningNotification(this.error)
          this.close();
        });
  }
  deleteEvent(data: string) {
    return this.serviceApi.delete('/v1/scheduler/' + this.id).
      subscribe(
        res => {
          this.action = 'Response';
          this.error = res.message;
          this.successNotification(this.error);
          this.close();
        },
        err => {
          this.action = 'Error';
          this.error = err.message;
          // this.warningNotification(this.error)
          this.close();
        });
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
  close(): void {
    console.log('message---------' + this.error);
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    this.dialogRef.close(this.data);
  }
}
