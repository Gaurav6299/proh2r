import {
  Component,
  OnInit,
  Inject,
  Input,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from "@angular/core";
import {
  MatCheckboxChange,
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material";
import { Http } from "@angular/http";
import {
  FormArray,
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { AfterViewInit } from "@angular/core/src/metadata/lifecycle_hooks";
import { Observable } from "rxjs/Observable";
import { element } from "protractor";
import { Alert } from "selenium-webdriver";
import { KeycloakService } from "../../../keycloak/keycloak.service";
import { ApiCommonService } from "../../../services/api-common.service";
import { ValidationMessagesService } from "../../../validation-messages.service";
import { DataTable } from "primeng/primeng";
import { ManagementDashboardAccessComponent } from "../management-dashboard-access/management-dashboard-access.component";
declare var $: any;

@Component({
  selector: "app-manage-administrators",
  templateUrl: "./manage-administrators.component.html",
  styleUrls: ["./manage-administrators.component.scss"],
})
export class ManageAdministratorsComponent implements OnInit, AfterViewInit {
  @ViewChild("dt1") dt: DataTable;
  @ViewChild(ManagementDashboardAccessComponent)
  manageDashboardAccessChild: ManagementDashboardAccessComponent;
  addButtonVisible = true;
  updateButtonVisible = false;
  panelFirstWidth: any;
  panelFirstHeight: any;
  panelSecond: any;
  manageAdministratorListData = [];
  employeeList = [];
  employeeListCopy = [];
  notificationMsg: any;
  action: any;
  addNewEmployeeShowHide: boolean;
  editNewEmployeeShowHide: boolean;
  isValidFormSubmitted = true;
  requiredTextField;
  requiredDropdownButton;
  requiredDateButton;
  searchItemValue = new FormControl();
  accessTypes = [
    { value: "Full Access", viewValue: "Full Access" },
    { value: "Restricted Access", viewValue: "Restricted Access" },
  ];
  selected = "fullAceess";
  employeeCode = new FormControl();
  permissions: FormGroup;
  myControl = new FormControl();
  options = [];
  isLeftVisible = true;
  // tslint:disable-next-line:max-line-length
  // displayedColumns = ['employeeName', 'emailAddress', 'typeOfAccess', 'adminId'];
  columns = [
    { field: "employeeName", header: "Full Name" },
    { field: "emailAddress", header: "Email Address" },
    { field: "typeOfAccess", header: "Type Of Access" },
    { field: "adminId", header: "Actions" },
  ];
  allSelectedRolesArray = [];
  selectedOrganizationAccess: string[] = [];
  selectedDashboardAccess: string[] = [];
  selectedEmployeesAccess: string[] = [];
  selectedCalendarAccess: string[] = [];
  selectedAttendanceAccess: string[] = [];
  selectedTimesheetsAccess: string[] = [];
  selectedLeaveAccess: string[] = [];
  selectedExpenseAccess: string[] = [];
  selectedPayrollAccess: string[] = [];
  selectedTaxationAccess: string[] = [];
  selectedReportsAccess: string[] = [];
  selectedSeparationAccess: string[] = [];
  isDisableOrganizationdAccess: boolean;
  isDisableAttendanceAccess: boolean;
  isDisabledTimesheetsAccess: boolean;
  isDisabledLeaveAccess: boolean;
  isDisabledExpenseAccess: boolean;
  isDisabledPayrollAccess: boolean;
  isDisabledTaxationAccess: boolean;
  isDisabledSeparationAccess: boolean;
  dataSource: MatTableDataSource<UserData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    public dialog: MatDialog,
    private serviceApi: ApiCommonService,
    private _fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private validationMessagesService: ValidationMessagesService
  ) {
    this.getAllManageAdministratorList();
    this.validationMessagesService.currentRequiredTextField.subscribe(
      (message) => (this.requiredTextField = message)
    );
    this.validationMessagesService.currentRequiredRadioButton.subscribe(
      (message) => (this.requiredDropdownButton = message)
    );
    this.validationMessagesService.currentRequiredDateButton.subscribe(
      (message) => (this.requiredDateButton = message)
    );
    this.permissions = this._fb.group({
      adminId: [],
      employeeName: [],
      emailAddress: [],
      selectEmployee: [null, Validators.required],
      accessPermissions: [null, Validators.required],
      nameOrganizations: ["Organizations"],
      organizationStatus: [],
      editOrganizationDetails: [],
      addEditRemoveOtherAdmin: [],
      generateLetters: [],
      editEmpField: [],
      addEditDeleteCompanyHoliday: [],
      nameEmployee: ["Employee"],
      employeeStatus: [],
      editDeleteEmployee: [],
      viewSensitiveData: [],
      editSensitiveData: [],
      addEmployee: [],
      nameAttendance: ["Attendance"],
      attdStatus: [],
      modifyAttdRecords: [],
      modifyAttdTemplateGenralSetting: [],
      assignAttdTemplate: [],
      editAttdShift: [],
      assignAttdShiftTemplate: [],
      nameLeave: ["Leave"],
      leaveStatus: [],
      modifyLeaveTempletSetting: [],
      assignLeaveTemplates: [],
      leaveCancellationCrud: [],
      nameFlexiBenifit: ["Flexi Benifit"],
      flexiBenifitStatus: [],
      editAssignSupervisorCategory: [],
      approveRejDelFlexiBen: [],
      namePayroll: ["Payroll"],
      payrollStatus: [],
      runPayroll: [],
      publishPayments: [],
      modifyPayrollSettingCTCTemplate: [],
      nameExpense: ["Expense"],
      expenseStatus: [],
      modifyExpenseTemplateGernalSetting: [],
      assignExpenseTemplate: [],
      expenseReportCrud: [],
      nameCalendar: ["Calendar"],
      calendarStatus: [],
      addEditDeleteMilestons: [],
      nameResignation: ["Resignation"],
      resignationStatus: [],
      modifyResignationTemplate: [],
      assignResignationTemplate: [],
      approveAndRejectResignation: [],
      nameseparation: ["Separation"],
      separationStatus: [],
      editSepTypesAndInterviewQues: [],
      modifySeparationTempAndAssignments: [],
      initiateAndProcessSepRequests: [],
      processAssetDeallocation: [],
      nameTimeSheets: ["Time Sheets"],
      timeSheetsStatus: [],
      modifyTimeSheetTempAndAssignments: [],
      modifyProjectAndTasks: [],
      modifyTimeSheets: [],
      processTimeSheetApprovals: [],
      nameRoster: ["Roster"],
      rosterStatus: [],
      shiftCategoryCrud: [],
      assignShiftIndivisualEmpCrud: [],
      nameReports: ["Reports"],
      reportStatus: [],
    });
    const rolesArr = KeycloakService.getUserRole();

    this.serviceApi.get("/v1/employee/filterEmployees").subscribe((res) => {
      this.options = [];
      res.forEach((element1) => {
        this.options.push({
          value: element1.empCode,
          viewValue: element1.empFirstName + " " + element1.empLastName,
        });
      });
    });
  }
  onChangeRoleOrgComponents(event, value) {
    console.log(event, value)
    if (event) {
      if (value.indexOf('proH2R_organization_admin_restricted_access') == -1 && value.length >= 6) {
        this.selectedOrganizationAccess = []
        this.selectedOrganizationAccess.push(
          "proH2R_organization_admin_full_access"
        );
        this.isDisableOrganizationdAccess = true;
        this.cdr.detectChanges();
      } else if (value.indexOf('proH2R_organization_admin_restricted_access') != -1 && value.length > 6) {
        this.selectedOrganizationAccess = []
        this.selectedOrganizationAccess.push(
          "proH2R_organization_admin_full_access"
        );
        this.isDisableOrganizationdAccess = true;
        this.cdr.detectChanges();
      }
    }
  }
  onChangeRoleAttendanceComponents(event, value) {
    console.log(event, value)
    if (event) {
      if (value.indexOf('proH2R_attendance_admin_restricted_access') == -1 && value.length >= 9) {
        this.selectedAttendanceAccess = []
        this.selectedAttendanceAccess.push(
          "proH2R_attendance_admin_full_access"
        );
        this.isDisableAttendanceAccess = true;
        this.cdr.detectChanges();
      } else if (value.indexOf('proH2R_attendance_admin_restricted_access') != -1 && value.length > 9) {
        this.selectedAttendanceAccess = []
        this.selectedAttendanceAccess.push(
          "proH2R_attendance_admin_full_access"
        );
        this.isDisableAttendanceAccess = true;
        this.cdr.detectChanges();
      }
    }
  }
  onChangeRoleTimesheetsComponents(event, value) {
    console.log(event, value)
    if (event) {
      if (value.indexOf('proH2R_timesheets_admin_restricted_access') == -1 && value.length >= 4) {
        this.selectedTimesheetsAccess = []
        this.selectedTimesheetsAccess.push(
          "proH2R_timesheets_admin_full_access"
        );
        this.isDisabledTimesheetsAccess = true;
        this.cdr.detectChanges();
      } else if (value.indexOf('proH2R_timesheets_admin_restricted_access') != -1 && value.length > 4) {
        this.selectedTimesheetsAccess = []
        this.selectedTimesheetsAccess.push(
          "proH2R_timesheets_admin_full_access"
        );
        this.isDisabledTimesheetsAccess = true;
        this.cdr.detectChanges();
      }
    }
  }
  onChangeRoleLeaveComponents(event, value) {
    console.log(event, value)
    if (event) {
      if (value.indexOf('proH2R_leave_admin_restricted_access') == -1 && value.length >= 4) {
        this.selectedLeaveAccess = []
        this.selectedLeaveAccess.push(
          "proH2R_leave_admin_full_access"
        );
        this.isDisabledLeaveAccess = true;
        this.cdr.detectChanges();
      } else if (value.indexOf('proH2R_leave_admin_restricted_access') != -1 && value.length > 4) {
        this.selectedLeaveAccess = []
        this.selectedLeaveAccess.push(
          "proH2R_leave_admin_full_access"
        );
        this.isDisabledLeaveAccess = true;
        this.cdr.detectChanges();
      }
    }
  }
  onChangeRoleExpenseComponents(event, value) {
    console.log(event, value)
    if (event) {
      if (value.indexOf('proH2R_expense_admin_restricted_access') == -1 && value.length >= 2) {
        this.selectedExpenseAccess = []
        this.selectedExpenseAccess.push(
          "proH2R_expense_admin_full_access"
        );
        this.isDisabledExpenseAccess = true;
        this.cdr.detectChanges();
      } else if (value.indexOf('proH2R_expense_admin_restricted_access') != -1 && value.length > 2) {
        this.selectedExpenseAccess = []
        this.selectedExpenseAccess.push(
          "proH2R_expense_admin_full_access"
        );
        this.isDisabledExpenseAccess = true;
        this.cdr.detectChanges();
      }
    }
  }
  onChangeRolePayrollComponents(event, value) {
    console.log(event, value)
    if (event) {
      if (value.indexOf('proH2R_payroll_admin_restricted_access') == -1 && value.length >= 5) {
        this.selectedPayrollAccess = [];
        this.selectedPayrollAccess.push(
          "proH2R_payroll_admin_full_access"
        );
        this.isDisabledPayrollAccess = true;
        this.cdr.detectChanges();
      } else if (value.indexOf('proH2R_payroll_admin_restricted_access') != -1 && value.length > 5) {
        this.selectedPayrollAccess = [];
        this.selectedPayrollAccess.push(
          "proH2R_payroll_admin_full_access"
        );
        this.isDisabledPayrollAccess = true;
        this.cdr.detectChanges();
      }
    }
  }
  onChangeRoleTaxationComponents(event, value) {
    console.log(event, value)
    if (event) {
      if (value.indexOf('proH2R_taxation_admin_restricted_access') == -1 && value.length >= 4) {
        this.selectedTaxationAccess = [];
        this.selectedTaxationAccess.push(
          "proH2R_taxation_admin_full_access"
        );
        this.isDisabledTaxationAccess = true;
        this.cdr.detectChanges();
      } else if (value.indexOf('proH2R_taxation_admin_restricted_access') != -1 && value.length > 4) {
        this.selectedTaxationAccess = [];
        this.selectedTaxationAccess.push(
          "proH2R_taxation_admin_full_access"
        );
        this.isDisabledTaxationAccess = true;
        this.cdr.detectChanges();
      }
    }
  }
  onChangeRoleSeparationComponents(event, value) {
    console.log(event, value)
    if (event) {
      if (value.indexOf('proH2R_separation_admin_restricted_access') == -1 && value.length >= 3) {
        this.selectedSeparationAccess = [];
        this.selectedSeparationAccess.push(
          "proH2R_separation_admin_full_access"
        );
        this.isDisabledSeparationAccess = true;
        this.cdr.detectChanges();
      } else if (value.indexOf('proH2R_separation_admin_restricted_access') != -1 && value.length > 3) {
        this.selectedSeparationAccess = [];
        this.selectedSeparationAccess.push(
          "proH2R_separation_admin_full_access"
        );
        this.isDisabledSeparationAccess = true;
        this.cdr.detectChanges();
      }
    }
  }

  onChangeOrganizationAccess(event) {
    console.log(event);
    if (event) {
      this.selectedOrganizationAccess = [];
      this.selectedOrganizationAccess.push(
        "proH2R_organization_admin_full_access"
      );
      this.isDisableOrganizationdAccess = true;
    } else {
      this.selectedOrganizationAccess = [];
      this.isDisableOrganizationdAccess = false;
    }
  }
  onChangeAttendanceAccess(event) {
    console.log(event);
    if (event) {
      this.selectedAttendanceAccess = [];
      this.selectedAttendanceAccess.push("proH2R_attendance_admin_full_access");
      this.isDisableAttendanceAccess = true;
    } else {
      this.selectedAttendanceAccess = [];
      this.isDisableAttendanceAccess = false;
    }
  }
  onChangeTimeSheetsAccess(event) {
    console.log(event);
    if (event) {
      this.selectedTimesheetsAccess = [];
      this.selectedTimesheetsAccess.push("proH2R_timesheets_admin_full_access");
      this.isDisabledTimesheetsAccess = true;
    } else {
      this.selectedTimesheetsAccess = [];
      this.isDisabledTimesheetsAccess = false;
    }
  }
  onChangeLeaveAccess(event) {
    console.log(event);
    if (event) {
      this.selectedLeaveAccess = [];
      this.selectedLeaveAccess.push("proH2R_leave_admin_full_access");
      this.isDisabledLeaveAccess = true;
    } else {
      this.selectedLeaveAccess = [];
      this.isDisabledLeaveAccess = false;
    }
  }
  onChangeExpenseAccess(event) {
    console.log(event);
    if (event) {
      this.selectedExpenseAccess = [];
      this.selectedExpenseAccess.push("proH2R_expense_admin_full_access");
      this.isDisabledExpenseAccess = true;
    } else {
      this.selectedExpenseAccess = [];
      this.isDisabledExpenseAccess = false;
    }
  }
  onChangePayrollAccess(event) {
    console.log(event);
    if (event) {
      this.selectedPayrollAccess = [];
      this.selectedPayrollAccess.push("proH2R_payroll_admin_full_access");
      this.isDisabledPayrollAccess = true;
    } else {
      this.selectedPayrollAccess = [];
      this.isDisabledPayrollAccess = false;
    }
  }
  onChangeTaxationAccess(event) {
    console.log(event);
    if (event) {
      this.selectedTaxationAccess = [];
      this.selectedTaxationAccess.push("proH2R_taxation_admin_full_access");
      this.isDisabledTaxationAccess = true;
    } else {
      this.selectedTaxationAccess = [];
      this.isDisabledTaxationAccess = false;
    }
  }
  onChangeSeparationAccess(event) {
    console.log(event);
    if (event) {
      this.selectedSeparationAccess = [];
      this.selectedSeparationAccess.push("proH2R_separation_admin_full_access");
      this.isDisabledSeparationAccess = true;
    } else {
      this.selectedSeparationAccess = [];
      this.isDisabledSeparationAccess = false;
    }
  }
  ngOnInit() { }

  onClickEvent() {
    this.myControl.setValue("");
    this.employeeList = this.employeeListCopy;
  }
  getAuthentication(elementObj) {
    console.log("Organization Module" + this.isDisableOrganizationdAccess);
    this.isLeftVisible = !this.isLeftVisible;
    this.loadAdministrator(elementObj);
    console.log("Organization Module" + this.isDisableOrganizationdAccess);
    if (this.selectedOrganizationAccess.find((r) => r === "proH2R_organization_admin_full_access")) {
      this.isDisableOrganizationdAccess = true;
    } else {
      this.isDisableOrganizationdAccess = false;
    }
    if (this.selectedAttendanceAccess.find((r) => r === "proH2R_attendance_admin_full_access")) {
      this.isDisableAttendanceAccess = true;
    } else {
      this.isDisableAttendanceAccess = false;
    }
    if (this.selectedTimesheetsAccess.find((r) => r === "proH2R_timesheets_admin_full_access")) {
      this.isDisabledTimesheetsAccess = true;
    } else {
      this.isDisabledTimesheetsAccess = false;
    }
    if (this.selectedLeaveAccess.find((r) => r === "proH2R_leave_admin_full_access")) {
      this.isDisabledLeaveAccess = true;
    } else {
      this.isDisabledLeaveAccess = false;
    }
    if (this.selectedExpenseAccess.find((r) => r === "proH2R_expense_admin_full_access")) {
      this.isDisabledExpenseAccess = true;
    } else {
      this.isDisabledExpenseAccess = false;
    }
    if (this.selectedPayrollAccess.find((r) => r === "proH2R_payroll_admin_full_access")) {
      this.isDisabledPayrollAccess = true;
    } else {
      this.isDisabledPayrollAccess = false;
    }
    if (this.selectedTaxationAccess.find((r) => r === "proH2R_taxation_admin_full_access")) {
      this.isDisabledTaxationAccess = true;
    } else {
      this.isDisabledTaxationAccess = false;
    }
    if (this.selectedSeparationAccess.find((r) => r === "proH2R_separation_admin_full_access")) {
      this.isDisabledSeparationAccess = true;
    } else {
      this.isDisabledSeparationAccess = false;
    }
  }

  successNotification(successMessage: any) {
    $.notifyClose();
    $.notify(
      {
        icon: "check_circle",
        message: successMessage,
      },
      {
        type: "success",
        timer: 4000,
        placement: {
          from: "top",
          align: "center",
        },
      }
    );
  }
  warningNotification(warningMessage: any) {
    $.notifyClose();
    $.notify(
      {
        icon: "error",
        message: warningMessage,
      },
      {
        type: "warning",
        timer: 4000,
        placement: {
          from: "top",
          align: "center",
        },
      }
    );
  }
  selectedTabChange(event) {
    console.log(event);
    if (event.index === 0) {
      this.getAllManageAdministratorList();
      this.isLeftVisible = !this.isLeftVisible;
      this.setPanel();
    } else if (event.index === 1) {
      this.manageDashboardAccessChild.getManagementDashboardAccessList();
      this.isLeftVisible = false;
      this.setPanel();
    }
  }
  ngAfterViewInit() {
    this.panelFirstWidth = $(".divtoggleDiv")[0].offsetWidth;
    console.log("panelDive[0] width -->" + $(".divtoggleDiv")[0].offsetWidth);
    this.panelFirstHeight = $(".paneDiv")[0].offsetHeight;
    console.log("panelDive[0] height -->" + $(".divtoggleDiv")[0].offsetHeight);
    $(".divtoggleDiv")[1].style.display = "none";
  }
  searchEmployees(data: any) {
    console.log("Event ::: " + data);
    if (this.myControl.value != null) {
      this.employeeList = this.employeeListCopy.filter(
        (option) =>
          option.viewValue
            .toLowerCase()
            .indexOf(this.myControl.value.toLowerCase()) !== -1
      );
    } else {
    }
  }
  applyFilter(filterValue: string) {
    console.log("Enter for Filter the Values  : " + filterValue);
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  selectedOrganizationStatus() {
    console.log(this.permissions.controls.organizationStatus.value);
    if (this.permissions.controls.organizationStatus.value === false) {
      console.log("Inside if ::: ");
      this.permissions.controls.editOrganizationDetails.setValue(false);
      this.permissions.controls.addEditRemoveOtherAdmin.setValue(false);
      this.permissions.controls.generateLetters.setValue(false);
      this.permissions.controls.editEmpField.setValue(false);
      this.permissions.controls.addEditDeleteCompanyHoliday.setValue(false);
    }
  }
  selectedEmployee() {
    console.log(this.permissions.controls.employeeStatus.value);
    if (this.permissions.controls.employeeStatus.value === false) {
      console.log("Inside if :::");
      this.permissions.controls.editDeleteEmployee.setValue(false);
      this.permissions.controls.viewSensitiveData.setValue(false);
      this.permissions.controls.editSensitiveData.setValue(false);
      this.permissions.controls.addEmployee.setValue(false);
    }
  }
  selectedAttendance() {
    console.log(this.permissions.controls.attdStatus.value);
    if (this.permissions.controls.attdStatus.value === false) {
      console.log("Inside if :::");
      this.permissions.controls.modifyAttdTemplateGenralSetting.setValue(false);
      this.permissions.controls.assignAttdTemplate.setValue(false);
      this.permissions.controls.editAttdShift.setValue(false);
      this.permissions.controls.assignAttdShiftTemplate.setValue(false);
      this.permissions.controls.modifyAttdRecords.setValue(false);
    }
  }
  selectedLeave() {
    console.log(this.permissions.controls.leaveStatus.value);
    if (this.permissions.controls.leaveStatus.value === false) {
      console.log("Inside if :::");
      this.permissions.controls.modifyLeaveTempletSetting.setValue(false);
      this.permissions.controls.assignLeaveTemplates.setValue(false);
      this.permissions.controls.leaveCancellationCrud.setValue(false);
    }
  }
  selectedFlexiBenefits() {
    console.log(this.permissions.controls.flexiBenifitStatus.value);
    if (this.permissions.controls.flexiBenifitStatus.value === false) {
      console.log("Inside if :::");
      this.permissions.controls.editAssignSupervisorCategory.setValue(false);
      this.permissions.controls.approveRejDelFlexiBen.setValue(false);
    }
  }
  selectedPayrollStatus() {
    console.log(this.permissions.controls.payrollStatus.value);
    if (this.permissions.controls.payrollStatus.value === false) {
      console.log("Inside if :::");
      this.permissions.controls.runPayroll.setValue(false);
      this.permissions.controls.publishPayments.setValue(false);
      this.permissions.controls.modifyPayrollSettingCTCTemplate.setValue(false);
    }
  }
  selectedExpense() {
    console.log(this.permissions.controls.expenseStatus.value);
    if (this.permissions.controls.expenseStatus.value === false) {
      console.log("Inside if :::");
      this.permissions.controls.modifyExpenseTemplateGernalSetting.setValue(
        false
      );
      this.permissions.controls.assignExpenseTemplate.setValue(false);
      this.permissions.controls.expenseReportCrud.setValue(false);
    }
  }
  selectedResignation() {
    console.log(this.permissions.controls.resignationStatus.value);
    if (this.permissions.controls.resignationStatus.value === false) {
      console.log("Inside if :::");
      this.permissions.controls.modifyResignationTemplate.setValue(false);
      this.permissions.controls.assignResignationTemplate.setValue(false);
      this.permissions.controls.approveAndRejectResignation.setValue(false);
    }
  }
  selectedSeparation() {
    console.log(this.permissions.controls.separationStatus.value);
    if (this.permissions.controls.separationStatus.value === false) {
      console.log("Inside if :::");
      this.permissions.controls.editSepTypesAndInterviewQues.setValue(false);
      this.permissions.controls.modifySeparationTempAndAssignments.setValue(
        false
      );
      this.permissions.controls.initiateAndProcessSepRequests.setValue(false);
      this.permissions.controls.processAssetDeallocation.setValue(false);
    }
  }
  selectedCalender() {
    console.log(this.permissions.controls.calendarStatus.value);
    if (this.permissions.controls.calendarStatus.value === false) {
      console.log("Inside if :::");
      this.permissions.controls.addEditDeleteMilestons.setValue(false);
    }
  }
  selectedTimeSheet() {
    console.log(this.permissions.controls.timeSheetsStatus.value);
    if (this.permissions.controls.timeSheetsStatus.value === false) {
      console.log("Inside if :::");
      this.permissions.controls.modifyTimeSheetTempAndAssignments.setValue(
        false
      );
      this.permissions.controls.modifyProjectAndTasks.setValue(false);
      this.permissions.controls.modifyTimeSheets.setValue(false);
      this.permissions.controls.processTimeSheetApprovals.setValue(false);
    }
  }
  selectedRoster() {
    console.log(this.permissions.controls.rosterStatus.value);
    if (this.permissions.controls.rosterStatus.value === false) {
      console.log("Inside if :::");
      this.permissions.controls.shiftCategoryCrud.setValue(false);
      this.permissions.controls.assignShiftIndivisualEmpCrud.setValue(false);
    }
  }
  cancelAdministrator() {
    this.setPanel();
    this.searchItemValue.reset();
    this.permissions.reset();
  }
  loadAdministrator(data: any) {
    this.addNewEmployeeShowHide = false;
    this.editNewEmployeeShowHide = true;
    this.employeeCode.setValue(data.empCode);
    console.log(
      "Enter in the Edit Section : " +
      data.employeeName +
      "----" +
      data.accessTypes +
      "----" +
      data.adminId
    );
    this.getAllEmployeeList();
    console.log("panelDiv width -->" + $(".divtoggleDiv").width());
    $(".divtoggleDiv")[1].style.display = "block";
    $(".divtoggleDiv")[0].style.display = "none";
    this.permissions.reset();
    this.addButtonVisible = false;
    this.updateButtonVisible = true;
    console.log("Modify Administrator -->" + data.employeeName);
    if (data.typeOfAccess === "Full Access") {
      this.permissions.controls.adminId.setValue(data.adminId);
      this.permissions.controls.selectEmployee.setValue(data.employeeName);
      this.permissions.controls.accessPermissions.setValue(data.typeOfAccess);
    } else if (data.typeOfAccess === "Restricted Access") {
      this.selected = "Restricted Access";
      this.permissions.controls.adminId.setValue(data.adminId);
      this.permissions.controls.selectEmployee.setValue(data.employeeName);
      this.permissions.controls.accessPermissions.setValue(data.typeOfAccess);
      // Organization Module Data Set
      this.selectedOrganizationAccess = data.roles.filter((r) =>
        r == "proH2R_organization_admin_full_access" ||
        r == "proH2R_organization_admin_restricted_access" ||
        r == "proH2R_organization_setup" ||
        r == "proH2R_employee_fields" ||
        r == "proH2R_employee_tree" ||
        r == "proH2R_documents" ||
        r == "proH2R_asset_management" ||
        r == "proH2R_access_management"
      );
      // Dashboard Module Data Set
      this.selectedDashboardAccess = data.roles.filter((r) => r == "proH2R_dashboard_full_access");
      // Employees Module Data Set
      this.selectedEmployeesAccess = data.roles.filter((r) => r == "proH2R_employees_admin_full_access");
      // Calendar Module Data Set
      this.selectedCalendarAccess = data.roles.filter((r) => r == "proH2R_calendar_admin_full_access");
      // Attendance Module Data Set
      this.selectedAttendanceAccess = data.roles.filter((r) =>
        r == "proH2R_attendance_admin_full_access" ||
        r == "proH2R_attendance_admin_restricted_access" ||
        r == "proH2R_attendance_settings" ||
        r == "proH2R_attendance_records" ||
        r == "proH2R_roster_records" ||
        r == "proH2R_regularization_requests" ||
        r == "proH2R_on_duty_requests" ||
        r == "proH2R_attendance_audit" ||
        r == "proH2R_attendance_process" ||
        r == "proH2R_attendance_reconciliation" ||
        r == "proH2R_biometric_logs"
      );
      // Timesheets Module Data Set
      this.selectedTimesheetsAccess = data.roles.filter((r) =>
        r == "proH2R_timesheets_admin_full_access" ||
        r == "proH2R_timesheets_admin_restricted_access" ||
        r == "proH2R_timesheets_settings" ||
        r == "proH2R_timesheets_projects" ||
        r == "proH2R_timesheets" ||
        r == "proH2R_time_approvals"
      );
      // Leave Module Data Set
      this.selectedLeaveAccess = data.roles.filter((r) =>
        r == "proH2R_leave_admin_full_access" ||
        r == "proH2R_leave_admin_restricted_access" ||
        r == "proH2R_leave_settings" ||
        r == "proH2R_leave_grant" ||
        r == "proH2R_leave_balance" ||
        r == "proH2R_leave_application"
      );
      // Expense Module Data Set
      this.selectedExpenseAccess = data.roles.filter((r) =>
        r == "proH2R_expense_admin_full_access" ||
        r == "proH2R_expense_admin_restricted_access" ||
        r == "proH2R_expense_settings" ||
        r == "proH2R_expense_reports"
      );
      // Payroll Module Data Set
      this.selectedPayrollAccess = data.roles.filter((r) =>
        r == "proH2R_payroll_admin_full_access" ||
        r == "proH2R_payroll_admin_restricted_access" ||
        r == "proH2R_payroll_settings" ||
        r == "proH2R_ctc_templates" ||
        r == "proH2R_lop_reversal" ||
        r == "proH2R_run_payroll" ||
        r == "proH2R_payslips"
      );
      // Taxation Module Data Set
      this.selectedTaxationAccess = data.roles.filter((r) =>
        r == "proH2R_taxation_admin_full_access" ||
        r == "proH2R_taxation_admin_restricted_access" ||
        r == "proH2R_taxation_settings" ||
        r == "proH2R_tax_exemptions" ||
        r == "proH2R_tax_declarations" ||
        r == "proH2R_taxation_etds"
      );
      // Reports Module Data Set
      this.selectedReportsAccess = data.roles.filter((r) => r == "proH2R_reports_admin_full_access");
      // Separation Module Data Set
      this.selectedSeparationAccess = data.roles.filter((r) =>
        r == "proH2R_separation_admin_full_access" ||
        r == "proH2R_separation_admin_restricted_access" ||
        r == "proH2R_separation_settings" ||
        r == "proH2R_separation_requests" ||
        r == "proH2R_asset_deallocation_requests"
      );
    }
  }
  setPanel() {
    this.permissions.reset({});
    this.selectedOrganizationAccess = [];
    this.selectedDashboardAccess = [];
    this.selectedEmployeesAccess = [];
    this.selectedCalendarAccess = [];
    this.selectedAttendanceAccess = [];
    this.selectedTimesheetsAccess = [];
    this.selectedLeaveAccess = [];
    this.selectedExpenseAccess = [];
    this.selectedPayrollAccess = [];
    this.selectedTaxationAccess = [];
    this.selectedReportsAccess = [];
    this.selectedSeparationAccess = [];
    $(".divtoggleDiv")[1].style.display = "none";
    $(".divtoggleDiv")[0].style.display = "block";
    $(".divtoggleDiv").width(this.panelFirstWidth);
  }

  deleteAdministrator(data: any) {
    console.log("delete the following administrator-->" + data);
    const dialogRef = this.dialog.open(DeleteDialogAdministratorsComponent, {
      width: "500px",
      panelClass: "custom-dialog-container",
      data: { adminId: data.adminId },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        console.log("Result value ..... " + JSON.stringify(result));
        if (result.message) {
          console.log("Result value ..... " + result.message);
          if (result.status === "Response") {
            this.notificationMsg = result.message;
            this.successNotification(this.notificationMsg);
          } else if (result.status === "Error") {
            this.notificationMsg = result.message;
            // this.warningNotification(this.notificationMsg);
          }
        }
      }
      this.getAllManageAdministratorList();
      console.log("The dialog was closed");
    });
  }
  addAdministrator() {
    console.log("Add administrator called");
    this.permissions.reset();
    this.selectedOrganizationAccess = [];
    this.selectedDashboardAccess = [];
    this.selectedEmployeesAccess = [];
    this.selectedCalendarAccess = [];
    this.selectedAttendanceAccess = [];
    this.selectedTimesheetsAccess = [];
    this.selectedLeaveAccess = [];
    this.selectedExpenseAccess = [];
    this.selectedPayrollAccess = [];
    this.selectedTaxationAccess = [];
    this.selectedReportsAccess = [];
    this.selectedSeparationAccess = [];
    this.addNewEmployeeShowHide = true;
    this.editNewEmployeeShowHide = false;

    this.getAllEmployeeList();
    $(".divtoggleDiv")[1].style.display = "block";
    $(".divtoggleDiv")[0].style.display = "none";
    this.addButtonVisible = true;
    this.updateButtonVisible = false;
    this.isDisableOrganizationdAccess = false;
    this.isDisableAttendanceAccess = false;
    this.isDisabledTimesheetsAccess = false;
    this.isDisabledLeaveAccess = false;
    this.isDisabledExpenseAccess = false;
    this.isDisabledPayrollAccess = false;
    this.isDisabledTaxationAccess = false;
    this.isDisabledSeparationAccess = false;
  }

  saveAdministratorInfo(value: any) {
    if (this.permissions.valid) {
      const temp = this.employeeList;
      let emailid;
      let fulName;
      for (let i = 0; i < this.employeeList.length; i++) {
        console.log(temp[i].value);
        if (this.permissions.controls.selectEmployee.value === temp[i].value) {
          emailid = temp[i].value;
          fulName = temp[i].viewValue;
          break;
        }
      }
      console.log(
        "Employee Code and Name : " +
        this.permissions.controls.selectEmployee.value
      );
      console.log(
        "Employee Permission Type : " +
        this.permissions.controls.accessPermissions.value
      );
      const fullName = this.permissions.controls.selectEmployee.value;
      if (this.permissions.controls.selectEmployee.value != null) {
        if (
          this.permissions.controls.accessPermissions.value === "Full Access"
        ) {
          console.log(">>>>> Enter in the Full Access Function");
          const v = "true";
          const body = {
            adminId: "",
            empCode: this.permissions.controls.selectEmployee.value,
            roles: ["admin"],
            typeOfAccess: this.permissions.controls.accessPermissions.value,
          };
          this.serviceApi.post("/v1/organization/manageadmin/", body).subscribe(
            (res) => {
              console.log(
                "Admin Successfully Saved with Full Accessibility....."
              );
              this.successNotification(res.message);
            },
            (err) => {
              console.log("Something Gone Wrong" + JSON.stringify(err));
            },
            () => {
              this.getAllManageAdministratorList();
            }
          );
        } else if (this.permissions.controls.accessPermissions.value === "Restricted Access") {
          // Organization Module Data
          if (this.selectedOrganizationAccess.find((role) => role === "proH2R_organization_setup" || role === "proH2R_employee_fields" || role === "proH2R_employee_tree" ||
            role === "proH2R_documents" || role === "proH2R_asset_management" || role === "proH2R_access_management")) {
            this.selectedOrganizationAccess.push(
              "proH2R_organization_admin_restricted_access"
            );
          } else if (this.selectedOrganizationAccess.find((role) => role != "proH2R_organization_admin_full_access")) {
            var index = this.selectedOrganizationAccess.indexOf(
              $(this).attr("proH2R_organization_admin_restricted_access"));
            this.selectedOrganizationAccess.splice(index, 1);
          }
          // Attendance Module Data
          if (this.selectedAttendanceAccess.find((role) => role === "proH2R_attendance_settings" || role === "proH2R_attendance_records" || role === "proH2R_roster_records" ||
            role === "proH2R_regularization_requests" || role === "proH2R_on_duty_requests" || role === "proH2R_attendance_audit" || role === "proH2R_attendance_process" ||
            role === "proH2R_attendance_reconciliation" || role === "proH2R_biometric_logs")) {
            this.selectedAttendanceAccess.push(
              "proH2R_attendance_admin_restricted_access"
            );
          } else if (this.selectedAttendanceAccess.find((role) => role != "proH2R_attendance_admin_full_access")) {
            var index = this.selectedAttendanceAccess.indexOf(
              $(this).attr("proH2R_attendance_admin_restricted_access")
            );
            this.selectedAttendanceAccess.splice(index, 1);
          }
          // Timesheets Module Data
          if (this.selectedTimesheetsAccess.find((role) => role === "proH2R_timesheets_settings" || role === "proH2R_timesheets_projects" || role === "proH2R_timesheets" ||
            role === "proH2R_time_approvals")) {
            this.selectedTimesheetsAccess.push(
              "proH2R_timesheets_admin_restricted_access"
            );
          } else if (this.selectedTimesheetsAccess.find((role) => role != "proH2R_timesheets_admin_full_access")) {
            var index = this.selectedTimesheetsAccess.indexOf(
              $(this).attr("proH2R_timesheets_admin_restricted_access")
            );
            this.selectedTimesheetsAccess.splice(index, 1);
          }
          // Leave Module Data
          if (this.selectedLeaveAccess.find((role) => role === "proH2R_leave_settings" || role === "proH2R_leave_grant" || role === "proH2R_leave_balance" || role === "proH2R_leave_application")) {
            this.selectedLeaveAccess.push(
              "proH2R_leave_admin_restricted_access"
            );
          } else if (this.selectedLeaveAccess.find((role) => role != "proH2R_leave_admin_full_access")) {
            var index = this.selectedLeaveAccess.indexOf(
              $(this).attr("proH2R_leave_admin_restricted_access")
            );
            this.selectedLeaveAccess.splice(index, 1);
          }
          // Expense Module Data
          if (this.selectedExpenseAccess.find((role) => role === "proH2R_expense_settings" || role === "proH2R_expense_reports")) {
            this.selectedExpenseAccess.push(
              "proH2R_expense_admin_restricted_access"
            );
          } else if (this.selectedExpenseAccess.find((role) => role != "proH2R_expense_admin_full_access")) {
            var index = this.selectedExpenseAccess.indexOf(
              $(this).attr("proH2R_expense_admin_restricted_access")
            );
            this.selectedExpenseAccess.splice(index, 1);
          }
          // Payroll Module Data
          if (this.selectedPayrollAccess.find((role) => role === "proH2R_payroll_settings" || role === "proH2R_ctc_templates" || role === "proH2R_lop_reversal" || role === "proH2R_run_payroll" || role === "proH2R_payslips")
          ) {
            this.selectedPayrollAccess.push(
              "proH2R_payroll_admin_restricted_access"
            );
          } else if (this.selectedPayrollAccess.find((role) => role != "proH2R_payroll_admin_full_access")) {
            var index = this.selectedPayrollAccess.indexOf(
              $(this).attr("proH2R_payroll_admin_restricted_access")
            );
            this.selectedPayrollAccess.splice(index, 1);
          }
          // Taxation Module Data
          if (this.selectedTaxationAccess.find((role) => role === "proH2R_taxation_settings" || role === "proH2R_tax_exemptions" || role === "proH2R_tax_declarations" ||
            role === "proH2R_taxation_etds")) {
            this.selectedTaxationAccess.push(
              "proH2R_taxation_admin_restricted_access"
            );
          } else if (this.selectedTaxationAccess.find((role) => role != "proH2R_taxation_admin_full_access")) {
            var index = this.selectedTaxationAccess.indexOf(
              $(this).attr("proH2R_taxation_admin_restricted_access")
            );
            this.selectedTaxationAccess.splice(index, 1);
          }
          // Separation Module Data
          if (this.selectedSeparationAccess.find((role) => role === "proH2R_separation_settings" || role === "proH2R_separation_requests" || role === "proH2R_asset_deallocation_requests")
          ) {
            this.selectedSeparationAccess.push(
              "proH2R_separation_admin_restricted_access"
            );
          } else if (this.selectedSeparationAccess.find((role) => role != "proH2R_separation_admin_full_access")) {
            var index = this.selectedSeparationAccess.indexOf(
              $(this).attr("proH2R_separation_admin_restricted_access")
            );
            this.selectedSeparationAccess.splice(index, 1);
          }
          let selectedRolesArray = [
            ...this.selectedOrganizationAccess,
            ...this.selectedDashboardAccess,
            ...this.selectedEmployeesAccess,
            ...this.selectedCalendarAccess,
            ...this.selectedTimesheetsAccess,
            ...this.selectedAttendanceAccess,
            ...this.selectedLeaveAccess,
            ...this.selectedExpenseAccess,
            ...this.selectedPayrollAccess,
            ...this.selectedTaxationAccess,
            ...this.selectedReportsAccess,
            ...this.selectedSeparationAccess,
          ];
          this.allSelectedRolesArray = selectedRolesArray.filter(
            (x, index, data) => index === data.findIndex((role) => role === x)
          );
          const body = {
            adminId: 0,
            empCode: this.permissions.controls.selectEmployee.value,
            roles: this.allSelectedRolesArray,
            typeOfAccess: this.permissions.controls.accessPermissions.value,
          };
          body.roles.push("restrictAdmin");
          console.log(JSON.stringify(body));
          this.serviceApi.post("/v1/organization/manageadmin/", body).subscribe(
            (res) => {
              this.getAllManageAdministratorList();
              console.log(
                "Admin Successfully Saved with Restricted Access Accessibility....."
              );
              this.successNotification(res.message);
            },
            (err) => {
              console.log("Something Gone Wrong" + JSON.stringify(err));
            }
          );
        } else {
          console.log(">>>>> Something gone wrong");
        }
      } else {
        console.log(
          " >>>> Something gone wrong.. You Selected Nothing <<<<<< "
        );
      }
      this.isLeftVisible = !this.isLeftVisible;
      this.addButtonVisible = true;
      this.setPanel();
    } else {
      Object.keys(this.permissions.controls).forEach((field) => {
        // {1}
        const control = this.permissions.get(field); // {2}
        control.markAsTouched({ onlySelf: true }); // {3}
      });
    }
  }
  /*****  */
  UpdateAdministratorInfo(value: any) {
    const temp = this.employeeList;
    let emailid;
    let fulName;
    for (let i = 0; i < this.employeeList.length; i++) {
      console.log(temp[i].value);
      if (this.permissions.controls.selectEmployee.value === temp[i].value) {
        emailid = temp[i].value;
        fulName = temp[i].viewValue;
        break;
      }
    }
    console.log(
      "Enter in the Update Admin Id " + this.permissions.controls.adminId.value
    );
    const val = this.permissions.controls.adminId.value;
    if (this.permissions.controls.accessPermissions.value === "Full Access") {
      const body = {
        adminId: this.permissions.controls.adminId.value,
        emailAddress: emailid,
        empCode: this.employeeCode.value,
        roles: ["admin"],
        typeOfAccess: this.permissions.controls.accessPermissions.value,
      };
      console.log("Access permission List---- " + JSON.stringify(body));
      this.serviceApi
        .put("/v1/organization/manageadmin/" + +val, body)
        .subscribe(
          (res) => {
            this.getAllManageAdministratorList();
            console.log("SuccessFully Updated The Data using PUT Method");
            this.successNotification(res.message);
          },
          (err) => {
            console.log("Something gone wrong");
          }
        );
    } else {
      // Organization Module Data
      if (this.selectedOrganizationAccess.find((role) => role === "proH2R_organization_setup" || role === "proH2R_employee_fields" || role === "proH2R_employee_tree" ||
        role === "proH2R_documents" || role === "proH2R_asset_management" || role === "proH2R_access_management")) {
        this.selectedOrganizationAccess.push(
          "proH2R_organization_admin_restricted_access"
        );
      } else if (this.selectedOrganizationAccess.find((role) => role != "proH2R_organization_admin_full_access")) {
        var index = this.selectedOrganizationAccess.indexOf(
          $(this).attr("proH2R_organization_admin_restricted_access")
        );
        this.selectedOrganizationAccess.splice(index, 1);
      }
      // Attendance Module Data
      if (this.selectedAttendanceAccess.find((role) => role === "proH2R_attendance_settings" || role === "proH2R_attendance_records" || role === "proH2R_roster_records" || role === "proH2R_regularization_requests" || role === "proH2R_on_duty_requests" || role === "proH2R_attendance_audit" || role === "proH2R_attendance_process" || role === "proH2R_attendance_reconciliation" || role === "proH2R_biometric_logs")) {
        this.selectedAttendanceAccess.push(
          "proH2R_attendance_admin_restricted_access"
        );
      } else if (this.selectedAttendanceAccess.find((role) => role != "proH2R_attendance_admin_full_access")) {
        var index = this.selectedAttendanceAccess.indexOf(
          $(this).attr("proH2R_attendance_admin_restricted_access")
        );
        this.selectedAttendanceAccess.splice(index, 1);
      }
      // Timesheets Module Data
      if (this.selectedTimesheetsAccess.find((role) => role === "proH2R_timesheets_settings" || role === "proH2R_timesheets_projects" || role === "proH2R_timesheets" ||
        role === "proH2R_time_approvals")) {
        this.selectedTimesheetsAccess.push(
          "proH2R_timesheets_admin_restricted_access"
        );
      } else if (this.selectedTimesheetsAccess.find((role) => role != "proH2R_timesheets_admin_full_access")) {
        var index = this.selectedTimesheetsAccess.indexOf(
          $(this).attr("proH2R_timesheets_admin_restricted_access")
        );
        this.selectedTimesheetsAccess.splice(index, 1);
      }
      // Leave Module Data
      if (this.selectedLeaveAccess.find((role) => role === "proH2R_leave_settings" || role === "proH2R_leave_grant" || role === "proH2R_leave_balance" || role === "proH2R_leave_application")) {
        this.selectedLeaveAccess.push("proH2R_leave_admin_restricted_access");
      } else if (this.selectedLeaveAccess.find((role) => role != "proH2R_leave_admin_full_access")) {
        var index = this.selectedLeaveAccess.indexOf(
          $(this).attr("proH2R_leave_admin_restricted_access")
        );
        this.selectedLeaveAccess.splice(index, 1);
      }
      // Expense Module Data
      if (this.selectedExpenseAccess.find((role) => role === "proH2R_expense_settings" || role === "proH2R_expense_reports")) {
        this.selectedExpenseAccess.push(
          "proH2R_expense_admin_restricted_access"
        );
      } else if (this.selectedExpenseAccess.find((role) => role != "proH2R_expense_admin_full_access")) {
        var index = this.selectedExpenseAccess.indexOf(
          $(this).attr("proH2R_expense_admin_restricted_access")
        );
        this.selectedExpenseAccess.splice(index, 1);
      }
      // Payroll Module Data
      if (this.selectedPayrollAccess.find((role) => role === "proH2R_payroll_settings" || role === "proH2R_ctc_templates" || role === "proH2R_lop_reversal" ||
        role === "proH2R_run_payroll" || role === "proH2R_payslips")) {
        this.selectedPayrollAccess.push(
          "proH2R_payroll_admin_restricted_access"
        );
      } else if (this.selectedPayrollAccess.find((role) => role != "proH2R_payroll_admin_full_access")) {
        var index = this.selectedPayrollAccess.indexOf(
          $(this).attr("proH2R_payroll_admin_restricted_access")
        );
        this.selectedPayrollAccess.splice(index, 1);
      }
      // Taxation Module Data
      if (this.selectedTaxationAccess.find((role) => role === "proH2R_taxation_settings" || role === "proH2R_tax_exemptions" || role === "proH2R_tax_declarations" ||
        role === "proH2R_taxation_etds")) {
        this.selectedTaxationAccess.push(
          "proH2R_taxation_admin_restricted_access"
        );
      } else if (this.selectedTaxationAccess.find((role) => role != "proH2R_taxation_admin_full_access")) {
        var index = this.selectedTaxationAccess.indexOf(
          $(this).attr("proH2R_taxation_admin_restricted_access")
        );
        this.selectedTaxationAccess.splice(index, 1);
      }
      // Separation Module Data
      if (this.selectedSeparationAccess.find((role) => role === "proH2R_separation_settings" || role === "proH2R_separation_requests" || role === "proH2R_asset_deallocation_requests")) {
        this.selectedSeparationAccess.push(
          "proH2R_separation_admin_restricted_access"
        );
      } else if (this.selectedSeparationAccess.find((role) => role != "proH2R_separation_admin_full_access")) {
        var index = this.selectedSeparationAccess.indexOf(
          $(this).attr("proH2R_separation_admin_restricted_access")
        );
        this.selectedSeparationAccess.splice(index, 1);
      }
      let selectedRolesArray = [
        ...this.selectedOrganizationAccess,
        ...this.selectedDashboardAccess,
        ...this.selectedEmployeesAccess,
        ...this.selectedCalendarAccess,
        ...this.selectedTimesheetsAccess,
        ...this.selectedAttendanceAccess,
        ...this.selectedLeaveAccess,
        ...this.selectedExpenseAccess,
        ...this.selectedPayrollAccess,
        ...this.selectedTaxationAccess,
        ...this.selectedReportsAccess,
        ...this.selectedSeparationAccess,
      ];
      this.allSelectedRolesArray = selectedRolesArray.filter(
        (x, index, data) => index === data.findIndex((role) => role === x)
      );
      const body = {
        adminId: this.permissions.controls.adminId.value,
        employeeName: fulName,
        empCode: this.employeeCode.value,
        roles: this.allSelectedRolesArray,
        typeOfAccess: this.permissions.controls.accessPermissions.value,
      };
      body.roles.push("restrictAdmin");
      console.log("Restricted Access Permission---" + JSON.stringify(body));
      this.serviceApi
        .put("/v1/organization/manageadmin/" + +val, body)
        .subscribe(
          (res) => {
            this.getAllManageAdministratorList();
            console.log("SuccessFully Updated The Data using PUT Method");
            this.successNotification(res.message);
          },
          (err) => {
            console.log("Something gone wrong" + JSON.stringify(err));
          }
        );
    }
  }
  /*****  Start Retriving data from Table  by calling service of Api *****/
  getAllManageAdministratorList() {
    this.manageAdministratorListData = [];
    console.log(
      "<------------------ Get All Admin List With Accessibilty---------------------->"
    );
    this.serviceApi.get("/v1/organization/manageadmin/").subscribe(
      (res) => {
        if (res != null) {
          console.log(
            "<------------------ Manage Administrator One Add From Many Informations ---------------------->"
          );
          // tslint:disable-next-line:no-shadowed-variable
          res.forEach((element) => {
            this.manageAdministratorListData.push({
              adminId: element.adminId,
              empCode: element.empCode,
              roles: element.roles,
              emailAddress: element.emailAddress,
              employeeName: element.empName,
              typeOfAccess: element.typeOfAccess,
            });
          });
        } else {
          console.log("Data Doesnot Exist");
          this.manageAdministratorListData = [];
        }
      },
      (err) => {
        this.manageAdministratorListData = [];
      },
      () => {
        console.log("Enter into Else Bloack");
        this.dt.reset();
      }
    );
  }
  /***** End of the Code For the Retriving the Data *****/

  /***** Start the Retriving the List of Employees which will be added for the Admin Accessibilty *****/
  getAllEmployeeList() {
    this.employeeList = [];
    this.employeeListCopy = [];
    console.log(
      ">>>>>>>>>>>>>>>>Enter for Getting Bank List <<<<<<<<<<<<<<<<<<<<<<<"
    );
    return this.serviceApi.get("/v1/employee/filterEmployees").subscribe(
      (res) => {
        res.forEach((element1) => {
          this.employeeList.push({
            value: element1.empCode,
            viewValue: element1.empFirstName + " " + element1.empLastName,
          });

          this.employeeListCopy.push({
            value: element1.empCode,
            viewValue: element1.empFirstName + " " + element1.empLastName,
          });
        });
      },
      (err) => {
        console.log("There is Something Error in the Retriving Employee List");
      }
    );
  }
}

@Component({
  selector: "app-delete-dialog-administrators",
  templateUrl: "./delete-dialog-administrators.component.html",
  styleUrls: ["./delete-dialog-administrators.component.scss"],
})
export class DeleteDialogAdministratorsComponent {
  error = "Error Message";
  action: any;

  constructor(
    public dialogRef: MatDialogRef<ManageAdministratorsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private serviceApi: ApiCommonService,
    private http: Http,
    private _fb: FormBuilder
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  successNotification(successMessage: any) {
    $.notifyClose();
    $.notify(
      {
        icon: "check_circle",
        message: successMessage,
      },
      {
        type: "success",
        timer: 4000,
        placement: {
          from: "top",
          align: "center",
        },
      }
    );
  }
  /***** Code for Delete the Admin *****/
  deleteAdministrator() {
    const val = this.data.adminId;
    console.log("delete adminsitrator successfully ");
    this.serviceApi.delete("/v1/organization/manageadmin/" + +val).subscribe(
      (res) => {
        console.log("Enter in the Successfully Delete Data");
        this.action = "Response";
        this.error = res.message;
        this.successNotification(res.message);
        this.close();
      },
      (err) => {
        console.log("Something Wrong");
        this.action = "Error";
        this.error = err.message;
        this.close();
      }
    );
  }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
}

@Component({
  selector: "app-edit-administrators",
  templateUrl: "./edit-administrators.component.html",
  styleUrls: ["./edit-administrators.component.scss"],
})
export class EditAdministratorsComponent {
  locationDialog: FormGroup;
  constructor(private _fb: FormBuilder, private http: Http) {
    console.log("data-->");
  }
  onNoClick(): void { }
  saveLocation() { }
}

/***** Interface for Showing Data in Table */
export interface UserData {
  adminId: number;
  empCode: number;
  employeeName: string;
  emailAddress: string;
  typeOfAccess: string;

  organizationStatus: boolean;
  editOrganizationDetails: boolean;
  addEditRemoveOtherAdmin: boolean;
  generateLetters: boolean;
  editEmpField: boolean;
  addEditDeleteCompanyHoliday: boolean;

  employeeStatus: boolean;
  editDeleteEmployee: boolean;
  viewSensitiveData: boolean;
  editSensitiveData: boolean;
  addEmployee: boolean;

  attdStatus: boolean;
  modifyAttdRecords: boolean;
  modifyAttdTemplateGenralSetting: boolean;
  assignAttdTemplate: boolean;
  editAttdShift: boolean;
  assignAttdShiftTemplate: boolean;

  leaveStatus: boolean;
  modifyLeaveTempletSetting: boolean;
  assignLeaveTemplates: boolean;
  leaveCancellationCrud: boolean;
  flexiBenifitStatus: boolean;
  editAssignSupervisorCategory: boolean;
  approveRejDelFlexiBen: boolean;

  payrollStatus: boolean;
  runPayroll: boolean;
  publishPayments: boolean;
  modifyPayrollSettingCTCTemplate: boolean;

  expenseStatus: boolean;
  modifyExpenseTemplateGernalSetting: boolean;
  assignExpenseTemplate: boolean;
  expenseReportCrud: boolean;

  calendarStatus: boolean;
  addEditDeleteMilestons: boolean;

  timeSheetsStatus: boolean;
  modifyTimeSheetGenSetting: boolean;
  assignTimeSheetsTemplate: boolean;
  timesheetsCrud: boolean;

  rosterStatus: boolean;
  shiftCategoryCrud: boolean;
  assignShiftIndivisualEmpCrud: boolean;
  reportStatus: boolean;

  resignationStatus: boolean;
  modifyResignationTemplate: boolean;
  assignResignationTemplate: boolean;
  approveAndRejectResignation: boolean;
  separationStatus: boolean;
}
/***** End of the Inteface ******/
