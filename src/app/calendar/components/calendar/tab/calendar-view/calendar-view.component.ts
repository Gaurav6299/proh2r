// import { ChangeDetectionStrategy, Component, OnInit, Output, EventEmitter, Input, ViewChild, Inject } from '@angular/core';
// import { Http } from '@angular/http';
// import { FormArray, FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
// import 'rxjs/add/operator/map';
// import { RequestOptions } from '@angular/http';
// import { Headers } from '@angular/http';
// import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { element } from 'protractor';
// import { ApiCommonService } from '../../../../../services/api-common.service';
// import 'fullcalendar';
// import * as $ from 'jquery';
// import { KeycloakService } from '../../../../../keycloak/keycloak.service';
// import * as _moment from 'moment';

// @Component({
//   selector: 'app-calendar-view',
//   templateUrl: './calendar-view.component.html',
//   styleUrls: ['./calendar-view.component.scss']
// })
// export class CalendarViewComponent implements OnInit, AfterViewInit {

//   backgroundColor = 'rgb(234, 97, 83)';
//   lop = 'fullDay';
//   lopTypes = [
//     'fullDay',
//     'halfDay',
//     'quarterDay',
//     'thridByFourthDay',
//     'clear'
//   ];
//   employeeLop: FormGroup;
//   fullDay = new FormControl();
//   halfDay = new FormControl();
//   quarterDay = new FormControl();
//   thridByFourthDay = new FormControl();

//   lopDays: string[] = new Array(31);

//   fullCalendarDate: any;
//   eventList = [];
//   fromDate: any;
//   firstDD: any;
//   firstMonth: any;

//   toDate: any;
//   lastDD: any;
//   lastMonth: any;

//   dynamicFileds = [];
//   i = 0;
//   constructor(private http: Http, private fb: FormBuilder, private serviceApi: ApiCommonService) {
//     console.log('calendar loading');
//     // this.getCurrentMonthDate();
//   }

//   ngOnInit() {
//   }

//   formateDate(firstDay: Date, lastDay: Date) {
//     console.log(firstDay.getMonth());
//     if ((firstDay.getMonth() + 1) < 10) {
//       this.firstMonth = '0' + (firstDay.getMonth() + 1);
//     } else if ((firstDay.getMonth() + 1) >= 10) {
//       this.firstMonth = (firstDay.getMonth() + 1);
//     }

//     if (firstDay.getDate() < 10) {
//       this.firstDD = '0' + firstDay.getDate();
//     } else if (firstDay.getDate() >= 10) {
//       this.firstDD = firstDay.getDate();
//     }

//     if ((lastDay.getMonth() + 1) < 10) {
//       this.lastMonth = '0' + (lastDay.getMonth() + 1);
//     } else if ((lastDay.getMonth() + 1) >= 10) {
//       this.lastMonth = (lastDay.getMonth() + 1);
//     }

//     if (lastDay.getDate() < 10) {
//       this.lastDD = '0' + lastDay.getDate();
//     } else if (lastDay.getDate() >= 10) {
//       this.lastDD = lastDay.getDate();
//     }

//     this.toDate = lastDay.getFullYear() + '-' + this.lastMonth + '-' + this.lastDD;
//     this.fromDate = firstDay.getFullYear() + '-' + this.firstMonth + '-' + this.firstDD;
//     this.fullCalendarDate = firstDay.getFullYear() + '-' + this.firstMonth + '-' + this.firstDD;
//     console.log(' From Date ::: ' + this.fromDate);
//     console.log(' To  Date ::: ' + this.toDate);
//   }


//   getCurrentMonthDate() {
//     console.log('getCurrendMonthDate -->');
//     const date = new Date();
//     const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
//     const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
//     this.formateDate(firstDay, lastDay);
//   }


//   ngAfterViewInit() {
//     this.setEvent();
//     // this.loadEvents();
//   }
//   loadEvents() {
//     $('#calendar').fullCalendar('removeEvents');
//     $('#calendar').fullCalendar('refetchEvents');
//   }


//   formatDateToISO(dateStr){
//     console.log('formatDateToISO ::'+dateStr);
//     var date = Object.assign(dateStr);;
//     var datearray = date.split("/");
//     // var newdate = datearray[1] + '/' + datearray[0] + '/' + datearray[2];
//     var newdate = datearray[2] + '-' + datearray[1] + '-' + datearray[0];
//     return newdate;
//   }

//   setEvent() {
//     var self = this;
//     var resposneData;
//     let containerEl: JQuery = $('#calendar');
//     containerEl.fullCalendar({
//       // options here
//       header: {
//         left: 'prev,next today',
//         center: 'title',
//         right: 'month,listMonth,agendaWeek'
//       },
//       // right: 'month,basicWeek,basicDay'

//       height: 450,
//       defaultDate: self.fullCalendarDate,
//       navLinks: false, // can click day/week names to navigate views
//       editable: true,
//       showNonCurrentDates: false,
//       eventLimit: true, // allow "more" link when too many event
//       // eventRender: function(eventObj, $el) {
//       //   $el.popover({
//       //     title: eventObj.title,
//       //     content: eventObj.description,
//       //     trigger: 'hover',
//       //     placement: 'top',
//       //     container: 'body'
//       //   });
//       // },
     
//       // eventRender: function (event, element1) {
//       //   element1.qtip({
//       //     content: event.description
//       //   });
//       // },
//       events: function (start, end, timezone, callback) {
//         self.eventList = [];
//         var moment = $('#calendar').fullCalendar('getDate');
//         // alert('The current date of the calendar is ' + moment.format());
//         const date = new Date(moment.format());

//         const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
//         const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
//         self.formateDate(firstDay, lastDay);

//         self.serviceApi.get('/v1/calendar/admin/' + '' + self.fromDate + '/' + '' + self.toDate).subscribe(
//           res => {
//             if (res != null) {
//               res.forEach(element1 => {
//                 console.log(element1)
//                 self.eventList.push({
//                   id: 999,
//                   title: element1.eventName + (element1.empName != null ? '-' + element1.empName + '-' : '') + (element1.empCode != null ? element1.empCode : ''),
//                   // start: self.formatDateToISO(element1.startDate),
//                   // end: self.formatDateToISO(element1.endDate),
//                    start:element1.startDate,
//                   end: element1.endDate,
//                   allDay: true,
//                 });
//               });
//               console.log(JSON.stringify(self.eventList));
//             } else {
//               console.log('Data doesnt Exist');
//             }
//           },
//           err => {
//             console.log(err);
//           },
//           () => {
//             // this.setEvent();
//             callback(self.eventList);
//           }
//         );
//       },
//       dayClick: function (date, jsEvent, view) {
//         // $(this).css('background-color', self.backgroundColor);
//         console.log('lop-->' + self.lop);



//         // alert('Clicked on: ' + date.format());

//         // alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
//         // alert('Current view: ' + view.name);

//         // console.log('date-->' + date +  'jsEvent-->' + jsEvent + 'view-->' + view);
//         var dayNumber = date.format();

//         var daySplit = dayNumber.split('-');
//         var day = daySplit[2];

//         switch (day) {
//           case '01': {
//             self.lopDays[0] = self.lop;
//             break;
//           }
//           case '02': {
//             self.lopDays[1] = self.lop;
//             break;
//           }
//           case '03': {
//             self.lopDays[2] = self.lop;
//             break;
//           }
//           case '04': {
//             self.lopDays[3] = self.lop;
//             break;
//           }
//           case '05': {
//             self.lopDays[4] = self.lop;
//             break;
//           }
//           case '06': {
//             self.lopDays[5] = self.lop;
//             break;
//           }
//           case '07': {
//             self.lopDays[6] = self.lop;
//             break;
//           }
//           case '08': {
//             self.lopDays[7] = self.lop;
//             break;
//           }
//           case '09': {
//             self.lopDays[8] = self.lop;
//             break;
//           }
//           case '10': {
//             self.lopDays[9] = self.lop;
//             break;
//           }
//           case '11': {
//             self.lopDays[10] = self.lop;
//             break;
//           }
//           case '12': {
//             self.lopDays[11] = self.lop;
//             break;
//           }
//           case '13': {
//             self.lopDays[12] = self.lop;
//             break;
//           }
//           case '14': {
//             self.lopDays[13] = self.lop;
//             break;
//           }
//           case '15': {
//             self.lopDays[14] = self.lop;
//             break;
//           }
//           case '16': {
//             self.lopDays[15] = self.lop;
//             break;
//           }
//           case '17': {
//             self.lopDays[16] = self.lop;
//             break;
//           }
//           case '18': {
//             self.lopDays[17] = self.lop;
//             break;
//           }
//           case '19': {
//             self.lopDays[18] = self.lop;
//             break;
//           }
//           case '20': {
//             self.lopDays[19] = self.lop;
//             break;
//           }
//           case '21': {
//             self.lopDays[20] = self.lop;
//             break;
//           }
//           case '22': {
//             self.lopDays[21] = self.lop;
//             break;
//           }
//           case '23': {
//             self.lopDays[22] = self.lop;
//             break;
//           }
//           case '24': {
//             self.lopDays[23] = self.lop;
//             break;
//           }
//           case '25': {
//             self.lopDays[24] = self.lop;
//             break;
//           }
//           case '26': {
//             self.lopDays[25] = self.lop;
//             break;
//           }
//           case '27': {
//             self.lopDays[26] = self.lop;
//             break;
//           }
//           case '28': {
//             self.lopDays[27] = self.lop;
//             break;
//           }
//           case '29': {
//             self.lopDays[28] = self.lop;
//             break;
//           }
//           case '30': {
//             self.lopDays[29] = self.lop;
//             break;
//           }
//           case '31': {
//             self.lopDays[30] = self.lop;
//             break;
//           }
//           default: {
//             console.log('nvalid choice');
//             break;
//           }
//         }
//       }
//     });
//   }



//   setData(event: any) {
//     console.log('event-->' + event + 'backgroundColor' + this.backgroundColor);
//     if (event.value === 'fullDay') {
//       this.backgroundColor = 'rgb(234, 97, 83)';
//     } else if (event.value === 'halfDay') {
//       this.backgroundColor = 'rgb(91, 192, 222)';
//     } else if (event.value === 'quarterDay') {
//       this.backgroundColor = 'rgb(109, 87, 157)';
//     } else if (event.value === 'thridByFourthDay') {
//       this.backgroundColor = 'rgb(235, 127, 55)';
//     } else if (event.value === 'clear') {
//       this.backgroundColor = 'rgb(255, 255, 255)';
//     }
//   }


// }





import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {
  startOfDay,
  startOfMonth,
  startOfWeek,
  endOfDay,
  subDays,
  addDays,
  endOfWeek,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
  format,
} from 'date-fns';
import { Observable } from 'rxjs/Observable';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarMonthViewDay,
} from 'angular-calendar';
import { OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { data } from 'jquery';
import { KeycloakService } from '../../../../../keycloak/keycloak.service';


interface Event {
  empCode:string;
  empName:string;
  eventName: string;
  startDate: string;
  colorCode: string
}



@Component({
  selector: 'app-calendar-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./calendar-view.component.scss'],
  templateUrl: './calendar-view.component.html'
})


export class CalendarViewComponent implements OnInit{

fullCalendarDate: any;
firstDD: any;
firstMonth: any;
fromDate: any;
toDate: any;
lastDD: any;
lastMonth: any;
message:any;


view: string = 'month';
// view: CalendarView = CalendarView.Month;
legend$: any
events$: Observable<Array<CalendarEvent<{ event: Event }>>>;
viewDate: Date = new Date();
activeDayIsOpen: boolean = false;



 
  constructor(private http: HttpClient, private serviceApi: ApiCommonService) {}
  ngOnInit(): void {
    this.getCalendarData();
    this.getLegend();
  }

  getCalendarData(){
    const getStart: any = {
      month: startOfMonth,
      week: startOfWeek,
      day: startOfDay
    }[this.view];

    const getEnd: any = {
      month: endOfMonth,
      week: endOfWeek,
      day: endOfDay
    }[this.view];
    this.events$ = this.serviceApi
    .get('/v1/calendar/admin/' +  format(getStart(this.viewDate), 'YYYY-MM-DD') + '/' + format(getEnd(this.viewDate), 'YYYY-MM-DD'))
    .pipe(
      map((results) => {
        return results.map((obj: Event) => {
          return {
            title: obj.empCode!=null?(obj.eventName+" - "+obj.empName+" ("+obj.empCode.trim()+")"):"Holiday - "+obj.eventName,
            start: new Date(obj.startDate),
            // color: this.getColor(obj.eventName),
            color: obj.colorCode ? { primary: obj.colorCode } : { primary: '4f4f4f' },
            meta:{
              type:obj.eventName
            }
          };
        });
      })
    );

  }
  getLegend() {
    this.legend$ = this.serviceApi.get('/v1/calendar/milestone/')
  }
  

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    body.forEach(cell => {
      const groups: any = {};
      cell.events.forEach((event: CalendarEvent<{ type: string }>) => {
        groups[event.meta.type] = groups[event.meta.type] || [];
        groups[event.meta.type].push(event);
      });
      cell['eventGroups'] = Object.entries(groups);
    });
  }

  
}


















