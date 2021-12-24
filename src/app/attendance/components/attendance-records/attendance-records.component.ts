import { Component, OnInit, Inject, Input, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { ApiCommonService } from '../../../../app/services/api-common.service';
import { KeycloakService } from '../../../keycloak/keycloak.service';
import { Http } from '@angular/http';
import { Summary } from '@angular/compiler';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { AttendanceComponent } from '../attendance/attendance.component';
import { environment } from '../../../../environments/environment';
import { FileValidator } from './file-input.validator';
import { duration } from 'moment';
import { DatePipe } from '@angular/common';
import { st } from '@angular/core/src/render3';

declare var $: any;

@Component({
  selector: 'app-attendance-records',
  templateUrl: './attendance-records.component.html',
  styleUrls: ['./attendance-records.component.scss']
})
export class AttendanceRecordsComponent implements OnInit, AfterViewInit {
  panelFirstWidth: any;
  panelFirstHeight: any;
  attendanceRecords = [];
  attendanceByMonth = [];
  attendanceMonthList = [];
  date = [];
  allLocation = [];
  allDepartment = [];
  allDesignation = [];
  checkedRowData = [];
  allBand = [];
  nextRecords: any = 0;
  nextRange: any;
  previousRange: any;
  month: any;
  isLeftVisible: any;
  empAttendanceHistory = [];
  recordSumary = [];
  employeeName: any;
  multiSelect: any;
  className = 'a';
  bulkAction = [];
  bulkActionSelect: any;
  dateList = [];
  selectedDaysList = [];
  selectedDateList = [];
  singleDate: any;
  action: any;
  notificationMsg: any;
  regReason: any;
  empName: any;
  empCode: any;
  tempEmpCode: any;
  makeCommentMandatory;
  // displayedColumns = ['employee', 'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'actions'];
  displayedColumns = [];
  monthList = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
  // tslint:disable-next-line:max-line-length
  // displayedColumns1 = ['date', 'checkIn', 'checkOut', 'workingHours', 'deviationHours', 'lateEarlyMark', 'status', 'shiftTimings'];
  // date: element2.date1, : element2.inTime, : element2.outTime, status: element2.status, duration: element2.workingHours,
  //  shiftTiming: element2.shiftTimings, regularizationRequestStatus: element2.regularizationRequestStatus 
  displayedColumns1 = [
    { field: 'date', header: 'Date' },
    { field: 'inTime', header: 'Check In' },
    { field: 'outTime', header: 'Check Out' },
    { field: 'duration', header: 'Duration' },
    { field: 'odHours', header: 'OD Hours' },
    { field: 'slHours', header: 'SL Hours' },
    { field: 'status', header: 'Before Processing' },
    { field: 'afterProcessingStatus', header: 'After Processing' },
    { field: 'earlyLateMarkStatus', header: 'Early/Late Status' },
    { field: 'deviationHours', header: 'Deviation Hours' },
    { field: 'shiftTiming', header: 'ShiftTimings' },
    { field: 'remarks', header: 'Remarks' }
  ];
  // tslint:disable-next-line:max-line-length
  summaryDisplayedColumns = [
    { field: 'summary', header: 'Summary' },
    { field: 'daysPresent', header: 'Days Present' },
    { field: 'daysAbsent', header: 'Days Absent' },
    { field: 'leaveTaken', header: 'Leave Taken' },
    { field: 'weeklyOff', header: 'WeeklyOff' },
    { field: 'holidays', header: 'Holidays' },
    { field: 'invalidRecords', header: 'Invalid Records' },
    { field: 'totalHours', header: 'Total Hours' },
    { field: 'totalDeviation', header: 'Total Deviation' }
  ];

  dataSource: MatTableDataSource<Element>;
  dataSource1: MatTableDataSource<Element1>;
  dataSource2: MatTableDataSource<RecordSummary>;
  dynamicRows: any[];




  constructor(private atp: AmazingTimePickerService, private http: Http, public dialog: MatDialog, private serviceApi: ApiCommonService) {
    this.attendanceMonthList = [];
    const date = new Date();
    const monthName = this.monthList[date.getMonth()];
    const yearName = date.getFullYear();
    this.month = monthName + '-' + yearName;
    this.getAttendanceByMonth(this.month);
    var rolesArr = KeycloakService.getUserRole();
  }
  getAttendanceMonthList() {
    this.serviceApi.get2('/v1/attendance/attendanceRecords/attendanceMonthYearList').subscribe(
      res => {
        res != null ? res.forEach(element => {
          this.attendanceMonthList = [...this.attendanceMonthList, element];
        }) : this.attendanceMonthList = [];
      }
    );
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
  getAttendanceByMonth(month: any) {
    this.allBand = [];
    this.allDepartment = [];
    this.allDesignation = [];
    this.allLocation = [];
    console.log(this.month);
    this.attendanceRecords = [];
    let attendance = [];
    let attendanceDayList = [];
    this.bulkAction = [];
    this.selectedDaysList = [];
    this.tempEmpCode = '';
    console.log('month ---------' + month);
    const monthYear = month.split('-');

    const date = new Date(month);
    console.log('day -->');
    console.log(date.getDay());
    this.nextRecords = -date.getDay();
    this.attendanceByMonth = [];
    this.nextRange = '-' + monthYear[0];
    this.previousRange = monthYear[0];
    console.log('Next Range-----------' + this.nextRange);


    this.serviceApi.get2('/v1/attendance/attendanceRecords/' + month).subscribe(
      res => {
        console.log(res);
        res.attendanceRecordMonthlyForAllEmployeeVOList.forEach(element => {
          var attendanceListIncludingOnDuty = [];
          attendanceDayList = [];
          this.dateList = [];
          // if (!this.allBand.some(band => band.label === element.band)) {
          //   this.allBand.push({
          //     label: element.band, value: element.band
          //   });
          // }
          // if (!this.allDepartment.some(department => department.label === element.department)) {
          //   this.allDepartment.push({
          //     label: element.department, value: element.department
          //   });
          // }
          // if (!this.allDesignation.some(designation => designation.label === element.designation)) {
          //   this.allDesignation.push({
          //     label: element.designation, value: element.designation
          //   });
          // }
          // if (!this.allLocation.some(location => location.label === element.location)) {
          //   this.allLocation.push({
          //     label: element.location, value: element.location
          //   });
          // }
          element.attendanceRecordsOnDayVOList.forEach(element2 => {
            if (element2.status != 'On Duty') {
              attendanceDayList.push(
                {
                  date: element2.attendanceRecordDayDateVO.day,
                  date1: element2.attendanceRecordDayDateVO.date,
                  status: ((element2.status == null) ? 'N/A' : element2.status),
                  color: element2.color,
                  inTime: element2.inTime,
                  outTime: element2.outTime,
                  workingHours: element2.duration,
                  shiftTimings: element2.shiftTiming,
                  regularizationStatus: element2.regularizationRequestStatus,
                  regularizationRequestsId: element2.regularizationRequestsId,
                  regularizationReason: element2.regularizationReason,
                  regularizationComments: element2.regularizationComments,
                  requestType: element2.requestType,
                  checkIn: element2.checkIn,
                  checkOut: element2.checkOut,
                  syncWithAttendanceProcess: element2.syncWithAttendanceProcess,
                  afterProcessingStatus: element2.afterProcessingStatus,
                  odHours: element2.odHours,
                  slHours: element2.slHours,
                  remarks: element2.remarks,
                }
              );
              this.dateList.push(
                {
                  day: element2.attendanceRecordDayDateVO.day,
                  date: element2.attendanceRecordDayDateVO.date
                });

            }
          });
          element.attendanceRecordsOnDayVOList.forEach(element2 => {
            attendanceListIncludingOnDuty.push(
              {
                date: element2.attendanceRecordDayDateVO.day,
                date1: element2.attendanceRecordDayDateVO.date,
                status: ((element2.status == null) ? 'N/A' : element2.status),
                inTime: element2.inTime,
                outTime: element2.outTime,
                workingHours: element2.duration,
                shiftTimings: element2.shiftTiming,
                regularizationStatus: element2.regularizationRequestStatus,
                regularizationRequestsId: element2.regularizationRequestsId,
                regularizationReason: element2.regularizationReason,
                regularizationComments: element2.regularizationComments,
                requestType: element2.requestType,
                checkIn: element2.checkIn,
                checkOut: element2.checkOut,
                earlyLateMarkStatus: element2.earlyLateMarkStatus,
                deviationHours: element2.deviationHours,
                syncWithAttendanceProcess: element2.syncWithAttendanceProcess,
                afterProcessingStatus: element2.afterProcessingStatus,
                odHours: element2.odHours,
                slHours: element2.slHours,
                remarks: element2.remarks,
              }
            );
            this.dateList.push(
              {
                day: element2.attendanceRecordDayDateVO.day,
                date: element2.attendanceRecordDayDateVO.date
              });
          });


          let summary1: RecordSummary = {
            summary: 'Before Processing',
            daysPresent: element.presentCount,
            daysAbsent: element.absentCount,
            weeklyOff: element.weeklyOffCount,
            leaveTaken: element.leaveTakenCount,
            holidays: element.holidayCount,
            invalidRecords: element.invalidRecordCount,
            totalHours: element.totalDuration,
            totalDeviation: element.totalDeviation
          };

          let summary2: RecordSummary = {
            summary: 'After Processing',
            daysPresent: element.afterPresentCount,
            daysAbsent: element.afterAbsentCount,
            weeklyOff: element.afterWeeklyOffCount,
            leaveTaken: element.afterLeaveTakenCount,
            holidays: element.afterHolidayCount,
            invalidRecords: element.afterInvalidRecordCount,
            totalHours: element.totalDuration,
            totalDeviation: element.totalDeviation
          };



          attendance.push(
            {
              empName: element.empName + '-' + element.empCode,
              empCode: element.empCode,
              attendanceRecords: attendanceDayList,
              attendanceRecordsIncludingOnDuty: attendanceListIncludingOnDuty,
              summary: summary1,
              afterProcessSummary: summary2
            }
          );
        });


        console.log('-------------  Attendance Informations --------------- ');

        this.attendanceRecords.push({ month: res.monthYear, attendance: attendance });
        console.log(this.attendanceRecords);
      },
      error => {
        console.log('there is something json');
      },
      () => {
        //this.nextRecords = 5;
        this.attendanceByMonth = [];
        console.log('this.attendanceRecords-->');
        console.log(this.attendanceRecords);
        this.attendanceRecords.forEach(element => {
          if (element.month === month) {
            console.log('Month================== : ' + this.month);
            element.attendance.forEach(element1 => {
              this.date = [];
              element1.attendanceRecords.forEach(element2 => {
                this.date.push(element2.date);
              });
              // tslint:disable-next-line:max-line-length
              this.attendanceByMonth.push({ employeeName: element1.empName, empCode: element1.empCode, attendanceRecordsIncludingOnDuty: element1.attendanceRecordsIncludingOnDuty, attendanceRecords: element1.attendanceRecords, summary: element1.summary, afterProcessSummary: element1.afterProcessSummary });
            });
          }
        });

        console.log('this.attendanceByMonth -->');
        console.log(this.attendanceByMonth);
        this.dataSource = new MatTableDataSource<Element>(this.attendanceByMonth);

        // alert();
        this.createDynamicColumn();
        this.createDynamicRows();
        this.getAttendanceMonthList();
        this.hasRegularizeReason();

      });
  }
  createDynamicColumn() {
    this.displayedColumns = [];
    this.displayedColumns.push({
      field: 'empName', header: 'Employee'
    })
    // this.displayedColumns.push({
    //   field: 'location', header: 'Location'
    // })
    // this.displayedColumns.push({
    //   field: 'band', header: 'Band'
    // })
    // this.displayedColumns.push({
    //   field: 'department', header: 'Department'
    // })
    // this.displayedColumns.push({
    //   field: 'designation', header: 'Designation'
    // });
    this.displayedColumns.push({
      field: 'SUN ' + ((this.date[0 + +this.nextRecords] == undefined) ? '  ' : this.date[0 + +this.nextRecords]), header: 'SUN ' + ((this.date[0 + +this.nextRecords] == undefined) ? '  ' : this.date[0 + +this.nextRecords])
    });
    this.displayedColumns.push({
      field: 'MON ' + ((this.date[1 + +this.nextRecords] == undefined) ? '  ' : this.date[1 + +this.nextRecords]), header: 'MON ' + ((this.date[1 + +this.nextRecords] == undefined) ? '  ' : this.date[1 + +this.nextRecords])
    });
    this.displayedColumns.push({
      field: 'TUE ' + ((this.date[2 + +this.nextRecords] == undefined) ? '  ' : this.date[2 + +this.nextRecords]), header: 'TUE ' + ((this.date[2 + +this.nextRecords] == undefined) ? '  ' : this.date[2 + +this.nextRecords])
    });
    this.displayedColumns.push({
      field: 'WED ' + ((this.date[3 + +this.nextRecords] == undefined) ? '  ' : this.date[3 + +this.nextRecords]), header: 'WED ' + ((this.date[3 + +this.nextRecords] == undefined) ? '  ' : this.date[3 + +this.nextRecords])
    });
    this.displayedColumns.push({
      field: 'THU ' + ((this.date[4 + +this.nextRecords] == undefined) ? '  ' : this.date[4 + +this.nextRecords]), header: 'THU ' + ((this.date[4 + +this.nextRecords] == undefined) ? '  ' : this.date[4 + +this.nextRecords])
    });
    this.displayedColumns.push({
      field: 'FRI ' + ((this.date[5 + +this.nextRecords] == undefined) ? '  ' : this.date[5 + +this.nextRecords]), header: 'FRI ' + ((this.date[5 + +this.nextRecords] == undefined) ? '  ' : this.date[5 + +this.nextRecords])
    });
    this.displayedColumns.push({
      field: 'SAT ' + ((this.date[6 + +this.nextRecords] == undefined) ? '  ' : this.date[6 + +this.nextRecords]), header: 'SAT ' + ((this.date[6 + +this.nextRecords] == undefined) ? '  ' : this.date[6 + +this.nextRecords])
    });
    this.displayedColumns.push({
      field: 'action', header: 'Actions'
    });
  }
  paginate(event) {
    console.log(event);
  }
  createDynamicRows() {
    this.dynamicRows = [];
    // this.attendanceByMonth = this.attendanceByMonth.map(record => {
    //   // let temp = record.attendanceRecords[i + +this.nextRecords];status: "On Duty"
    //   console.log(record);

    //   record.attendanceRecords.filter(attendance => {
    //     return attendance.status != "On Duty";
    //   });
    //   return record;
    // });
    // // record.attendanceRecords[i + +this.nextRecords].filter(attendance => attendance.status != 'On Duty')
    // console.log(this.attendanceByMonth);
    this.attendanceByMonth.forEach(emp => {
      console.log(emp);
      this.dynamicRows.push({
        "empName": emp.employeeName,
        ['SUN ' + ((this.date[0 + +this.nextRecords] == undefined) ? '  ' : this.date[0 + +this.nextRecords])]: ((emp.attendanceRecords[0 + +this.nextRecords] == undefined) ? '   ' : emp.attendanceRecords[0 + +this.nextRecords]),
        ['MON ' + ((this.date[1 + +this.nextRecords] == undefined) ? '  ' : this.date[1 + +this.nextRecords])]: ((emp.attendanceRecords[1 + +this.nextRecords] == undefined) ? '   ' : emp.attendanceRecords[1 + +this.nextRecords]),
        ['TUE ' + ((this.date[2 + +this.nextRecords] == undefined) ? '  ' : this.date[2 + +this.nextRecords])]: ((emp.attendanceRecords[2 + +this.nextRecords] == undefined) ? '   ' : emp.attendanceRecords[2 + +this.nextRecords]),
        ['WED ' + ((this.date[3 + +this.nextRecords] == undefined) ? '  ' : this.date[3 + +this.nextRecords])]: ((emp.attendanceRecords[3 + +this.nextRecords] == undefined) ? '   ' : emp.attendanceRecords[3 + +this.nextRecords]),
        ['THU ' + ((this.date[4 + +this.nextRecords] == undefined) ? '  ' : this.date[4 + +this.nextRecords])]: ((emp.attendanceRecords[4 + +this.nextRecords] == undefined) ? '   ' : emp.attendanceRecords[4 + +this.nextRecords]),
        ['FRI ' + ((this.date[5 + +this.nextRecords] == undefined) ? '  ' : this.date[5 + +this.nextRecords])]: ((emp.attendanceRecords[5 + +this.nextRecords] == undefined) ? '   ' : emp.attendanceRecords[5 + +this.nextRecords]),
        ['SAT ' + ((this.date[6 + +this.nextRecords] == undefined) ? '  ' : this.date[6 + +this.nextRecords])]: ((emp.attendanceRecords[6 + +this.nextRecords] == undefined) ? '   ' : emp.attendanceRecords[6 + +this.nextRecords])
      });
    })
    console.log(this.dynamicRows);


  }
  ngAfterViewInit(): void {
    if ($('.divtoggleDiv').length > 0) {
      this.panelFirstWidth = $('.divtoggleDiv')[0].offsetWidth;
      console.log('panelDive[0] width -->' + $('.divtoggleDiv')[0].offsetWidth);
      this.panelFirstHeight = $('.paneDiv')[0].offsetHeight;
      console.log('panelDive[0] height -->' + $('.divtoggleDiv')[0].offsetHeight);
      $('.divtoggleDiv')[1].style.display = 'none';
    }
  }
  setPanel() {
    if ($('.divtoggleDiv').length > 0) {
      $('.divtoggleDiv')[1].style.display = 'none';

      $('.divtoggleDiv').width(this.panelFirstWidth);
    }
  }
  applyFilter(filterValue: string) {
    console.log('hello' + filterValue);
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  viewAttendanceHistory(element: any) {
    console.log(element);
    // element = element.attendanceRecordsIncludingOnDuty;
    $('.divtoggleDiv')[1].style.display = 'block';
    this.employeeName = element.empName;
    console.log(element);
    console.log(this.attendanceByMonth);
    this.empAttendanceHistory = [];
    this.recordSumary = [];
    console.log(element);
    console.log('Inside View Attendance History ---- ' + element.employeeName);
    this.attendanceByMonth.forEach(element1 => {
      if (element.empName === element1.employeeName) {
        //  console.log('-----------' + element1.employeeName);
        element1.attendanceRecordsIncludingOnDuty.forEach(element2 => {
          // tslint:disable-next-line:max-line-length
          this.empAttendanceHistory.push({ date: element2.date1, inTime: element2.inTime, outTime: element2.outTime, status: element2.status, afterProcessingStatus: element2.afterProcessingStatus, duration: element2.workingHours, shiftTiming: element2.shiftTimings, regularizationRequestStatus: element2.regularizationRequestStatus, earlyLateMarkStatus: element2.earlyLateMarkStatus, deviationHours: element2.deviationHours, odHours: element2.odHours, slHours: element2.slHours, remarks: element2.remarks, });
        });
        this.recordSumary.push({
          summary: element1.summary.summary,
          daysPresent: element1.summary.daysPresent,
          daysAbsent: element1.summary.daysAbsent,
          weeklyOff: element1.summary.weeklyOff,
          leaveTaken: element1.summary.leaveTaken,
          holidays: element1.summary.holidays,
          invalidRecords: element1.summary.invalidRecords,
          totalHours: element1.summary.totalHours,
          totalDeviation: element1.summary.totalDeviation
        });
        this.recordSumary.push({
          summary: element1.afterProcessSummary.summary,
          daysPresent: element1.afterProcessSummary.daysPresent,
          daysAbsent: element1.afterProcessSummary.daysAbsent,
          weeklyOff: element1.afterProcessSummary.weeklyOff,
          leaveTaken: element1.afterProcessSummary.leaveTaken,
          holidays: element1.afterProcessSummary.holidays,
          invalidRecords: element1.afterProcessSummary.invalidRecords,
          totalHours: element1.afterProcessSummary.totalHours,
          totalDeviation: element1.afterProcessSummary.totalDeviation
        });


      }


    });
    this.recordSumary = this.recordSumary;
    console.log(this.recordSumary);
    console.log(this.empAttendanceHistory);

    this.dataSource1 = new MatTableDataSource<Element1>(this.empAttendanceHistory);
    this.dataSource2 = new MatTableDataSource<RecordSummary>(this.recordSumary);
  }
  nextWeek() {
    if (this.nextRecords < 28) {
      this.nextRecords = +this.nextRecords + 7;
      if (this.multiSelect) {
        this.bulkAction.forEach(element2 => {
          //  console.log('Selected Item ----' + element2.sectionClass + 'has Select Class -----' + element2.hasSelectClass);
          if (element2.hasSelectClass === true) {
            setTimeout(function () {
              $('.' + element2.sectionClass).addClass('selectClass');
            }, 1);
          }
          // tslint:disable-next-line:one-line
          else {
            setTimeout(function () {
              $('.' + element2.sectionClass).removeClass('selectClass');
            }, 1);
          }
        });
      }
    }
    // tslint:disable-next-line:one-line
    else {
      this.nextRecords = this.nextRecords;
    }
    this.createDynamicColumn();
    this.createDynamicRows();
  }
  previousWeek() {
    //  console.log('previousWeek called');
    if (this.nextRecords > 0) {
      this.nextRecords = +this.nextRecords - 7;
      if (this.multiSelect) {
        this.bulkAction.forEach(element2 => {
          //      console.log('Selected Item ----' + element2.sectionClass + 'has Select Class -----' + element2.hasSelectClass);
          if (element2.hasSelectClass === true) {
            setTimeout(function () {
              $('.' + element2.sectionClass).addClass('selectClass');
            }, 1);
          }
          // tslint:disable-next-line:one-line
          else {
            setTimeout(function () {
              $('.' + element2.sectionClass).removeClass('selectClass');
            }, 1);
          }
        });
      }
    }
    // tslint:disable-next-line:one-line
    else {
      this.nextRecords = this.nextRecords;
    }
    this.createDynamicColumn();
    this.createDynamicRows();
  }
  onMultiSelectChange() {
    if (!this.multiSelect) {
      this.bulkAction.forEach(element2 => {
        $('.' + element2.sectionClass).removeClass('selectClass');
        //      console.log('Selected Item ----' + element2.sectionClass + 'has Select Class -----' + element2.hasSelectClass);
      });
    }
  }
  hasRegularizeReason() {
    this.serviceApi.get('/v1/attendance/settings/general/').
      subscribe(
        res => {
          this.regReason = res.modifyEmpRegReq;
        },


      );
  }
  returnDayInNumber(day: String) {
    day = day.substring(0, 3);
    switch (day) {
      case "SUN": return 0;
      case "MON": return 1;
      case "TUE": return 2;
      case "WED": return 3;
      case "THU": return 4;
      case "FRI": return 5;
      case "SAT": return 6;
    }

  }

  // changeColor(status: any) {
  //   if (status !== undefined) {
  //     return status.includes('Present') ? '#516b2d' : status === 'Absent' ? '#ea6153' : status === 'Incomplete Record' ? '#eb7f37' : status === 'Approved Halfday' ? '#4aa3df' : status === 'Weekly Off' ? '#19B696' : status === 'Holiday' ? '#9796F2' : status.includes('Leave') === true ? '#f59bad' : (status.includes('Half') === true || status.includes('HD') === true) ? '#4aa3df' : status === 'In' ? '#a9d56c' : status === 'Out' ? '#a9d56c' : status === 'Loss of Pay' ? '#ea6153' : status === 'No Shift/Attendance Template Assigned' ? '#777777' : status === null ? '#777777' : status === 'N/A' ? '#777777' : '';
  //   }
  // }
  regularizationReq(element: any, row: any, className1: any) {
    if (className1.syncWithAttendanceProcess) {
      return;
    }
    console.log(element);
    var rowCopy = row;
    className1 = 'a' + className1.date + row.empName.split("-")[1];
    console.log(className1);
    console.log(row.empName.split("-")[1]);
    var empCode = row.empName.split("-")[1];
    var empName = row.empName.split("-")[0].trim();
    var row = row[element];
    element = this.returnDayInNumber(element);
    var day = this.date[element + this.nextRecords];

    if (day === undefined) {
      return;
    }    
      if (this.multiSelect) {
        this.bulkActionSelect = '';
        if ($('.' + className1).hasClass('selectClass')) {
          $('.' + className1).removeClass('selectClass');
          this.bulkAction = this.bulkAction.filter(function (item) {
            return item.sectionClass != className1;
          })
          this.selectedDaysList = this.selectedDaysList.filter(function (item) {
            return item.date !== day;
          })
        }
        else {
          // if (this.selectedDaysList.length === 0) {
          // console.log('length is 0')
          // this.empName = rowCopy.empName.split("-")[0];
          // this.empCode = rowCopy.empName.split("-")[1];
          // this.tempEmpCode = rowCopy.empName.split("-")[1];
          $('.' + className1).addClass('selectClass');
          this.bulkAction.push({ sectionClass: className1, hasSelectClass: true });
          this.selectedDaysList.push({
            "date": day,
            "empCode": rowCopy.empName.split("-")[1]
          });
          // }
          // else if (this.tempEmpCode === rowCopy.empName.split("-")[1]) {
          //   console.log('length is not 0')
          //   $('.' + className1).addClass('selectClass');
          //   this.bulkAction.push({ sectionClass: className1, hasSelectClass: true });
          //   this.selectedDaysList.push(day);
          // }
          // else {
          //   this.warningNotification('Please select only one employee records at one time. ');
          // }

        }
        this.selectedDaysList.forEach(element2 => {
          console.log('day list------------------' + element2);
        });
        console.log('Selected Records emp Code---' + this.empCode);
      }
      // tslint:disable-next-line:one-line
      else if (!this.multiSelect) {
        this.empName = empName;
        this.empCode = empCode;
        this.hasRegularizeReason();
        this.singleDate = '';
        this.dateList.forEach(element => {
          if (day == element.day)
            this.singleDate = element.date
        });
        console.log('Atteddance Information ----' + JSON.stringify(element));
        console.log('Atteddance Information class Day ----' + day);

        // let dialogRef = this.dialog.open(NewRegularizationReqComponent, {
        //   width: '500px',
        //   data: { bulkAction: false }
        // });
        let dialogRef = this.dialog.open(NewRegularizationReqComponent, {
          // width: '500px',
          panelClass: 'custom-dialog-container',
          data: {
            message: this.notificationMsg,
            status: this.action,
            hasRegReason: this.regReason,
            singleDate: this.singleDate,
            empName: empName,
            empCode: empCode,
            request: row,
            makeCommentMandatory: this.makeCommentMandatory
          }
        });
        // dialogRef.close();
        dialogRef.afterClosed().subscribe(result => {

          if (result !== undefined) {
            //  console.log('Result value ..... ' + JSON.stringify(result));
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
              this.getAttendanceByMonth(this.month);
            }
          }
        });
      }
  }
  bulkActionFunctionality() {
    this.hasRegularizeReason();
    this.singleDate = '';
    console.log('this.selectedDaysList........' + this.selectedDaysList.length);
    if (this.selectedDaysList.length !== 0) {
      let dialogRef = this.dialog.open(AddBulkRegReqComponent, {
        // width: '500px',
        panelClass: 'custom-dialog-container',
        data: {
          message: this.notificationMsg,
          status: this.action,
          hasRegReason: this.regReason,
          bulkDate: this.selectedDateList,
          empName: this.employeeName,
          selectedDaysList: this.selectedDaysList,
          month: this.month
        }
      });
      // dialogRef.close();
      dialogRef.afterClosed().subscribe(result => {
        this.bulkActionSelect = '';
        if (result !== undefined) {
          //  console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            this.notificationMsg = result.message;
            this.successNotification(this.notificationMsg);

          }


        }
        this.getAttendanceByMonth(this.month);
      });
    }
    else {
      this.warningNotification('Please select Date for regularize attendance.');
    }
  }
  uploadAttendance() {
    let dialogRef = this.dialog.open(UploadAttendanceComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: {
        event: event,
        monthList: this.attendanceMonthList
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.status === 'Response') {
          this.notificationMsg = result.message;
          this.successNotification(this.notificationMsg);
          this.getAttendanceByMonth(this.month);
        } else if (result.status === 'Error') {
          this.notificationMsg = result.message;
          // this.warningNotification(this.notificationMsg);
        }
      }
    });
  }
  ngOnInit() {
    this.dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
    this.dataSource1 = new MatTableDataSource<Element1>(ELEMENT_DATA1);
  }


}
@Component({
  selector: 'app-upload-attendance-dialog',
  templateUrl: 'upload-attendance-dialog.html',
  styleUrls: ['./new-regularization-req.scss']
})
export class UploadAttendanceComponent {
  action: any;
  error: any;
  errorMessage: any;
  selectedFiles: FileList;
  currentFileUpload: File;
  selectedFilesName: string;
  notificationMsg: any;
  monthList = [];
  uploadAttendanceRecords: FormGroup
  attendanceRecordList = [];
  constructor(public dialogRef: MatDialogRef<UploadAttendanceComponent>, private fb: FormBuilder,
    private serviceApi: ApiCommonService, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.monthList = data.monthList;
    this.uploadAttendanceRecords = this.fb.group({
      month: [''],
      file: ['', [FileValidator.validate]]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  downloadFormat() {
    this.serviceApi.get('/v1/attendance/attendanceRecords/download/attd-sheet').subscribe(
      res => {
        window.open(environment.storageServiceBaseUrl + res.url);
      }
    );
  }

  uploadFormat() {
    $('#uploadFile').click();
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
  selectFile(event) {
    this.selectedFiles = event.target.files;
    this.selectedFilesName = this.selectedFiles.item(0).name;
    this.uploadAttendanceRecords.controls.file.setValue(this.selectedFiles ? this.selectedFilesName : null)
  }


  upload() {
    console.log('upload method called-->');
    if (this.uploadAttendanceRecords.valid && this.uploadAttendanceRecords.controls.file.value != null) {
      this.currentFileUpload = this.selectedFiles.item(0);
      const monthYear = this.uploadAttendanceRecords.controls.month.value.split('-');
      const file = <File>this.currentFileUpload;
      let formdata: FormData = new FormData();
      formdata.append('file', file);
      this.serviceApi.postWithFormData('/v1/attendance/attendanceRecords/bulkrecords', formdata).subscribe(
        res => {
          this.action = 'Response';
          this.error = res.message;
          this.close();
        },
        err => {
          this.action = 'Error';
          this.error = err.message;
        });
    } else {
      Object.keys(this.uploadAttendanceRecords.controls).forEach(field => { // {1}
        const control = this.uploadAttendanceRecords.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
      this.uploadAttendanceRecords.controls.file.setValidators([Validators.required])
    }

  }

  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
}
@Component({
  templateUrl: 'bulk-attendance-response.html',
  // styleUrls: ['./employee-model.scss']
})
export class BulkAttendanceResponeModelComponent implements OnInit {

  action: any;
  error = 'Error message';
  res: any;
  title: any;
  dataSource: MatTableDataSource<Element>;
  displayedColumns = ['empCode', 'statusMsg', 'inviteStatus'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private _fb: FormBuilder, private serviceApi: ApiCommonService,
    public dialogRef: MatDialogRef<BulkAttendanceResponeModelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(JSON.stringify(this.data));
    this.res = [];
    this.res = this.data.res;
    this.title = this.data.title;
    console.log(JSON.stringify(this.res));
  }

  ngOnInit() {


  }
  ngAfterViewInit() {
    console.log(this.res);
    this.dataSource = new MatTableDataSource<Element>(this.res);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  close(): void {
    console.log('this.data');
    this.data.message = this.error;
    this.data.status = this.action;
    console.log("message----- " + this.data.message);
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    this.dialogRef.close(this.data);
  }


}

@Component({
  selector: 'app-new-regularization-req',
  templateUrl: 'new-regularization-req.html',
  styleUrls: ['./new-regularization-req.scss']
})
export class NewRegularizationReqComponent implements OnInit {
  action: any;
  error: any;
  public NewRegularizeRequest: FormGroup;
  regReasonList = [];
  regShiftList = []
  assignShift: any;
  isRegReason: any;
  request: any;
  makeCommentMandatory: boolean = false;
  ///v1/attendance/settings/general/
  constructor(private _fb: FormBuilder, private datePipe: DatePipe,
    public dialogRef: MatDialogRef<NewRegularizationReqComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private serviceApi: ApiCommonService) {
    console.log('Has reason---- ' + JSON.stringify(data));
    this.isRegReason = data.hasRegReason;
    // this.makeCommentMandatory = data.makeCommentMandatory;
    let date = this.datePipe.transform(this.data.singleDate, 'dd-MM-yyyy');
    this.serviceApi.get('/v1/attendance/regularization/get-shift-employee/' + this.data.empCode + '/' + date).subscribe(
      res => {
        this.assignShift = res;
        this.NewRegularizeRequest.controls.shift.setValue(this.assignShift.shiftRecordId);
      },
      err => { },
      () => { }
    );
    this.serviceApi.get('/v1/attendance/settings/shift/').subscribe(
      res => {
        res.forEach(element => {
          this.regShiftList = [...this.regShiftList, element];
        });
      },
      err => { },
      () => { }
    );
    this.serviceApi.get('/v1/attendance/settings/templates/temp/' + this.data.empCode).
      subscribe(
        res => {
          if (res != null) {
            this.makeCommentMandatory = res.isCommentMandatoryForRegReq;
            if (this.makeCommentMandatory) {
              this.NewRegularizeRequest.controls.comment.setValidators([Validators.required]);
              this.NewRegularizeRequest.controls.comment.updateValueAndValidity();
            }
          }
        });
    this.serviceApi.get('/v1/attendance/settings/regularizationReason/' + this.data.empCode).
      subscribe(
        res => {
          console.log('Reason List-------------' + JSON.stringify(res));
          res != null ? res.forEach(element => {
            this.regReasonList.push({
              reasonId: element.reasonId,
              assignedReason: element.assignedReason,
            });
          }) : this.regReasonList = [];
        });
    this.request = data.request;
    // regularizationComments: "sddfs"
    // regularizationReason: "40"
    // regularizationRequestsId: "100"
    // regularizationStatus: "PENDING"
    // requestType: "CHECK_IN"
    console.log(this.request);

  }

  onChangeReqType(value) {
    // console.log('Inside On change request type ---');
    var date = new Date();
    var hh = date.getHours();
    var mm = date.getMinutes();
    if (value === 'CHECK_IN') {
      this.NewRegularizeRequest.controls.checkInTime.setValue(this.datePipe.transform(this.data.singleDate, 'dd-MM-yyyy') + ' ' + hh + ':' + mm);
      this.NewRegularizeRequest.controls.checkOutTime.setValue(null);
      // this.NewRegularizeRequest.controls.checkInTime.setValidators(Validators.required);
      // this.NewRegularizeRequest.controls.checkOutTime.clearValidators();
      // this.NewRegularizeRequest.controls.checkOutTime.updateValueAndValidity();
    }
    else if (value === 'CHECK_OUT') {
      this.NewRegularizeRequest.controls.checkOutTime.setValue(this.datePipe.transform(this.data.singleDate, 'dd-MM-yyyy') + ' ' + hh + ':' + mm);
      this.NewRegularizeRequest.controls.checkInTime.setValue(null);
      // this.NewRegularizeRequest.controls.checkOutTime.setValidators(Validators.required)
      // this.NewRegularizeRequest.controls.checkInTime.clearValidators();
      // this.NewRegularizeRequest.controls.checkInTime.updateValueAndValidity();
    }
    else if (value === 'CHECKIN_AND_CHECKOUT') {
      this.NewRegularizeRequest.controls.checkInTime.setValue(this.datePipe.transform(this.data.singleDate, 'dd-MM-yyyy') + ' ' + hh + ':' + mm);
      this.NewRegularizeRequest.controls.checkOutTime.setValue(this.datePipe.transform(this.data.singleDate, 'dd-MM-yyyy') + ' ' + hh + ':' + mm);
      // this.NewRegularizeRequest.controls.checkInTime.setValidators(Validators.required)
      // this.NewRegularizeRequest.controls.checkOutTime.setValidators(Validators.required)
      // this.NewRegularizeRequest.controls.checkOutTime.setValue(null);
      // this.NewRegularizeRequest.controls.checkInTime.setValue(null);
    }

  }
  ngAfterViewInit(): void {
  }
  onSubmitRequest() {
    if (this.NewRegularizeRequest.valid) {
      console.log('form value ' + JSON.stringify(this.NewRegularizeRequest.value));
      let checkInTime = this.datePipe.transform(this.NewRegularizeRequest.controls.checkInTime.value, 'dd-MM-yyyy HH:mm');
      let checkOutTime = this.datePipe.transform(this.NewRegularizeRequest.controls.checkOutTime.value, 'dd-MM-yyyy HH:mm');
      if (this.isRegReason) {
        var body = {
          'empCode': this.data.empCode,
          'regularizationDate': [this.data.singleDate],
          'requestType': this.NewRegularizeRequest.controls.requestType.value,
          'checkInTime': checkInTime,
          'checkOutTime': checkOutTime,
          'regularizationReason': this.NewRegularizeRequest.controls.reason.value,
          'shiftRecordId': this.NewRegularizeRequest.controls.shift.value,
          'regularizationComments': this.NewRegularizeRequest.controls.comment.value,
        };
      }

      else {
        var body = {
          'empCode': this.data.empCode,
          'regularizationDate': [this.data.singleDate],
          'requestType': this.NewRegularizeRequest.controls.requestType.value,
          'checkInTime': checkInTime,
          'checkOutTime': checkOutTime,
          'regularizationReason': null,
          'shiftRecordId': this.NewRegularizeRequest.controls.shift.value,
          'regularizationComments': this.NewRegularizeRequest.controls.comment.value,
        };
      }
      console.log('Body ---------- Json data-------   ' + JSON.stringify(body));
      return this.serviceApi.post('/v1/attendance/regularization/admin/', body).
        subscribe(
          res => {
            //  console.log('Applied Leave Successfully...' + JSON.stringify(res));
            this.action = 'Response';
            this.error = res.message;
            this.close();
          },
          err => {
            //  console.log('there is something error.....  ' + err.message);
            this.action = 'Error';
            this.error = err.message;
            this.close();
          });
    }
    else {
      Object.keys(this.NewRegularizeRequest.controls).forEach(field => { // {1}
        const control = this.NewRegularizeRequest.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }

  }
  ngOnInit() {
    if (this.isRegReason) {
      console.log('Inside Has regularization reason....');
      this.NewRegularizeRequest = this._fb.group(
        {
          // selectEmployee: ['', Validators.required],
          // regReqDate: [this.data.singleDate, Validators.required],
          requestType: ['', Validators.required],
          checkInTime: [null],
          checkOutTime: [null],
          reason: ['', [Validators.required]],
          shift: ['', [Validators.required]],
          comment: [''],
        }
      );
    }
    else {
      this.NewRegularizeRequest = this._fb.group(
        {
          // selectEmployee: ['', Validators.required],
          //  regReqDate: [this.data.singleDate, Validators.required],
          requestType: ['', Validators.required],
          checkInTime: [null],
          checkOutTime: [null],
          shift: ['', [Validators.required]],
          comment: [''],
        }
      );
    }
    this.NewRegularizeRequest.controls.requestType.setValue(this.request.requestType);
    if (this.request.regularizationReason != "" && this.request.regularizationReason != null)
      this.NewRegularizeRequest.controls.reason.setValue(+this.request.regularizationReason);
    this.NewRegularizeRequest.controls.comment.setValue(this.request.regularizationComments);
    this.NewRegularizeRequest.controls.checkInTime.setValue(this.request.checkIn == "" ? null : this.request.checkIn);
    this.NewRegularizeRequest.controls.checkOutTime.setValue(this.request.checkOut == "" ? null : this.request.checkOut);
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


// Bulk Action add request....

@Component({
  templateUrl: 'bulk-regularization-req.html',
  styleUrls: ['./new-regularization-req.scss']
})
export class AddBulkRegReqComponent implements AfterViewInit {

  action: any;
  error: any;
  message: any;
  public bulkRegularizeRequest: FormGroup;
  regReasonList = [];
  isRegReason: any;
  selectedDaysList = [];
  month: any;
  ///v1/attendance/settings/general/
  constructor(public dialog: MatDialog,
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<AddBulkRegReqComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private serviceApi: ApiCommonService) {
    console.log('Has reason bulk---- ' + JSON.stringify(data));
    this.isRegReason = data.hasRegReason;
    this.selectedDaysList = data.selectedDaysList;
    this.month = data.month;
    console.log(this.selectedDaysList);

    this.serviceApi.get('/v1/attendance/settings/regularizationReason/').
      subscribe(
        res => {
          console.log('Reason List-------------' + JSON.stringify(res));
          res != null ? res.forEach(element => {
            this.regReasonList.push({
              reasonId: element.reasonId,
              reason: element.reason,
            });
          }) : this.regReasonList = [];
        });
  }
  onChangeReqType(value) {
    console.log('Inside On change request type ---');
    if (value === 'CHECK_IN') {
      this.bulkRegularizeRequest.controls.checkInTime.setValidators([Validators.required])
      this.bulkRegularizeRequest.controls.checkOutTime.clearValidators();
      this.bulkRegularizeRequest.controls.checkOutTime.setValue(null);

    }
    else if (value === 'CHECK_OUT') {
      this.bulkRegularizeRequest.controls.checkOutTime.setValidators([Validators.required])
      this.bulkRegularizeRequest.controls.checkInTime.clearValidators();
      this.bulkRegularizeRequest.controls.checkInTime.setValue(null);
    }
    else if (value === 'CHECKIN_AND_CHECKOUT') {
      this.bulkRegularizeRequest.controls.checkInTime.setValidators([Validators.required])
      this.bulkRegularizeRequest.controls.checkOutTime.setValidators([Validators.required])
      this.bulkRegularizeRequest.controls.checkOutTime.setValue(null);
      this.bulkRegularizeRequest.controls.checkInTime.setValue(null);
    }
    this.bulkRegularizeRequest.controls.checkOutTime.updateValueAndValidity();
    this.bulkRegularizeRequest.controls.checkInTime.updateValueAndValidity();

  }
  ngAfterViewInit(): void {
  }

  getMonthValue(selectedMonth: any) {
    var month;
    month = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
    var monthValue = month.indexOf(selectedMonth) + 1;
    if (monthValue < 10) {
      return '0' + monthValue;
    } else {
      return monthValue;
    }
  }
  onSubmitRequest() {
    var selectedDaysBody = [];
    var uniqueEmpCode = [];
    this.selectedDaysList.forEach(days => {
      if (uniqueEmpCode.indexOf(days.empCode) < 0) {
        uniqueEmpCode.push(days.empCode);
      }
    });
    uniqueEmpCode.forEach((empCode, index) => {
      uniqueEmpCode[index] = {
        "empCode": empCode,
        "date": this.selectedDaysList.filter(selectedDay => selectedDay.empCode === empCode).map(selectedDay => this.month.split("-")[1] + "-" + this.getMonthValue(this.month.split("-")[0]) + "-" + ((selectedDay.date < 10) ? '0' + selectedDay.date : selectedDay.date))
      }
    })
    console.log(uniqueEmpCode);
    if (this.bulkRegularizeRequest.valid) {

      console.log('form value ' + JSON.stringify(this.bulkRegularizeRequest.value));
      if (this.isRegReason) {
        uniqueEmpCode.forEach(day => {
          selectedDaysBody.push({
            'empCode': day.empCode,
            'regularizationDate': day.date,
            'requestType': this.bulkRegularizeRequest.controls.requestType.value,
            'checkInTime': this.bulkRegularizeRequest.controls.checkInTime.value,
            'checkOutTime': this.bulkRegularizeRequest.controls.checkOutTime.value,
            'regularizationReason': this.bulkRegularizeRequest.controls.reason.value,
            'regularizationComments': this.bulkRegularizeRequest.controls.comment.value
          });
        })
      }
      else {
        this.selectedDaysList.forEach(day => {
          selectedDaysBody.push({
            'empCode': this.data.empCode,
            'regularizationDate': this.data.bulkDate,
            'requestType': this.bulkRegularizeRequest.controls.requestType.value,
            'checkInTime': this.bulkRegularizeRequest.controls.checkInTime.value,
            'checkOutTime': this.bulkRegularizeRequest.controls.checkOutTime.value,
            'regularizationReason': null,
            'regularizationComments': this.bulkRegularizeRequest.controls.comment.value,
          });
        })
      }
      console.log('Body ---------- Json data-------   ' + JSON.stringify(selectedDaysBody));
      return this.serviceApi.post('/v1/attendance/regularization/bulk/admin/', selectedDaysBody).
        subscribe(
          res => {
            this.action = 'Response';
            this.error = res.message;
            this.message = res.message;
            this.close();
            let dialogRef = this.dialog.open(BulkRegularizationResponeModelComponent, {
              width: '500px',
              panelClass: 'custom-dialog-container',
              // tslint:disable-next-line:max-line-length
              data: {
                res: res,
                title: "Attendance Regularization Status Report"
              }
            });
          },
          err => {
            this.action = 'Error';
            this.error = err.message;
            this.close();
          });
    } else {
      Object.keys(this.bulkRegularizeRequest.controls).forEach(field => { // {1}
        const control = this.bulkRegularizeRequest.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }

  }
  ngOnInit() {
    if (this.isRegReason) {
      console.log('Inside Has regularization reason....');
      this.bulkRegularizeRequest = this._fb.group(
        {
          // selectEmployee: ['', Validators.required],

          requestType: ['', Validators.required],
          checkInTime: [],
          checkOutTime: [],
          reason: ['', Validators.required],
          comment: [''],
        }
      );
    }
    else {
      this.bulkRegularizeRequest = this._fb.group(
        {
          // selectEmployee: ['', Validators.required],

          requestType: ['', Validators.required],
          checkInTime: [],
          checkOutTime: [],
          comment: [''],
        }
      );
    }
  }

  close(): void {
    this.data.message = this.message;
    this.dialogRef.close(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close(this.data);
  }
}



@Component({
  selector: 'app-clear-regularization-req',
  templateUrl: 'clear-regularization-req.html',
  styleUrls: ['./new-regularization-req.scss']
})
export class ClearRegularizationReqComponent {
  requestType: any;
  constructor(
    public dialogRef: MatDialogRef<ClearRegularizationReqComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('data-->' + data);

  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}



@Component({
  templateUrl: 'bulk-regularization.component.html',
  styleUrls: ['./new-regularization-req.scss']
})
export class BulkRegularizationResponeModelComponent implements OnInit {

  action: any;
  error = 'Error message';
  res: any;
  title: any;
  dataSource: MatTableDataSource<Element>;
  displayedColumns = ['empCode', 'date', 'status', 'message'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private _fb: FormBuilder, private serviceApi: ApiCommonService,
    public dialogRef: MatDialogRef<BulkRegularizationResponeModelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(JSON.stringify(this.data));
    this.res = [];
    this.res = this.data.res;
    this.title = this.data.title;
    console.log(JSON.stringify(this.res));
  }

  ngOnInit() {


  }
  ngAfterViewInit() {
    console.log(this.res);
    this.dataSource = new MatTableDataSource<Element>(this.res);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  close(): void {
    console.log('this.data');
    this.data.message = this.error;
    this.data.status = this.action;
    console.log("message----- " + this.data.message);
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    this.dialogRef.close(this.data);
  }


}


export interface Element {
  month: string;
  attendance: any;
}

const ELEMENT_DATA: Element[] = [];

export interface Element1 {
  date: string;
  inTime: any;
  outTime: any;
  status: any;
  duration: any;
  shiftTiming: any;
  regularizationRequestStatus: any;
}


export interface RecordSummary {
  summary: any;
  daysPresent: any;
  daysAbsent: any;
  leaveTaken: any;
  weeklyOff: any;
  holidays: any;
  invalidRecords: any;
  totalHours: any;
  totalDeviation: any;
}

const ELEMENT_DATA1: Element1[] = [];
