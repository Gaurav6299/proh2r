import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ApiCommonService } from '../../../services/api-common.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { environment } from '../../../../environments/environment';
declare var $: any;
@Component({
  selector: 'app-custom-report',
  templateUrl: './custom-report.component.html',
  styleUrls: ['./custom-report.component.scss']
})
export class CustomReportComponent implements OnInit {
  fixedAllowances = [];
  variableAllowances = [];
  employerContributions = [];
  fixedDeductions = [];
  employeeDeductions = [];
  personalDetails = [];
  bankDetails = [];
  addressDetails = [];
  selectedFields = [];
  attendanceRecords = [];
  attendanceSettings = [];
  leaveSettings = [];
  leaveTransactions = [];
  expenseTransactions = [];
  expenseSettings = [];

  constructor(public dialog: MatDialog, private serviceApi: ApiCommonService) { }

  ngOnInit() {
    this.getCustomFields();
  }

  getCustomFields() {
    this.fixedAllowances = [];
    this.variableAllowances = [];
    this.employerContributions = [];
    this.fixedDeductions = [];
    this.employeeDeductions = [];
    this.personalDetails = [];
    this.bankDetails = [];
    this.addressDetails = [];
    this.attendanceRecords = [];
    this.attendanceSettings = [];
    this.leaveSettings = [];
    this.leaveTransactions = [];
    this.expenseTransactions = [];
    this.expenseSettings = [];
    this.serviceApi.get('/v1/custom-reports/fields').subscribe(res => {
      this.fixedAllowances = res.payrollMaster.fixedAllowances;
      this.variableAllowances = res.payrollMaster.variableAllowances;
      this.employerContributions = res.payrollMaster.employerContributions;
      this.fixedDeductions = res.payrollMaster.fixedDeductions;
      this.employeeDeductions = res.payrollMaster.employeeDeductions;
      this.personalDetails = res.employeeMaster.personalDetails;
      this.bankDetails = res.employeeMaster.bankDetails;
      this.addressDetails = res.employeeMaster.addressDetails;
      this.attendanceRecords = res.attendanceMaster.attendanceRecords;
      this.attendanceSettings = res.attendanceMaster.attendanceSettings;
      this.leaveSettings = res.leaveMaster.leaveSettings;
      this.leaveTransactions = res.leaveMaster.leaveTransactions;
      this.expenseSettings = res.expenseMaster.expenseSettings;
      this.expenseTransactions = res.expenseMaster.expenseTransactions;

    }, (err) => {

    }, () => {
      this.fixedAllowances.map(fixedAllowance => {
        fixedAllowance.fieldValue = false;
      });
      this.variableAllowances.map(variableAllowance => {
        variableAllowance.fieldValue = false;
      });
      this.employerContributions.map(employerContribution => {
        employerContribution.fieldValue = false;
      });
      this.fixedDeductions.map(fixedDeduction => {
        fixedDeduction.fieldValue = false;
      });
      this.personalDetails.map(personalDetail => {
        personalDetail.fieldValue = false;
      });
      this.bankDetails.map(bankDetail => {
        bankDetail.fieldValue = false;
      });
      this.addressDetails.map(addressDetail => {
        addressDetail.fieldValue = false;
      });
      this.fixedAllowances.map(fixedAllowance => {
        fixedAllowance.fieldValue = false;
      });
      this.attendanceRecords.map(attendanceRecord => {
        attendanceRecord.fieldValue = false;
      });
      this.attendanceSettings.map(attendanceSetting => {
        attendanceSetting.fieldValue = false;
      });
      this.leaveSettings.map(leaveSetting => {
        leaveSetting.fieldValue = false;
      });
      this.leaveTransactions.map(leaveTransaction => {
        leaveTransaction.fieldValue = false;
      });
      this.expenseSettings.map(expenseSetting => {
        expenseSetting.fieldValue = false;
      });
      this.expenseTransactions.map(expenseTransaction => {
        expenseTransaction.fieldValue = false;
      });
    });

  }

  onFieldCheck(event: any, selection: any) {
    if (selection.categoryName === "fixedAllowances") {
      var index = this.fixedAllowances.indexOf(selection);
      this.fixedAllowances[index].fieldValue = event.checked;
    }
    if (selection.categoryName === "variableAllowances") {
      var index = this.variableAllowances.indexOf(selection);
      this.variableAllowances[index].fieldValue = event.checked;
    }
    if (selection.categoryName === "employerContributions") {
      var index = this.employerContributions.indexOf(selection);
      this.employerContributions[index].fieldValue = event.checked;
    }
    if (selection.categoryName === "fixedDeductions") {
      var index = this.fixedDeductions.indexOf(selection);
      this.fixedDeductions[index].fieldValue = event.checked;
    }
    if (selection.categoryName === "employeeDeductions") {
      var index = this.employeeDeductions.indexOf(selection);
      this.employeeDeductions[index].fieldValue = event.checked;
    }
    if (selection.categoryName === "personalDetails") {
      var index = this.personalDetails.indexOf(selection);
      this.personalDetails[index].fieldValue = event.checked;
    }
    if (selection.categoryName === "bankDetails") {
      var index = this.bankDetails.indexOf(selection);
      this.bankDetails[index].fieldValue = event.checked;
    }
    if (selection.categoryName === "addressDetails") {
      var index = this.addressDetails.indexOf(selection);
      this.addressDetails[index].fieldValue = event.checked;
    }
    if (selection.categoryName === "attendanceSettings") {
      var index = this.attendanceSettings.indexOf(selection);
      this.attendanceSettings[index].fieldValue = event.checked;
    }
    if (selection.categoryName === "attendanceRecords") {
      var index = this.attendanceRecords.indexOf(selection);
      this.attendanceRecords[index].fieldValue = event.checked;
    }
    if (selection.categoryName === "leaveSettings") {
      var index = this.leaveSettings.indexOf(selection);
      this.leaveSettings[index].fieldValue = event.checked;
    }
    if (selection.categoryName === "leaveTransactions") {
      var index = this.leaveTransactions.indexOf(selection);
      this.leaveTransactions[index].fieldValue = event.checked;
    }
    if (selection.categoryName === "expenseSettings") {
      var index = this.expenseSettings.indexOf(selection);
      this.expenseSettings[index].fieldValue = event.checked;
    }
    if (selection.categoryName === "expenseTransactions") {
      var index = this.expenseTransactions.indexOf(selection);
      this.expenseTransactions[index].fieldValue = event.checked;
    }
  }

  onFieldDelete(selection: any) {
    if (selection.categoryName === "fixedAllowances") {
      var index = this.fixedAllowances.indexOf(selection);
      this.fixedAllowances[index].fieldValue = false;
    }
    if (selection.categoryName === "variableAllowances") {
      var index = this.variableAllowances.indexOf(selection);
      this.variableAllowances[index].fieldValue = false;
    }
    if (selection.categoryName === "employerContributions") {
      var index = this.employerContributions.indexOf(selection);
      this.employerContributions[index].fieldValue = false;
    }
    if (selection.categoryName === "fixedDeductions") {
      var index = this.fixedDeductions.indexOf(selection);
      this.fixedDeductions[index].fieldValue = false;
    }
    if (selection.categoryName === "employeeDeductions") {
      var index = this.employeeDeductions.indexOf(selection);
      this.employeeDeductions[index].fieldValue = false;
    }
    if (selection.categoryName === "personalDetails") {
      var index = this.personalDetails.indexOf(selection);
      this.personalDetails[index].fieldValue = false;
    }
    if (selection.categoryName === "bankDetails") {
      var index = this.bankDetails.indexOf(selection);
      this.bankDetails[index].fieldValue = false;
    }
    if (selection.categoryName === "addressDetails") {
      var index = this.addressDetails.indexOf(selection);
      this.addressDetails[index].fieldValue = false;
    }
    if (selection.categoryName === "attendanceSettings") {
      var index = this.attendanceSettings.indexOf(selection);
      this.attendanceSettings[index].fieldValue = false;
    }
    if (selection.categoryName === "attendanceRecords") {
      var index = this.attendanceRecords.indexOf(selection);
      this.attendanceRecords[index].fieldValue = false;
    }
    if (selection.categoryName === "leaveSettings") {
      var index = this.leaveSettings.indexOf(selection);
      this.leaveSettings[index].fieldValue = false;
    }
    if (selection.categoryName === "leaveTransactions") {
      var index = this.leaveTransactions.indexOf(selection);
      this.leaveTransactions[index].fieldValue = false;
    }
    if (selection.categoryName === "expenseSettings") {
      var index = this.expenseSettings.indexOf(selection);
      this.expenseSettings[index].fieldValue = false;
    }
    if (selection.categoryName === "expenseTransactions") {
      var index = this.expenseTransactions.indexOf(selection);
      this.expenseTransactions[index].fieldValue = false;
    }

  }

  generateReport() {
    const body = {
      "payrollMaster": {
        "fixedAllowances": this.fixedAllowances.filter(fixedAllowance => fixedAllowance.fieldValue),
        "variableAllowances": this.variableAllowances.filter(variableAllowance => variableAllowance.fieldValue),
        "employerContributions": this.employerContributions.filter(employerContribution => employerContribution.fieldValue),
        "fixedDeductions": this.fixedDeductions.filter(fixedDeduction => fixedDeduction.fieldValue),
        "employeeDeductions": this.employeeDeductions.filter(employeeDeduction => employeeDeduction.fieldValue)
      },
      "employeeMaster": {
        "addressDetails": this.addressDetails.filter(addressDetail => addressDetail.fieldValue),
        "bankDetails": this.bankDetails.filter(bankDetail => bankDetail.fieldValue),
        "personalDetails": this.personalDetails.filter(personalDetail => personalDetail.fieldValue)
      },
      "attendanceMaster": {
        "attendanceRecords": this.attendanceRecords.filter(attendanceRecord => attendanceRecord.fieldValue),
        "attendanceSettings": this.attendanceSettings.filter(attendanceSetting => attendanceSetting.fieldValue)
      },
      "leaveMaster": {
        "leaveSettings": this.leaveSettings.filter(leaveSetting => leaveSetting.fieldValue),
        "leaveTransactions": this.leaveTransactions.filter(leaveTransaction => leaveTransaction.fieldValue)
      },
      "expenseMaster": {
        "expenseSettings": this.expenseSettings.filter(expenseSetting => expenseSetting.fieldValue),
        "expenseTransactions": this.expenseTransactions.filter(expenseTransaction => expenseTransaction.fieldValue)
      }
    }
    console.log(body);
    this.serviceApi.post("/v1/custom-reports/generate", body).subscribe(res => {
      window.open(environment.storageServiceBaseUrl + res.message);
    }, (err) => {

    }, () => {

    });
  }
}
