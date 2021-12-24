import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChapterViDeductionsComponent } from './tabs/chapter-vi-deductions/chapter-vi-deductions.component';
import { Employees80CDeductionsComponent } from './tabs/employees80-c-deductions/employees80-c-deductions.component';
import { IncomeLossOnHousePropertyComponent } from './tabs/income-loss-on-house-property/income-loss-on-house-property.component';
import { OtherIncomeInfoComponent } from './tabs/other-income-info/other-income-info.component';
import { PerquisitesComponent } from './tabs/perquisites/perquisites.component';
import { PreviousEmploymentInformationComponent } from './tabs/previous-employment-information/previous-employment-information.component';
import { RentInformationComponent } from './tabs/rent-information/rent-information.component';

@Component({
  selector: 'app-tax-declarations',
  templateUrl: './tax-declarations.component.html',
  styleUrls: ['./tax-declarations.component.scss']
})
export class TaxDeclarationsComponent implements OnInit {
  @ViewChild(ChapterViDeductionsComponent) index_1_Child: ChapterViDeductionsComponent;
  @ViewChild(Employees80CDeductionsComponent) index_0_Child: Employees80CDeductionsComponent;
  @ViewChild(RentInformationComponent) index_2_Child: RentInformationComponent;
  @ViewChild(PerquisitesComponent) index_3_Child: PerquisitesComponent;
  @ViewChild(IncomeLossOnHousePropertyComponent) index_4_Child: IncomeLossOnHousePropertyComponent;
  @ViewChild(PreviousEmploymentInformationComponent) index_5_Child: PreviousEmploymentInformationComponent;
  @ViewChild(OtherIncomeInfoComponent) index_6_Child: OtherIncomeInfoComponent;
  panelFirstWidth: any;
  panelFirstHeight: any;
  empCode: any;
  taxationYear: any;
  constructor(private router: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(res =>
      this.empCode = res.empCode);
    this.route.params.subscribe(res => {
      this.taxationYear = res.taxationYear;
    }, (err) => {

    }, () => {

    });
  }
  backToNavigate() {
    this.router.navigate(['/employees/edit-employee/' + this.empCode]);
  }
  ngOnInit() {
  }
  onTabChange(event) {
    if ($('.divtoggleDiv').length > 0) {
      this.panelFirstWidth = $('.divtoggleDiv')[0].offsetWidth;
      this.panelFirstHeight = $('.paneDiv')[0].offsetHeight;
      $('.divtoggleDiv')[1].style.display = 'none';
    }
  }
  selectedTabChange(event) {
    if (event.index === 0) {
      this.index_0_Child.getTaxDeclarationFor80C();
    } else if (event.index === 1) {
      this.index_1_Child.getChapterVIDeductinos();
    } else if (event.index === 2) {
      this.index_2_Child.getRentInfo();
      this.index_2_Child.applyToAllForm.reset();
    } else if (event.index === 3) {
      this.index_3_Child.getPerquisitesDetails();
    } else if (event.index === 4) {
      this.index_4_Child.getInterestOnHomeLoan();
    } else if (event.index === 5) {
      this.index_5_Child.getPreviousEmploymentInformation();
    } else if (event.index === 6) {
      this.index_6_Child.getOtherInfoDetails();
    }
  }
}
