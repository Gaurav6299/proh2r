import { Component, OnInit, AfterViewInit, ViewChild, Inject } from '@angular/core';
import * as Chart from 'chart.js';
import { UIChart } from 'primeng/chart';
import { ApiCommonService } from '../../../services/api-common.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatCheckboxChange } from '@angular/material';
import { KeycloakService } from '../../../../app/keycloak/keycloak.service';
import { HttpClient } from '@angular/common/http';
import { OwlCarousel } from 'ngx-owl-carousel';
import { DataTable, SelectItem } from 'primeng/primeng';
import { SelectionModel } from '@angular/cdk/collections';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
declare var $: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('rowExpansionTrigger', [
      state('void', style({
        transform: 'translateX(-10%)',
        opacity: 0
      })),
      state('active', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ]
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('owlElement') owlElement: OwlCarousel;
  @ViewChild("dtTimesheetSubmitted") dtTimesheetSubmitted: DataTable;
  @ViewChild("dtTimesheetApproved") dtTimesheetApproved: DataTable;
  @ViewChild("dtTimesheetUnsubmitted") dtTimesheetUnsubmitted: DataTable;
  @ViewChild("dtTimesheetCancelled") dtTimesheetCancelled: DataTable;
  @ViewChild("dtTimesheetRejected") dtTimesheetRejected: DataTable;

  @ViewChild("dtExpPending") dtExpPending: DataTable;
  @ViewChild("dtExpApproved") dtExpApproved: DataTable;
  @ViewChild("dtExpCancelled") dtExpCancelled: DataTable;
  @ViewChild("dtExpRejected") dtExpRejected: DataTable;

  @ViewChild("dtRegPending") dtRegPending: DataTable;
  @ViewChild("dtRegApproved") dtRegApproved: DataTable;
  @ViewChild("dtRegCancelled") dtRegCancelled: DataTable;
  @ViewChild("dtRegRejected") dtRegRejected: DataTable;
  @ViewChild(DashboardComponent) regularizationChild: DashboardComponent;
  date: Date;
  totalNoOfEmployee: any;
  activeEmployeePercentage: any;
  inActiveEmployeePercentage: any;
  onHoldEmployeePercentage: any;
  dashboardBirthDayList = [];
  dashboardWorkAnniversariesList = [];
  dashboardNewJoiniesList = [];
  attendanceRecord: any = [];
  internalJobPostingList = [];
  quickLinksDashboardList = [];
  orgAnnouncementList = [];
  employeeLeaveArray = [];
  employeeLeaveArrayData: number[] = [];
  leaveNameData: string[] = [];
  leaveCount = [];
  chartOptionsAttendance: any = [];
  chartOptionsTaxComponents: any = [];
  labels: any;
  stroke: any;
  dataLabels: any;
  emptaxationYearArray: string[] = [];
  taxDeclarationDataList: any[] = [];
  taxDeclarationDataChoices: SelectItem[];
  punchInCount: any;
  nonPunchInCount: any;
  onLeave: any;
  employeeStaticticsDataSetEmpty: Boolean = true;
  leaveDataSetEmpty: Boolean = true;
  attendanceSummaryDataSetEmpty: Boolean = true;
  stagePadding: Number;
  employeeName;
  employeeList = [];
  alertTableList: any = [];
  setupIssuesTableList: any = [];
  errorMessage: any;
  resultsDataList: any = [];
  isAdminDashboardShowHide: true;
  dashboardDisplayProfileList: any = [];
  dashboardDisplayTimesheetsList: any = [];
  dashboardDisplayExpenseList: any = [];
  dashboardDisplayLeaveList: any = [];
  dashboardDisplayAttendanceList: any = [];
  dashboardDisplayTaxationList: any = [];
  dashboardDisplayOrganizationList: any = [];
  showDropDown = false;
  dashboardTypeList = [{ value: 'admin', viewValue: 'Administrator' }]
  dashboardType: any;
  timesheetsRecordList: any = [];
  timesheetsPendingRecordList: any = [];
  timesheetsApprovedRecordList: any = [];
  timesheetsRejectedRecordList: any = [];
  timesheetsDraftedRecordList: any = [];
  timeSheetsDraftCount = 0;
  timeSheetsPendingCount = 0
  timeSheetsRejectedCount = 0;
  timeSheetsApprovedCount = 0;
  empCode: any;
  selectedEmployee: any;
  selectedExpEmployee: any;
  selectedRegEmployee: any;
  leaveDetailsList = [];
  leaveDetailsListCopy = [];
  leaveDetailsPopupDataList: any = [];
  selectedDateForLeave;
  showDayName: any;
  showDate: any;
  monthList = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
  daysList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  columnsTimeSheets = [
    { field: 'empName', header: 'Emp Name' },
    { field: 'fromDate', header: 'From' },
    { field: 'toDate', header: 'To' },
    { field: 'day0', header: 'Sun' },
    { field: 'day1', header: 'Mon' },
    { field: 'day2', header: 'Tue' },
    { field: 'day3', header: 'Wed' },
    { field: 'day4', header: 'Thu' },
    { field: 'day5', header: 'Fri' },
    { field: 'day6', header: 'Sat' },
    { field: 'totalHours', header: 'Total Hours' },
    { field: 'timeSheetApprovalStatus', header: 'Status' },
    { field: 'actions', header: 'Action' },
  ];
  pendingExpenseRequest = [];
  rejectedExpenseRequest = [];
  approvedExpenseRequest = [];
  cancelledExpenseRequest = [];
  expStatus: any;
  expensePendingReqcounts = 0;
  expenseApprovedReqcounts = 0;
  expenseCancelledReqcounts = 0;
  expenseRejectedReqcounts = 0;
  columnsExpense = [
    { field: 'expenseReportName', header: 'Report Title' },
    { field: 'empName', header: 'Employee Name' },
    { field: 'reimburseAmount', header: 'Reimbursable' },
    { field: 'billableAmount', header: 'Billable' },
    { field: 'expenseStatus', header: 'Status' },
    { field: 'actions', header: 'Actions' }
  ]
  expenseStatus = [
    { statusName: 'Level 1 Approval Pending', statusValue: 'LEVEL1PENDING' },
    { statusName: 'Level 2 Approval Pending', statusValue: 'LEVEL2PENDING' },
    { statusName: 'Level 1 Cancellation Pending', statusValue: 'LEVEL1CANCEL' },
    { statusName: 'Level 2 Cancellation Pending', statusValue: 'LEVEL2CANCEL' },
    { statusName: 'Approved', statusValue: 'APPROVED' },
    { statusName: 'Cancelled', statusValue: 'CANCELLED' },
    { statusName: 'Rejected', statusValue: 'REJECTED' },
    { statusName: 'Deleted', statusValue: 'DELETED' }
  ];
  profile = "assets/images/002-user.png";
  organization = "assets/images/001-work.png";
  leave = "assets/images/006-airplane.png";
  attendance = "assets/images/003-schedule.png";
  timesheets = "assets/images/timesheets.png";
  taxation = "assets/images/taxation.png";
  expense = "assets/images/007-salary.png";
  payroll = "assets/images/001-payslip.png";
  separation = "assets/images//010-retirement.png";
  regularizationPendingReqList = [];
  regularizationApprovedReqList = [];
  regularizationRejectedReqList = [];
  regularizationCancelledReqList = [];
  checkedRowData = [];
  selectedRows = [];
  selection = new SelectionModel<Element>(true, []);
  columnsRegularization = [
    { field: 'empName', header: 'Employee Name' },
    { field: 'regularizationDate', header: 'Date' },
    { field: 'requestType', header: 'Type' },
    { field: 'checkInTime', header: 'Requested Check-In' },
    { field: 'checkOutTime', header: 'Requested Check-Out' },
    { field: 'regularizationComments', header: 'Reason' },
    { field: 'action', header: 'Actions' },
  ];
  regStatus = [
    { statusKey: 'PENDING', statusValue: 'Pending' },
    { statusKey: 'APPROVED', statusValue: 'Approved' },
    { statusKey: 'REJECTED', statusValue: 'Rejected' },
    { statusKey: 'CANCELLED', statusValue: 'Cancelled' }
  ];
  regularizationPendingReqcounts = 0;
  regularizationApprovedReqcounts = 0;
  regularizationCancelledReqcounts = 0;
  regularizationRejectedReqcounts = 0;
  filterByEmp: SelectItem[] = [];
  public regularizationRequest: FormGroup;
  action: any;
  notificationMsg: any;
  regReason: any;
  regReasons: any;
  // SpinnerLoader
  isMyTasksloading$ = true;
  isEmployeeConnectloading$ = true;
  isDailyLeaveCountloading$ = true;
  isMonthlyLeaveReportloading$ = true;
  isTimesheetsloading$ = true;
  isEmployeeStatusloading$ = true;
  isRegularisationRequestsloading$ = true;
  isAttendanceReportloading$ = true;
  isExpenseReportloading$ = true;
  isTaxDeclarationloading$ = true;
  // SpinnerLoader
  ngAfterViewInit() {

  }
  openReportDialog() {
    const dialogRef = this.dialog.open(ReportDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.message) {
          if (result.status === 'Response') {
          } else if (result.status === 'Error') {
          }
        }
      }
    });

  }

  ngOnInit() {
    this.getEmployeeConnectEvents();
    this.getAllAlertsTableData();
    this.getAllSetupIssuesTableData();
    this.getDashboardDisplaySummary(this.dashboardType);
    this.getAllExpApplication();
    this.getAllRegRequest();
    this.getDashboardLeaveSummary();
    this.getTimesheetsRecord(this.selectedEmployee);
  }
  constructor(private serviceApi: ApiCommonService, public dialog: MatDialog, private _http: HttpClient) {
    this.employeeName = KeycloakService.getFullName();
    this.getEmployeeStatus();
    this.getEmployeeLeaveData();
    this.getEmployeeAttendanceData();
    this.getEmployeeTaxComponentsCounts();
    this.getEmployee();
    this.dashboardType = 'admin'
    this.selectedEmployee = 'All Employees'
    this.selectedExpEmployee = 'All Employees'
    this.selectedRegEmployee = 'All Employees'
    this.regReasons = [];
    this.serviceApi.get('/v1/attendance/settings/regularizationReason/' + KeycloakService.getUsername()).
      subscribe(
        res => {
          console.log('Reason List-------------' + JSON.stringify(res));
          res.forEach(element => {
            this.regReasons.push({
              reasonId: element.reasonId,
              assignedReason: element.assignedReason,
            });
          });
        });
    this.hasRegularizeReason();
    var rolesArr = KeycloakService.getUserRole();
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
  customOptions = {
    stagePadding: 15,
    loop: false,
    margin: 0,
    nav: true,
    autoplay: true,
    autoWidth: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    slideTransition: 'linear',
    responsiveClass: true,
    lazyLoad: true,
    smartSpeed: 500,
    navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1.5
      },
      600: {
        items: 2
      },
      740: {
        items: 2,
      },
      1000: {
        items: 2
      },
      1200: {
        items: 2,
      }
    },
  }
  customOptionsNotifY = {
    stagePadding: 15,
    loop: false,
    margin: 20,
    nav: false,
    autoplay: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    slideTransition: 'linear',
    responsiveClass: true,
    lazyLoad: true,
    smartSpeed: 500,
    navText: ["<i class='fa fa-long-arrow-left'></i>", "<i class='fa fa-long-arrow-right'></i>"],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      600: {
        items: 1
      },
      1200: {
        items: 1
      }
    },
  }
  getAllAlertsTableData() {
    this.alertTableList = [];
    this.isMyTasksloading$ = true;
    this.serviceApi.get('/v1/alerts/pendingRequest').subscribe(
      res => {
        if (res != null) {
          res.forEach(element => {
            this.alertTableList.push({
              heading: element.heading,
              subHeading: element.subHeading,
              redirectURL: element.redirectURL
            });
          });
        } else {
          this.alertTableList = [];
        }
        this.isMyTasksloading$ = false;
      }, () => {
        console.log('Enter into Else Bloack');
      });
  }
  getAllSetupIssuesTableData() {
    this.setupIssuesTableList = [];
    this.isMyTasksloading$ = true;
    this.serviceApi.get('/v1/alerts/setupissues').
      subscribe(
        res => {
          res.forEach(element => {
            this.setupIssuesTableList.push({
              heading: element.heading,
              subHeading: element.subHeading,
              redirectURL: element.redirectURL
            });
          });
          this.isMyTasksloading$ = false;
        }, () => {
          console.log('Enter into Else Block');
        });
  }
  getResults() {
    // let result = [...this.alertTableList, ...this.setupIssuesTableList];
    let result = this.alertTableList.concat(this.setupIssuesTableList).filter((x, index, data) =>
      index === data.findIndex((t) => (
        t.heading === x.heading
      ))
    )
    return result;
  }
  getEmployeeConnectEvents() {
    this.dashboardBirthDayList = [];
    this.dashboardWorkAnniversariesList = [];
    this.dashboardNewJoiniesList = [];
    this.isEmployeeConnectloading$ = true;
    console.log('Enter in the Getting all the Information related to the Events [Birthday , Anniversary, New Joinee]');
    this.serviceApi.get('/v1/dashboard/employeeconnectevents').subscribe(
      res => {
        if (res != null) {
          this.dashboardBirthDayList = res.birthdays;
          this.dashboardWorkAnniversariesList = res.workAnniversaries;
          this.dashboardNewJoiniesList = res.newJoinies;
        } else {
          console.log('There is no any Records');
        }
        this.isEmployeeConnectloading$ = false;
      }, err => {

      });
  }
  getOrgAnnouncements() {
    console.log('Enter to Get All the Informations Of Oraganization Announcements ');
    this.serviceApi.get('/v1/OrgAnnouncement/').subscribe(
      res => {
        if (res != null) {
          res.forEach(element => {
          });

        } else {
          console.log('There is no any Organization Announcements');
        }
      }, err => {
        console.log('Something Error ::: ' + err);
      });
  }
  getInternalJobPosting() {
    console.log('Enter to Get All the Informations Of Oraganization Internal Jobs');
    this.serviceApi.get('/v1/OrgAnnouncement/internaljobs').subscribe(
      res => {
        if (res != null) {
          res.forEach(element => {
          });
        } else {
          console.log('There is no any Organization Announcements');
        }
      }, err => {
        console.log('Something Error ::: ' + err);
      });
  }
  toggleDropDown() {
    this.showDropDown = true
    console.log('clicked');
  }
  closeDropDown() {
    this.showDropDown = false;
    console.log('clicked outside');
  }
  getDashboardDisplaySummary(dashboardType: any) {
    const url = '/v1/dashboardwidgets/' + KeycloakService.getUsername() + '/' + dashboardType + '/getWidgetsByEmpCode';
    return this.serviceApi.get(url)
      .subscribe(res => {
        this.dashboardDisplayProfileList = res.Profile;
        this.dashboardDisplayTimesheetsList = res.Timesheets;
        this.dashboardDisplayExpenseList = res.Expense;
        this.dashboardDisplayLeaveList = res.Leave;
        this.dashboardDisplayAttendanceList = res.Attendance;
        this.dashboardDisplayTaxationList = res.Taxation;
        this.dashboardDisplayOrganizationList = res.Organization;
      });
  }
  updateDashboardDisplaySummary(event: MatCheckboxChange, item) {
    console.log(event, item);
    const body = [{
      "dashBoardType": item.dashBoardType,
      "empCode": item.empCode,
      "employeeWidgets": item.employeeWidgets,
      "isvalid": event.checked,
      "moduleName": item.moduleName,
      "widgetsMaster": {
        "dashBoardType": item.widgetsMaster.dashBoardType,
        "moduleName": item.widgetsMaster.moduleName,
        "widgetsName": item.widgetsMaster.widgetsName,
        "widgetsRecordId": item.widgetsMaster.widgetsRecordId
      },
      "widgetsName": item.widgetsName,
    }]
    return this.serviceApi.post('/v1/dashboardwidgets/saveData', body).subscribe(
      res => {
      },
      err => {
        this.warningNotification(err.message);
      },
      () => {
      }
    )
  }
  refreshDashboard() {
    this.getEmployeeConnectEvents();
    this.getAllAlertsTableData();
    this.getAllSetupIssuesTableData();
    this.getAllExpApplication();
    this.getAllRegRequest();
    this.getDashboardLeaveSummary();
    this.getEmployeeStatus();
    this.getEmployeeLeaveData();
    this.getEmployeeAttendanceData();
    this.getEmployeeTaxComponentsCounts();
  }
  getEmployee() {
    this.employeeList = [];
    this.employeeList.push('All Employees');
    return this.serviceApi.get('/v1/employee/filterEmployees').subscribe(
      res => {
        res.forEach(element => {
          this.employeeList = [...this.employeeList, {
            value: element.empCode,
            viewValue: element.empFirstName + '-' + element.empLastName + '-' + element.empCode
          }];
        });
      },
      () => {
        console.log('Enter into Else Bloack');
      });
  }
  openTimeSheetViewDialog(timesheet, day) {
    console.log(timesheet)
    console.log(day)
    if (timesheet[day + "_data"].length == 0) {
      return;
    }
    const dialogRef = this.dialog.open(TimeSheetsDescriptionDialogComponent, {
      width: '',
      panelClass: 'custom-dialog-container',
      data: {
        descriptionArray: timesheet[day + "_data"]
      }
    });
  }
  getTimesheetsRecord(selectedEmployee) {
    this.timesheetsPendingRecordList = [];
    this.timesheetsApprovedRecordList = [];
    this.timesheetsRejectedRecordList = [];
    this.timesheetsDraftedRecordList = [];
    this.isTimesheetsloading$ = true;
    if (selectedEmployee === 'All Employees') {
      selectedEmployee = '';
    }
    return this.serviceApi.get('/v1/dashboard/admin/timesheetsdashboard?empCode=' + selectedEmployee).subscribe((data) => {
      this.timeSheetsDraftCount = data.draftCount;
      this.timeSheetsPendingCount = data.pendingCount;
      this.timeSheetsRejectedCount = data.rejectedCount;
      this.timeSheetsApprovedCount = data.approvedCount;
      if (data != null) {
        data.timesheets.forEach(element1 => {
          element1.timeSheetResVOList.forEach(element => {
            if (element.timeSheetId != null) {
              if (element.timeSheetApprovalStatus.includes('PENDING')) {
                this.timesheetsPendingRecordList.push({
                  'timeSheetId': element.timeSheetId,
                  'empName': element.empName,
                  'empCode': element.empCode,
                  'workWeekHours': element.workWeekHours + 'h',
                  'fromDate': element.fromDate,
                  'toDate': element.toDate,
                  'day0': (element.day0 === null) ? '-' : element.day0.totalDayHours,
                  'day1': (element.day1 === null) ? '-' : element.day1.totalDayHours,
                  'day2': (element.day2 === null) ? '-' : element.day2.totalDayHours,
                  'day3': (element.day3 === null) ? '-' : element.day3.totalDayHours,
                  'day4': (element.day4 === null) ? '-' : element.day4.totalDayHours,
                  'day5': (element.day5 === null) ? '-' : element.day5.totalDayHours,
                  'day6': (element.day6 === null) ? '-' : element.day6.totalDayHours,
                  'day0_data': (element.day0 === null) ? [] : element.day0.timeSheetDayItemDescriptions,
                  'day1_data': (element.day1 === null) ? [] : element.day1.timeSheetDayItemDescriptions,
                  'day2_data': (element.day2 === null) ? [] : element.day2.timeSheetDayItemDescriptions,
                  'day3_data': (element.day3 === null) ? [] : element.day3.timeSheetDayItemDescriptions,
                  'day4_data': (element.day4 === null) ? [] : element.day4.timeSheetDayItemDescriptions,
                  'day5_data': (element.day5 === null) ? [] : element.day5.timeSheetDayItemDescriptions,
                  'day6_data': (element.day6 === null) ? [] : element.day6.timeSheetDayItemDescriptions,
                  'totalHours': element.totalHours,
                  'timeSheetApprovalStatus': element.timeSheetApprovalStatus.replace(/_/g, ' '),
                });
              }
              if (element.timeSheetApprovalStatus.includes('APPROVED')) {
                this.timesheetsApprovedRecordList.push({
                  'timeSheetId': element.timeSheetId,
                  'empName': element.empName,
                  'empCode': element.empCode,
                  'workWeekHours': element.workWeekHours + 'h',
                  'fromDate': element.fromDate,
                  'toDate': element.toDate,
                  'day0': (element.day0 === null) ? '-' : element.day0.totalDayHours,
                  'day1': (element.day1 === null) ? '-' : element.day1.totalDayHours,
                  'day2': (element.day2 === null) ? '-' : element.day2.totalDayHours,
                  'day3': (element.day3 === null) ? '-' : element.day3.totalDayHours,
                  'day4': (element.day4 === null) ? '-' : element.day4.totalDayHours,
                  'day5': (element.day5 === null) ? '-' : element.day5.totalDayHours,
                  'day6': (element.day6 === null) ? '-' : element.day6.totalDayHours,
                  'day0_data': (element.day0 === null) ? [] : element.day0.timeSheetDayItemDescriptions,
                  'day1_data': (element.day1 === null) ? [] : element.day1.timeSheetDayItemDescriptions,
                  'day2_data': (element.day2 === null) ? [] : element.day2.timeSheetDayItemDescriptions,
                  'day3_data': (element.day3 === null) ? [] : element.day3.timeSheetDayItemDescriptions,
                  'day4_data': (element.day4 === null) ? [] : element.day4.timeSheetDayItemDescriptions,
                  'day5_data': (element.day5 === null) ? [] : element.day5.timeSheetDayItemDescriptions,
                  'day6_data': (element.day6 === null) ? [] : element.day6.timeSheetDayItemDescriptions,
                  'totalHours': element.totalHours,
                  'timeSheetApprovalStatus': element.timeSheetApprovalStatus.replace(/_/g, ' '),
                });
              }
              if (element.timeSheetApprovalStatus.includes('REJECTED')) {
                this.timesheetsRejectedRecordList.push({
                  'timeSheetId': element.timeSheetId,
                  'empName': element.empName,
                  'empCode': element.empCode,
                  'workWeekHours': element.workWeekHours + 'h',
                  'fromDate': element.fromDate,
                  'toDate': element.toDate,
                  'day0': (element.day0 === null) ? '-' : element.day0.totalDayHours,
                  'day1': (element.day1 === null) ? '-' : element.day1.totalDayHours,
                  'day2': (element.day2 === null) ? '-' : element.day2.totalDayHours,
                  'day3': (element.day3 === null) ? '-' : element.day3.totalDayHours,
                  'day4': (element.day4 === null) ? '-' : element.day4.totalDayHours,
                  'day5': (element.day5 === null) ? '-' : element.day5.totalDayHours,
                  'day6': (element.day6 === null) ? '-' : element.day6.totalDayHours,
                  'day0_data': (element.day0 === null) ? [] : element.day0.timeSheetDayItemDescriptions,
                  'day1_data': (element.day1 === null) ? [] : element.day1.timeSheetDayItemDescriptions,
                  'day2_data': (element.day2 === null) ? [] : element.day2.timeSheetDayItemDescriptions,
                  'day3_data': (element.day3 === null) ? [] : element.day3.timeSheetDayItemDescriptions,
                  'day4_data': (element.day4 === null) ? [] : element.day4.timeSheetDayItemDescriptions,
                  'day5_data': (element.day5 === null) ? [] : element.day5.timeSheetDayItemDescriptions,
                  'day6_data': (element.day6 === null) ? [] : element.day6.timeSheetDayItemDescriptions,
                  'totalHours': element.totalHours,
                  'timeSheetApprovalStatus': element.timeSheetApprovalStatus.replace(/_/g, ' '),
                });
              }
              if (element.timeSheetApprovalStatus.includes('DRAFT')) {
                this.timesheetsDraftedRecordList.push({
                  'timeSheetId': element.timeSheetId,
                  'empName': element.empName,
                  'empCode': element.empCode,
                  'workWeekHours': element.workWeekHours + 'h',
                  'fromDate': element.fromDate,
                  'toDate': element.toDate,
                  'day0': (element.day0 === null) ? '-' : element.day0.totalDayHours,
                  'day1': (element.day1 === null) ? '-' : element.day1.totalDayHours,
                  'day2': (element.day2 === null) ? '-' : element.day2.totalDayHours,
                  'day3': (element.day3 === null) ? '-' : element.day3.totalDayHours,
                  'day4': (element.day4 === null) ? '-' : element.day4.totalDayHours,
                  'day5': (element.day5 === null) ? '-' : element.day5.totalDayHours,
                  'day6': (element.day6 === null) ? '-' : element.day6.totalDayHours,
                  'day0_data': (element.day0 === null) ? [] : element.day0.timeSheetDayItemDescriptions,
                  'day1_data': (element.day1 === null) ? [] : element.day1.timeSheetDayItemDescriptions,
                  'day2_data': (element.day2 === null) ? [] : element.day2.timeSheetDayItemDescriptions,
                  'day3_data': (element.day3 === null) ? [] : element.day3.timeSheetDayItemDescriptions,
                  'day4_data': (element.day4 === null) ? [] : element.day4.timeSheetDayItemDescriptions,
                  'day5_data': (element.day5 === null) ? [] : element.day5.timeSheetDayItemDescriptions,
                  'day6_data': (element.day6 === null) ? [] : element.day6.timeSheetDayItemDescriptions,
                  'totalHours': element.totalHours,
                  'timeSheetApprovalStatus': element.timeSheetApprovalStatus.replace(/_/g, ' '),
                });
              }
            }
          });
        })
      }
      this.isTimesheetsloading$ = false;
    },
      (err) => {
      }, () => {
        if (this.dtTimesheetSubmitted != undefined || this.dtTimesheetUnsubmitted != undefined || this.dtTimesheetApproved != undefined || this.dtTimesheetCancelled != undefined || this.dtTimesheetRejected != undefined) {
          this.dtTimesheetSubmitted.reset();
          this.dtTimesheetUnsubmitted.reset();
          this.dtTimesheetApproved.reset();
          this.dtTimesheetCancelled.reset();
          this.dtTimesheetRejected.reset();
        }
      });
  }
  getAllRegRequest() {
    this.regularizationPendingReqList = [];
    this.regularizationApprovedReqList = [];
    this.regularizationCancelledReqList = [];
    this.regularizationRejectedReqList = [];
    let tempStatus = '';
    this.isRegularisationRequestsloading$ = true;
    this.serviceApi.get('/v1/attendance/regularization/').
      subscribe(
        res => {
          res.forEach(element => {
            tempStatus = '';
            console.log('Inside for each element' + JSON.stringify(element))
            this.regStatus.forEach(statusObj => {
              if (statusObj.statusKey === element.regularizationStatus) {
                tempStatus = statusObj.statusValue;
              }
            });
            if (this.selectedRegEmployee == element.empCode || this.selectedRegEmployee == 'All Employees') {
              if (element.regularizationStatus.includes('PENDING')) {
                this.regularizationPendingReqList.push({
                  regularizationRequestsId: element.regularizationRequestsId,
                  empCode: element.empCode,
                  empName: element.empName,
                  regularizationDate: element.regularizationDate,
                  appliedOnDate: element.appliedOnDate,
                  attendanceTemplate: element.attendanceTemplate,
                  requestType: element.requestType,
                  checkInTime: element.checkInTime,
                  checkOutTime: element.checkOutTime,
                  regularizationReason: element.regularizationReason,
                  regularizationComments: element.regularizationComments,
                  regularizationStatus: tempStatus,
                  location: element.location,
                  band: element.band,
                  department: element.department,
                  designation: element.designation
                })
              }
              if (element.regularizationStatus.includes('APPROVED')) {
                this.regularizationApprovedReqList.push({
                  regularizationRequestsId: element.regularizationRequestsId,
                  empCode: element.empCode,
                  empName: element.empName,
                  regularizationDate: element.regularizationDate,
                  appliedOnDate: element.appliedOnDate,
                  attendanceTemplate: element.attendanceTemplate,
                  requestType: element.requestType,
                  checkInTime: element.checkInTime,
                  checkOutTime: element.checkOutTime,
                  regularizationReason: element.regularizationReason,
                  regularizationComments: element.regularizationComments,
                  regularizationStatus: tempStatus,
                  location: element.location,
                  band: element.band,
                  department: element.department,
                  designation: element.designation
                })
              }
              if (element.regularizationStatus.includes('CANCELLED')) {
                this.regularizationCancelledReqList.push({
                  regularizationRequestsId: element.regularizationRequestsId,
                  empCode: element.empCode,
                  empName: element.empName,
                  regularizationDate: element.regularizationDate,
                  appliedOnDate: element.appliedOnDate,
                  attendanceTemplate: element.attendanceTemplate,
                  requestType: element.requestType,
                  checkInTime: element.checkInTime,
                  checkOutTime: element.checkOutTime,
                  regularizationReason: element.regularizationReason,
                  regularizationComments: element.regularizationComments,
                  regularizationStatus: tempStatus,
                  location: element.location,
                  band: element.band,
                  department: element.department,
                  designation: element.designation
                })
              }
              if (element.regularizationStatus.includes('REJECTED')) {
                this.regularizationRejectedReqList.push({
                  regularizationRequestsId: element.regularizationRequestsId,
                  empCode: element.empCode,
                  empName: element.empName,
                  regularizationDate: element.regularizationDate,
                  appliedOnDate: element.appliedOnDate,
                  attendanceTemplate: element.attendanceTemplate,
                  requestType: element.requestType,
                  checkInTime: element.checkInTime,
                  checkOutTime: element.checkOutTime,
                  regularizationReason: element.regularizationReason,
                  regularizationComments: element.regularizationComments,
                  regularizationStatus: tempStatus,
                  location: element.location,
                  band: element.band,
                  department: element.department,
                  designation: element.designation
                })
              }
            }
            this.regularizationPendingReqcounts = this.regularizationPendingReqList.length;
            this.regularizationApprovedReqcounts = this.regularizationApprovedReqList.length;
            this.regularizationCancelledReqcounts = this.regularizationCancelledReqList.length;
            this.regularizationRejectedReqcounts = this.regularizationRejectedReqList.length;
          });
          this.isRegularisationRequestsloading$ = false;
        },
        (err) => {
        }, () => {
          if (this.dtRegPending != undefined || this.dtRegApproved != undefined || this.dtRegCancelled != undefined || this.dtRegRejected != undefined) {
            this.dtRegPending.reset();
            this.dtRegApproved.reset();
            this.dtRegCancelled.reset();
            this.dtRegRejected.reset();
          }
        });
  }
  getAllExpApplication() {
    this.isExpenseReportloading$ = true;
    this.serviceApi.get('/v1/expense/application/').subscribe((data) => {
      if (data != null) {
        this.pendingExpenseRequest = [];
        this.approvedExpenseRequest = [];
        this.cancelledExpenseRequest = [];
        this.rejectedExpenseRequest = [];
        data.forEach(element => {
          this.expStatus = '';
          this.expenseStatus.forEach(statusInfo => {
            if (element.expenseStatus === statusInfo.statusValue) {
              this.expStatus = statusInfo.statusName;
            }
          });
          let expensesList = [];
          element.expensesList.forEach(element1 => {
            let expensesFieldList = [];
            element1.expensesFieldList.forEach(element2 => {
              expensesFieldList.push({
                "expensesFieldId": element2.expensesFieldId,
                "fieldName": element2.fieldName,
                "fieldValue": element2.fieldValue
              })
            });
            expensesList.push({
              "expensesId": element1.expensesId,
              "expenseName": element1.expenseName,
              "amount": element1.amount,
              "isReImbursable": element1.isReImbursable,
              "isBillable": element1.isBillable,
              "expenseComments": element1.expenseComments,
              "expenseReason": element1.expenseReason,
              "expenseAttachment": element1.expenseAttachment,
              "expenseAttachmentId": element1.expenseAttachmentId,
              "expenseIncurredDate": element1.expenseIncurredDate,
              "templateCategoryId": element1.templateCategoryId,
              "expensesFieldList": expensesFieldList
            });
          });
          if (this.selectedExpEmployee == element.empCode || this.selectedExpEmployee == 'All Employees') {
            if (element.expenseStatus.includes('PENDING')) {
              this.pendingExpenseRequest.push({
                "expenseRepId": element.expenseId,
                "empCode": element.empCode,
                "expenseReportName": element.expenseReportName,
                "totalAmount": element.totalAmount,
                "reimburseAmount": element.reimburseAmount,
                "billableAmount": element.billableAmount,
                "advanceAmount": element.advanceAmount,
                "expenseStatus": this.expStatus,
                "empName": element.empName,
                "location": element.location,
                "band": element.band,
                "department": element.department,
                "designation": element.designation,
                "expensesList": expensesList
              });
            }
            if (element.expenseStatus.includes('APPROVED')) {
              this.approvedExpenseRequest.push({
                "expenseRepId": element.expenseId,
                "empCode": element.empCode,
                "expenseReportName": element.expenseReportName,
                "totalAmount": element.totalAmount,
                "reimburseAmount": element.reimburseAmount,
                "billableAmount": element.billableAmount,
                "advanceAmount": element.advanceAmount,
                "expenseStatus": this.expStatus,
                "empName": element.empName,
                "location": element.location,
                "band": element.band,
                "department": element.department,
                "designation": element.designation,
                "expensesList": expensesList
              });
            }
            if (element.expenseStatus.includes('CANCELLED')) {
              this.cancelledExpenseRequest.push({
                "expenseRepId": element.expenseId,
                "empCode": element.empCode,
                "expenseReportName": element.expenseReportName,
                "totalAmount": element.totalAmount,
                "reimburseAmount": element.reimburseAmount,
                "billableAmount": element.billableAmount,
                "advanceAmount": element.advanceAmount,
                "expenseStatus": this.expStatus,
                "empName": element.empName,
                "location": element.location,
                "band": element.band,
                "department": element.department,
                "designation": element.designation,
                "expensesList": expensesList
              });
            }
            if (element.expenseStatus.includes('REJECTED')) {
              this.rejectedExpenseRequest.push({
                "expenseRepId": element.expenseId,
                "empCode": element.empCode,
                "expenseReportName": element.expenseReportName,
                "totalAmount": element.totalAmount,
                "reimburseAmount": element.reimburseAmount,
                "billableAmount": element.billableAmount,
                "advanceAmount": element.advanceAmount,
                "expenseStatus": this.expStatus,
                "empName": element.empName,
                "location": element.location,
                "band": element.band,
                "department": element.department,
                "designation": element.designation,
                "expensesList": expensesList
              });
            }
          }
          this.expensePendingReqcounts = this.pendingExpenseRequest.length;
          this.expenseApprovedReqcounts = this.approvedExpenseRequest.length;
          this.expenseCancelledReqcounts = this.cancelledExpenseRequest.length;
          this.expenseRejectedReqcounts = this.rejectedExpenseRequest.length;
        });
        if (this.dtExpPending != undefined || this.dtExpApproved != undefined || this.dtExpCancelled != undefined || this.dtExpRejected != undefined) {
          this.dtExpPending.reset();
          this.dtExpApproved.reset();
          this.dtExpCancelled.reset();
          this.dtExpRejected.reset();
        }
      }
      this.isExpenseReportloading$ = false;
    });
  }
  // selectedRegularizationTabChange(event) {
  //   console.log(event);
  //   if (event.index === 0 || event.index === 1 || event.index === 2 || event.index === 3) {
  //     this.getAllRegRequest();
  //   }
  // }
  // selectedExpenseTabChange(event) {
  //   console.log(event);
  //   if (event.index === 0 || event.index === 1 || event.index === 2 || event.index === 3) {
  //     this.getAllExpApplication();
  //   }
  // }
  hasRegularizeReason() {
    this.serviceApi.get('/v1/attendance/settings/general/').
      subscribe(
        res => {
          this.regReason = res.modifyEmpRegReq;
        },
      );
  }
  openApproveRejectTimesheetDialog(action: any, data: any) {
    console.log(data);
    const dialogRef = this.dialog.open(ApproveRejectTimesheetComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { timeSheetId: data.timeSheetId, action: action, fromDate: data.fromDate, toDate: data.toDate, empCode: data.empCode }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.message) {
          if (result.status === 'Response') {
            this.successNotification(result.message);
            this.getTimesheetsRecord(this.selectedEmployee);
          }
          else if (result.status === 'Error') {
          }
        }
      }
    });

  }
  approveMultipleRegularizationRequest(data: any) {
    console.log('........' + data);
    var checkedRowData = [];
    this.selectedRows.forEach(row => {
      checkedRowData.push(
        row.regularizationRequestsId
      );
    });
    if (data === 'approveMultipleRequest') {
      if (this.selectedRows.length > 0) {
        console.log('Inside approve dialog');
        const dialogRef = this.dialog.open(ApproveMultipleRegularizationDialogComponent, {
          width: '500px',
          panelClass: 'custom-dialog-container',
          data: {
            checkedRowData: checkedRowData
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          if (result !== undefined) {
            if (result.message) {
              console.log(result);
              this.notificationMsg = result.message;
              this.selection.clear();
              this.selectedRows = [];
              this.successNotification(this.notificationMsg);
              this.getAllRegRequest();
            }
          }
        });
      } else {
        this.selectedRows = [];
        this.selection.clear();
        this.warningNotification('Select a request first');
      }
    }
  }
  approveRegularizationDialog(requestID: any) {
    console.log('Inside approve dialog');
    const dialogRef = this.dialog.open(ApproveRegularizationDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { message: this.notificationMsg, status: this.action, regRequestID: requestID }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          console.log('Result value ..... ' + result.message);
          if (result.status === 'Response') {
            this.notificationMsg = result.message;
            this.successNotification(this.notificationMsg);
            this.getAllRegRequest()
          }
          else if (result.status === 'Error') {
            this.notificationMsg = result.message;
          }
        }
      }
    });
  }
  rejectRegularizationDialog(requestID: any) {
    const dialogRef = this.dialog.open(RejectRegularizationDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { message: this.notificationMsg, status: this.action, regRequestID: requestID }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          console.log('Result value ..... ' + result.message);
          if (result.status === 'Response') {
            this.notificationMsg = result.message;
            this.successNotification(this.notificationMsg);
            this.getAllRegRequest();
          }
          else if (result.status === 'Error') {
            this.notificationMsg = result.message;
          }
        }
      }
    });
  }
  cancelRegularizationDialog(requestID: any) {
    let dialogRef = this.dialog.open(CancelRegularizationDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { message: this.notificationMsg, status: this.action, requestId: requestID }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.message) {
          console.log('Result value ..... ' + result.message);
          if (result.status === 'Response') {
            this.notificationMsg = result.message;
            this.successNotification(this.notificationMsg);
            this.getAllRegRequest();
          }
          else if (result.status === 'Error') {
            this.notificationMsg = result.message;
          }
        }
      }
    });
  }
  viewRegularizationRequest(regDetails: any) {
    let dialogRef = this.dialog.open(ViewRegularizationReqComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: {
        date: regDetails.regularizationDate[0],
        appliedOnDate: regDetails.appliedOnDate,
        attendanceTemplate: regDetails.attendanceTemplate,
        requestType: regDetails.requestType,
        requestedCheckIn: regDetails.checkInTime,
        requestedCheckOut: regDetails.checkOutTime,
        regularizationReason: regDetails.regularizationReason,
        regularizationComments: regDetails.regularizationComments,
        status: regDetails.regularizationStatus,
        reasonList: this.regReasons
      }
    });
  }
  approveSingleExpense(expId: any) {
    this.action = '';
    const dialogRef = this.dialog.open(ApproveSingleExpenseApplication, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { expId: expId, message: this.notificationMsg, status: this.action }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          console.log('Result value ..... ' + result.message);
          if (result.status === 'Response') {
            this.notificationMsg = result.message;
            this.successNotification(this.notificationMsg);
            this.getAllExpApplication();
          }
          else if (result.status === 'Error') {
            this.notificationMsg = result.message;
          }
        }
      }
    });
  }
  rejectSingleExpense(expId: any) {
    this.action = '';
    console.log('Inside Bulk Reject');
    const dialogRef = this.dialog.open(RejectSingleExpenseApplication, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { expId: expId, message: this.notificationMsg, status: this.action }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result !== undefined) {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            console.log('Result value ..... ' + result.message);
            if (result.status === 'Response') {
              this.notificationMsg = result.message;
              this.successNotification(this.notificationMsg);
              this.getAllExpApplication();
            }
            else if (result.status === 'Error') {
              this.notificationMsg = result.message;
            }
          }
        }
      }
    });
  }
  cancelExpApplication(expId: any) {
    this.action = '';
    const dialogRef = this.dialog.open(CancelExpenseApplicationRequest, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { expId: expId, message: this.notificationMsg, status: this.action }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          console.log('Result value ..... ' + result.message);
          if (result.status === 'Response') {
            this.notificationMsg = result.message;
            this.successNotification(this.notificationMsg);
            this.getAllExpApplication();
          }
          else if (result.status === 'Error') {
            this.notificationMsg = result.message;
          }
        }
      }
    });
  }
  onChangebulkActions(value: any) {
    console.log(this.selectedRows)
    if (value === 'approveMultipleRequest') {
      if (this.checkedRowData.length > 0) {
        let dialogRef = this.dialog.open(ApproveMultipleExpenseRequestDialogComponent, {
          width: '500px',
          panelClass: 'custom-dialog-container',
          data: {
            reqType: 'approveMultiple',
            checkedRowData: this.checkedRowData
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          if (result !== undefined) {
            if (result.status === 'Response') {
              console.log(result);
              this.notificationMsg = result.message;
              this.selection.clear();
              this.checkedRowData = [];
              this.successNotification(this.notificationMsg);
              this.getAllExpApplication();
            } else if (result.status === 'Error') {
              this.notificationMsg = result.message;
            }
          }
        });
      } else {
        this.checkedRowData = [];
        this.selection.clear();
        this.warningNotification('Select a report first');
      }
    }
  }
  showExpenseHistoryDialog(expDetails: any) {
    let dialogRef = this.dialog.open(ShowExpenseHistoryDialogComponent, {
      width: '700px',
      panelClass: 'custom-dialog-container',
      data: expDetails,
    });
  }
  selectDateForLeaveCalendar(evt) {
    this.selectedDateForLeave = new Date(evt)
    const SelectionDate = new Date(this.selectedDateForLeave).getDate()
    const SelectedDayName = this.daysList[this.selectedDateForLeave.getDay()];
    const selectionMonthName = this.monthList[this.selectedDateForLeave.getMonth()];
    const selectionYearName = this.selectedDateForLeave.getFullYear();
    this.showDayName = SelectedDayName;
    this.showDate = SelectionDate + ' ' + selectionMonthName + ' ' + selectionYearName;
    this.getDashboardLeaveData();
  }
  getDashboardLeaveSummary() {
    this.isMonthlyLeaveReportloading$ = true;
    this.serviceApi.get('/v1/dashboard/admin/leave-details').subscribe(
      res => {
        if (res != null) {
          this.leaveDetailsList = res;
          let date;
          date = new Date().getDate();
          this.leaveDetailsListCopy = this.leaveDetailsList.filter(x => new Date(x.date).getDate().toString() == date)
        } else {
        }
        this.isMonthlyLeaveReportloading$ = false;
      }, err => {

      }, () => {

      });
  }
  getDashboardLeaveDataColor(date) {
    let element = this.leaveDetailsList.filter(x => new Date(x.date).getDate().toString() == date.day)
    return element[0];
  }
  getDashboardLeaveData() {
    let selectDateOfDay;
    selectDateOfDay = new Date(this.selectedDateForLeave).getDate();
    this.leaveDetailsPopupDataList = this.leaveDetailsList.filter(x => new Date(x.date).getDate().toString() == selectDateOfDay)
  }
  @ViewChild("employeeStatusChart") employeeStatusChart: UIChart
  optionsForEmployeeChart: any
  employeeStatusChartGraphData: any
  showEmployeeChart = false;
  @ViewChild("leaveChart") leaveChart: UIChart
  optionsForLeaveChart: any
  leaveChartGraphData: any
  showLeaveData = false;
  @ViewChild("attendanceChart") attendanceChart: UIChart
  optionsForAttendanceChart: any
  attendanceChartGraphData: any
  showAttendanceChart = false;
  getEmployeeStatus() {
    console.log('employeeStatistics');
    this.isEmployeeStatusloading$ = true;
    this.serviceApi.get('/v1/dashboard/employeeStatistics')
      .subscribe(
        res => {
          if (res) {
            console.log('responsee of employee statistics');
            console.log(res.activeEmployeePercentage);
            this.totalNoOfEmployee = res.totalNoOfEmployee;
            this.activeEmployeePercentage = res.activeEmployeeCount;
            this.onHoldEmployeePercentage = res.onHoldEmployeeCount;
            this.inActiveEmployeePercentage = res.inActiveEmployeeCount;
            let data = [];
            data.push({
              "name": 'Active',
              "value": this.activeEmployeePercentage
            },
              {
                "name": 'In Active',
                "value": this.inActiveEmployeePercentage
              },
              {
                "name": 'On Hold',
                "value": this.onHoldEmployeePercentage
              })
            this.employeeStatusChartGraphData = {
              color: ['#008ffb', '#00e396', '#feb019'],
              tooltip: {
                trigger: 'item'
              },
              toolbox: {
                show: true,
                orient: 'vertical',
                left: 'right',
                top: 'center',
                showTitle: false,
                feature: {
                  mark: { show: true },
                  dataView: { show: true, readOnly: false },
                  restore: { show: true },
                  saveAsImage: { show: true }
                }
              },
              legend: {
                left: 'center',
              },
              series: [
                {
                  type: 'pie',
                  radius: ['40%', '70%'],
                  avoidLabelOverlap: true,
                  itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2,
                  },
                  label: {
                    show: false,
                    position: 'center'
                  },
                  emphasis: {
                    label: {
                      show: true,
                      fontSize: '12',
                      fontWeight: 'bold'
                    }
                  },
                  labelLine: {
                    show: false
                  },
                  data: data
                }
              ]
            };
            this.activeEmployeePercentage === 0 && this.onHoldEmployeePercentage === 0 && this.inActiveEmployeePercentage === 0 ? this.showEmployeeChart = false : this.showEmployeeChart = true;
          } else {
            this.showEmployeeChart = false;
          }
          this.isEmployeeStatusloading$ = false;
        },
        err => {
          console.log('there is some error:::');
        },
        () => {
          console.log('completed');
          console.log('activeEmployeePercentage' + this.activeEmployeePercentage, 'onHoldEmployee' + this.onHoldEmployeePercentage);
        }
      );
  }

  getEmployeeLeaveData() {
    this.employeeLeaveArray = [];
    this.isDailyLeaveCountloading$ = true;
    this.serviceApi.get('/v1/dashboard/leaveAdminDashboard').subscribe(
      res => {
        if (res.length > 0) {
          res.forEach(element => {
            this.employeeLeaveArray = res.filter((x, index, data) =>
              index === data.findIndex((t) => (
                t.leaveName === x.leaveName
              ))
            )
            this.employeeLeaveArrayData.push(
              element.leaveCount
            )
          })
          this.employeeLeaveArrayData.every(item => item === 0) ? this.showLeaveData = false : this.showLeaveData = true;
        } else {
          this.showLeaveData = false;
        }
        this.isDailyLeaveCountloading$ = false;
      }, err => {

      }, () => {
      });
  }
  getEmployeeAttendanceData() {
    this.isAttendanceReportloading$ = true;
    this.serviceApi.get('/v1/dashboard/attdAdminDashboard').subscribe(res => {
      if (res) {
        this.punchInCount = res.punchInCount;
        this.nonPunchInCount = res.nonPunchInCount;
        this.onLeave = res.onLeaveCount;
        this.attendanceSummaryDataSetEmpty = false;
        this.chartOptionsAttendance = {
          color: '#008ffb',
          backgroundColor: '#ffffff',
          tooltip: {},
          grid: {
            left: "3%",
            right: "3%",
            bottom: "3%",
            containLabel: true,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowBlur: 10
          },
          toolbox: {
            showTitle: false,
            feature: {
              mark: { show: true },
              dataView: { show: true, readOnly: false },
              magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          xAxis: {
            type: 'category',
            data: ["Punch-In", "No Punch-In", "On-Leave"],
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: [this.punchInCount, this.nonPunchInCount, this.onLeave],
            type: 'bar',
            barWidth: "25px",
            barCategoryGap: "40%",
          }]
        };
        this.punchInCount === 0 && this.nonPunchInCount === 0 && this.onLeave === 0 ? this.showAttendanceChart = false : this.showAttendanceChart = true;
      } else {
        this.showAttendanceChart = false;
      }
      this.isAttendanceReportloading$ = false;
    }, err => {
    }, () => {
    });
  }
  getEmployeeTaxComponentsCounts() {
    this.isTaxDeclarationloading$ = true;
    this.serviceApi.get('/v1/dashboard/getAdminTaxationDetails').subscribe(res => {
      if (res) {
        let data = [];
        res.CategoryAndComponentCount.forEach(element => {
          data.push({
            "name": element.name,
            "value": element.count
          })
        });
        this.chartOptionsTaxComponents = {
          legend: {
            show: false,
          },
          tooltip: {
            trigger: 'item'
          },
          toolbox: {
            show: true,
            showTitle: false,
            feature: {
              mark: { show: true },
              dataView: { show: true, readOnly: false },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          series: [
            {
              type: 'pie',
              radius: ['40%', '70%'],
              center: ['50%', '50%'],
              roseType: 'area',
              itemStyle: {
                borderRadius: 8
              },
              data: data
            }
          ]
        };
      }
      this.isTaxDeclarationloading$ = false;
    }, err => {
    }, () => {
    });
  }
  paintAttendanceChart() {
    const canvasAttendanceChart = <HTMLCanvasElement>document.getElementById('attendanceChart');
    const ctxAttendanceChart = canvasAttendanceChart.getContext('2d');
    console.log('Att Summary Data Set is Empty');
    console.log(this.attendanceSummaryDataSetEmpty);
    if (this.attendanceSummaryDataSetEmpty) {
      ctxAttendanceChart.font = "20px 'Lato', sans-serif";
      ctxAttendanceChart.textAlign = "center";
      ctxAttendanceChart.fillText("No Data Available", canvasAttendanceChart.width / 2, canvasAttendanceChart.height / 2);
    } else {
      const attendanceChart = new Chart(ctxAttendanceChart, {
        type: 'bar',

        data: {
          labels: ['Punch-In', 'Non-Punch-In', 'On-Leave'],
          datasets: [{

            data: [this.punchInCount, this.nonPunchInCount, this.onLeave],
            // data:[10,20,70],

            borderColor: [
              'rgba(255,255,255,0.7)',
              'rgba(255,255,255,0.7)',
              'rgba(255,255,255,0.7)'
            ],
            borderWidth: 2,
            fill: true,
            backgroundColor: [
              'rgba(255,255,255,0.65)',
              'rgba(255,255,255,0.65)',
              'rgba(255,255,255,0.65)',
            ]
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                fontColor: 'rgba(255,255,255,1)',
                stepSize: 10,
                beginAtZero: true
              },

              gridLines: {
                lineWidth: 2,
                color: 'rgba(255,255,255,0.2)',
                borderDash: [2, 3],
              }
            }],
            xAxes: [{
              ticks: {
                fontColor: 'rgba(255,255,255,1)'
              },
              stacked: false,
              gridLines: {
                lineWidth: 2,
                color: 'rgba(255,255,255,0.2)',
                borderDash: [5, 6],
                drawBorder: true
              }
            }]
          },
          legend: {
            display: false,
            labels: {
              text: 'Leave Statistics',
              fontColor: 'rgb(255, 255, 255, 1)'
            }
          }
        }
      });

    }
  }
}

@Component({
  templateUrl: '../report-dialog.component.html',
})
export class ReportDialogComponent implements OnInit {
  action: any;
  error: any;
  constructor(
    public dialogRef: MatDialogRef<ReportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    console.log(data);
  }

  ngOnInit() { }
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
  templateUrl: '../timesheets-description.dialog.html',
})
export class TimeSheetsDescriptionDialogComponent implements OnInit {
  message: any;
  actions: any;
  error: any;
  timeSheetsdescriptionArray = [];
  constructor(public dialogRef: MatDialogRef<TimeSheetsDescriptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    console.log(this.data.descriptionArray)
    this.timeSheetsdescriptionArray = this.data.descriptionArray
  }
  ngOnInit() { }

  close(): void {
    this.data.message = this.message;
    this.data.actions = this.actions;
    this.dialogRef.close(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  templateUrl: 'approve-regularization-dialog.component.html',
})
export class ApproveRegularizationDialogComponent implements OnInit {
  action: any;
  error: any;
  public approveRegRequest: FormGroup;
  constructor(public dialogRef: MatDialogRef<ApproveRegularizationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder, private serviceApi: ApiCommonService) {
    this.approveRegRequest = this._fb.group(
      {
        usrComment: ['', Validators.required],
      });
  }
  approveRequest() {
    if (this.approveRegRequest.valid) {
      console.log('Comment Value.......' + this.approveRegRequest.controls.usrComment.value);
      console.log('Comment Value.......' + this.approveRegRequest.controls.usrComment.value);
      return this.serviceApi.put('/v1/attendance/regularization/admin/' + this.data.regRequestID + '/action?action=approve&&comments=' + this.approveRegRequest.controls.usrComment.value, null).
        subscribe(
          res => {
            console.log('Applied Leave Successfully...' + JSON.stringify(res));
            this.action = 'Response';
            this.error = res.message;
            this.close();
          },
          err => {
            console.log('there is something error.....  ' + err.message);
            this.action = 'Error';
            this.error = err.message;
            this.close();
          });
    }
    else {
      Object.keys(this.approveRegRequest.controls).forEach(field => {
        const control = this.approveRegRequest.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }
  ngOnInit() { }
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
  templateUrl: 'reject-regularization-dialog.component.html',
})
export class RejectRegularizationDialogComponent implements OnInit {
  action: any;
  error: any;
  rejectRegRequest: FormGroup;
  constructor(public dialogRef: MatDialogRef<RejectRegularizationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder, private serviceApi: ApiCommonService) {
    this.rejectRegRequest = this._fb.group(
      {
        usrComment: ['', Validators.required],
      });
  }
  rejectRequest() {
    if (this.rejectRegRequest.valid) {
      return this.serviceApi.put('/v1/attendance/regularization/admin/' + this.data.regRequestID + '/action?action=reject&&comments=' + this.rejectRegRequest.controls.usrComment.value, null).
        subscribe(
          res => {
            console.log('Applied Leave Successfully...' + JSON.stringify(res));
            this.action = 'Response';
            this.error = res.message;
            this.close();
          },
          err => {
            console.log('there is something error.....  ' + err.message);
            this.action = 'Error';
            this.error = err.message;
            this.close();
          });
    }
    else {
      Object.keys(this.rejectRegRequest.controls).forEach(field => {
        const control = this.rejectRegRequest.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }
  ngOnInit() { }
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
  templateUrl: 'cancel-regularization-dialog.component.html',
})
export class CancelRegularizationDialogComponent implements OnInit {
  action: any;
  error: any;
  constructor(
    public dialogRef: MatDialogRef<CancelRegularizationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private serviceApi: ApiCommonService) { }
  cancelRegRequest() {
    return this.serviceApi.put('/v1/attendance/regularization/admin/' + this.data.requestId + '/action?action=cancel&&comments= ', null).
      subscribe(
        res => {
          console.log('Applied Leave Successfully...' + JSON.stringify(res));
          this.action = 'Response';
          this.error = res.message;
          this.close();
        },
        err => {
          console.log('there is something error.....  ' + err.message);
          this.action = 'Error';
          this.error = err.message;
          this.close();
        });
  }
  ngOnInit() { }
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
  templateUrl: 'approve-multiple-regularization-dialog.component.html',
})
export class ApproveMultipleRegularizationDialogComponent implements OnInit {
  multiApproveDialog: FormGroup;
  action: any;
  error: any;
  checkedRowData = [];
  constructor(public dialogRef: MatDialogRef<ApproveMultipleRegularizationDialogComponent>, private _fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    console.log(data);
    this.checkedRowData = data.checkedRowData;
    this.multiApproveDialog = this._fb.group({
      usrComment: ['', Validators.required],
    });
  }
  ngOnInit() { }
  approveMultiRequest() {
    if (this.multiApproveDialog.valid) {
      console.log('Comment Value.......' + this.multiApproveDialog.controls.usrComment.value);
      console.log('Comment Value.......' + this.multiApproveDialog.controls.usrComment.value);
      const body = {
        "action": "APPROVE",
        "comment": this.multiApproveDialog.controls.usrComment.value,
        "reqIds": this.checkedRowData,
      }
      this.serviceApi.put('/v1/attendance/regularization/bulkAction', body).subscribe(
        res => {
          console.log('Applied Leave Successfully...' + JSON.stringify(res));
          this.action = 'Response';
          this.error = res.message;
          this.close();
        },
        err => {
          console.log('there is something error.....  ' + err.message);
          this.action = 'Error';
          this.error = err.message;
          this.close();
        });
    }
  }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
@Component({
  templateUrl: 'view-regularization-request.html',
})
export class ViewRegularizationReqComponent {
  constructor(public dialogRef: MatDialogRef<ViewRegularizationReqComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('View regularization data' + JSON.stringify(data));
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
@Component({
  templateUrl: 'approve-single-expense-application.html',
})
export class ApproveSingleExpenseApplication implements OnInit {
  action: any;
  error: any;
  approveSingleExpApplication: FormGroup;
  constructor(public dialogRef: MatDialogRef<ApproveSingleExpenseApplication>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder, private serviceApi: ApiCommonService) {
    this.approveSingleExpApplication = this._fb.group(
      {
        usrComment: ['', Validators.required],
      });
  }
  approveAppliation() {
    if (this.approveSingleExpApplication.valid) {
      console.log('Comment Value.......' + this.approveSingleExpApplication.controls.usrComment.value);
      return this.serviceApi.put('/v1/expense/application/admin/' + this.data.expId + '/action?action=APPROVE&&comments=' + this.approveSingleExpApplication.controls.usrComment.value, null).
        subscribe(
          res => {
            console.log('Approve Successfully...' + JSON.stringify(res));
            this.action = 'Response';
            this.error = res.message;
            this.close();
          },
          err => {
            console.log('there is something error.....  ' + err.message);
            this.action = 'Error';
            this.error = err.message;
            this.close();
          });
    } else {

      Object.keys(this.approveSingleExpApplication.controls).forEach(field => {
        const control = this.approveSingleExpApplication.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
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
@Component({
  templateUrl: 'reject-single-expense-application.html',
})
export class RejectSingleExpenseApplication implements OnInit {
  action: any;
  error: any;
  rejectSingleApplication: FormGroup;
  leaveId: any;
  constructor(public dialogRef: MatDialogRef<RejectSingleExpenseApplication>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder, private serviceApi: ApiCommonService) {
    this.rejectSingleApplication = this._fb.group(
      {
        usrComment: ['', Validators.required],
      });
  }
  rejectRequest() {
    if (this.rejectSingleApplication.valid) {
      console.log('Comment Value.......' + this.rejectSingleApplication.controls.usrComment.value);
      return this.serviceApi.put('/v1/expense/application/admin/' + this.data.expId + '/action?action=REJECT&&comments=' + this.rejectSingleApplication.controls.usrComment.value, null).
        subscribe(
          res => {
            console.log('Applied Leave Successfully...' + JSON.stringify(res));
            this.action = 'Response';
            this.error = res.message;
            this.close();
          },
          err => {
            console.log('there is something error.....  ' + err.message);
            this.action = 'Error';
            this.error = err.message;
            this.close();
          });
    }
    else {
      Object.keys(this.rejectSingleApplication.controls).forEach(field => {
        const control = this.rejectSingleApplication.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }
  ngOnInit() { }
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
  templateUrl: 'show-history-dialog.html',
})
export class ShowExpenseHistoryDialogComponent {
  expensesList = [];
  expenseReport = [];
  @ViewChild("dt1") dt: DataTable;
  dataColumns = [
    { field: 'expenseIncurredDate', header: 'Incurred Date' },
    { field: 'expenseName', header: 'Category' },
    { field: 'amount', header: 'Amount' },
    { field: 'isReImbursable', header: 'Reimbursable' },
    { field: 'isBillable', header: 'Billable' },
    { field: 'expenseAttachment', header: 'Attachment' },
    { field: 'actions', header: 'Actions' }
  ]
  constructor(
    private _fb: FormBuilder,
    public innerDialog: MatDialog,
    public dialogRef: MatDialogRef<ShowExpenseHistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.data.expensesList.forEach(element => {
      let expensesFieldList = [];
      element.expensesFieldList.forEach(element2 => {
        expensesFieldList.push({
          "expensesFieldId": element2.expensesFieldId,
          "fieldName": element2.fieldName,
          "fieldValue": element2.fieldValue
        })
      });
      this.expensesList.push({
        "expensesId": element.expensesId,
        "expenseName": element.expenseName,
        "amount": element.amount,
        "isReImbursable": element.isReImbursable,
        "isBillable": element.isBillable,
        "expenseComments": element.expenseComments,
        "expenseReason": element.expenseReason,
        "expenseAttachment": element.expenseAttachment,
        "expenseAttachmentId": element.expenseAttachmentId,
        "expenseIncurredDate": element.expenseIncurredDate,
        "templateCategoryId": element.templateCategoryId,
        "expensesFieldList": expensesFieldList
      });
    });
  }
  showHistoryDetailsDialog(element: any) {
    let dialogRef = this.innerDialog.open(ShowExpenseDialogComponent, {
      width: '700px',
      panelClass: 'custom-dialog-container',
      data: element,
    });
  }

  download(data: any) {
    window.location.href = environment.storageServiceBaseUrl + data.expenseAttachmentId;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
@Component({
  templateUrl: 'cancel-expense-application-request.html',
})
export class CancelExpenseApplicationRequest implements OnInit {
  action: any;
  error: any;
  constructor(public dialogRef: MatDialogRef<CancelExpenseApplicationRequest>, @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) { }
  cancelRequest() {
    this.serviceApi.put('/v1/expense/application/admin/' + this.data.expId + '/action?action=CANCEL&&comments=' + '', null).
      subscribe(
        res => {
          console.log('Cancel expense Successfully...' + JSON.stringify(res));
          this.action = 'Response';
          this.error = res.message;
          this.close();
        },
        err => {
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
@Component({
  templateUrl: 'approve-multiple-expense-request.html',
})
export class ApproveMultipleExpenseRequestDialogComponent {
  requestType: any;
  action: any;
  error: any;
  checkedRowData = [];
  multiActionDialog: FormGroup;
  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<ApproveMultipleExpenseRequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    console.log('Request Type ----- ' + this.checkedRowData);
    this.requestType = data.reqType;
    data.checkedRowData.forEach(element => {
      this.checkedRowData.push(element.expenseRepId);
    });
    this.multiActionDialog = this._fb.group({
      usrComment: ['', Validators.required]
    });
  }
  ngOnInit() {
  }
  approveMultiRequest() {
    if (this.multiActionDialog.valid) {
      console.log('Comment Value.......' + this.multiActionDialog.controls.usrComment.value);
      console.log('Comment Value.......' + this.multiActionDialog.controls.usrComment.value);
      const body = {
        "action": "APPROVE",
        "comment": this.multiActionDialog.controls.usrComment.value,
        "reqIds": this.checkedRowData,
      }
      this.serviceApi.put('/v1/expense/application/bulkAction', body).subscribe(
        res => {
          console.log('Applied Leave Successfully...' + JSON.stringify(res));
          this.action = 'Response';
          this.error = res.message;
          this.close();
        },
        err => {
          console.log('there is something error.....  ' + err.message);
          this.action = 'Error';
          this.error = err.message;
          this.close();
        });
    }
  }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
@Component({
  templateUrl: 'show-expense-dialog.html',
})
export class ShowExpenseDialogComponent {
  constructor(public innerDialog: MatDialog,
    public dialogRef: MatDialogRef<ShowExpenseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }
  download() {
    window.location.href = environment.storageServiceBaseUrl + this.data.expenseAttachmentId;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
@Component({
  templateUrl: 'approve-reject-dialog.component.html'
})
export class ApproveRejectTimesheetComponent implements OnInit {
  action: any;
  error: any;
  constructor(
    public dialogRef: MatDialogRef<ApproveRejectTimesheetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    console.log(data);
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

  approveReject() {
    var action;
    if (this.data.action == 'send reminder for ') {
      this.sendReminder();
      return;
    }
    switch (this.data.action) {
      case "approve": action = 'Approve'; break;
      case "reject": action = 'Reject'; break;
      case "cancel": action = 'Cancel'; break;
    }
    this.serviceApi.put('/v1/timesheets/admin/' + action + '/' + this.data.timeSheetId, {}).subscribe(
      res => {
        this.action = 'Response';
        this.error = res.message;
        this.close();
      },
      err => {
        this.action = 'Error';
        this.error = err.message;
        this.close();
      }
    );
  }

  sendReminder() {
    console.log(this.data);
    var body;
    if (this.data.timeSheetId != null) {
      body = {
        "empCode": null,
        "fromDate": null,
        "timeSheetId": this.data.timeSheetId,
        "toDate": null
      }
    } else {
      body = {
        "empCode": this.data.empCode,
        "fromDate": this.data.fromDate,
        "timeSheetId": null,
        "toDate": this.data.toDate
      }
    }
    console.log(body);
    this.serviceApi.put('/v1/timesheets/admin/reminder', body).subscribe(
      res => {
        this.action = 'Response';
        this.error = res.message;
        this.close();
      },
      err => {
        this.action = 'Error';
        this.error = err.message;
        this.close();
      }
    );


  }
}