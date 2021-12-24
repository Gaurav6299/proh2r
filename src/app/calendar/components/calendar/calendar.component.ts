import { ChangeDetectionStrategy, Component, OnInit, Output, EventEmitter, Input, ViewChild, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import 'rxjs/add/operator/map';
import { RequestOptions } from '@angular/http';
import { Headers } from '@angular/http';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { element } from 'protractor';
import 'fullcalendar';
import * as $ from 'jquery';
import { CalendarViewComponent } from './tab/calendar-view/calendar-view.component';
import { MilestonsViewComponent } from './tab/milestons-view/milestons-view.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, AfterViewInit {
  @ViewChild(CalendarViewComponent) calendarChild: CalendarViewComponent;
  @ViewChild(MilestonsViewComponent) mileStoneChild: MilestonsViewComponent;

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
  panelFirstWidth: number;
  panelFirstHeight: number;
  constructor(private http: Http,
    private fb: FormBuilder) {


  }
  loadEvents() {
    $('#calendar').fullCalendar('removeEvents');
    $('#calendar').fullCalendar('refetchEvents');
  }

  ngOnInit() {

    var self = this;
    let containerEl: JQuery = $('#calendar');
    containerEl.fullCalendar({
      // options here
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,basicWeek,basicDay'
      },
      height: 450,
      defaultDate: self.fullCalendarDate,
      navLinks: false, // can click day/week names to navigate views
      editable: true,
      showNonCurrentDates: false,
      eventLimit: true, // allow "more" link when too many events
      events: [
        {
          title: 'All Day Event',
          start: '2018-02-01'
        },
        {
          title: 'Long Event',
          start: '2018-02-07',
          end: '2018-02-10'
        },
        {
          id: 999,
          title: 'Repeating Event',
          start: '2018-02-09T16:00:00',
          allDay: true
        },
        {
          id: 999,
          title: 'Repeating Event',
          start: '2018-02-16T16:00:00'
        },
        {
          title: 'Conference',
          start: '2018-02-11',
          end: '2018-02-13'
        },
        {
          title: 'Meeting',
          start: '2018-02-12T10:30:00',
          end: '2018-02-12T12:30:00'
        },
        {
          title: 'Lunch',
          start: '2018-02-12T12:00:00'
        },
        {
          title: 'Meeting',
          start: '2018-02-12T14:30:00'
        },
        {
          title: 'Happy Hour',
          start: '2018-02-12T17:30:00'
        },
        {
          title: 'Dinner',
          start: '2018-02-12T20:00:00'
        },
        {
          title: 'Birthday Party',
          start: '2018-02-13T07:00:00'
        },
        {
          title: 'Click for Google',
          url: 'http://google.com/',
          start: '2018-02-28'
        }
      ],
      dayClick: function (date, jsEvent, view) {
        // $(this).css('background-color', self.backgroundColor);
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
  selectedTabChange(event) {
    if (event.index === 0) {
      // this.calendarChild.loadEvents();
    } else if (event.index === 1) {
      this.mileStoneChild.setPanel();
      this.mileStoneChild.getAllMileStonesRecord();
      this.mileStoneChild.isLeftVisible = false;
    }
  }

  ngAfterViewInit() {

  }

  // setPanel() {
  //   if ($('.divtoggleDiv').length > 0) {
  //     $('.divtoggleDiv')[1].style.display = 'none';

  //     $('.divtoggleDiv').width(this.panelFirstWidth);
  //   }
  // }

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
