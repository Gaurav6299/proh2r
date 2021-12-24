import { Component, OnInit, ViewChild } from '@angular/core';
import { OrgProfileComponent } from './tabs/org-profile/org-profile.component';
import { OrgLocationsComponent } from './tabs/org-locations/org-locations.component';
import { OrgBankInfoComponent } from './tabs/org-bank-info/org-bank-info.component';
import { OrgSigDetailsComponent } from './tabs/org-sig-details/org-sig-details.component';
import { MatTabChangeEvent } from '@angular/material';
// import { OrganizationHeaderComponent } from '../organization-header/organization-header.component';
import { OrgDepartmentsComponent } from './tabs/org-departments/org-departments.component';
import { OrgSubDepartmentsComponent } from './tabs/org-sub-departments/org-sub-departments.component';
import { OrgDesignationsComponent } from './tabs/org-designations/org-designations.component';
import { OrgBandsComponent } from './tabs/org-bands/org-bands.component';
import { OrgHolidaysComponent } from './tabs/org-holidays/org-holidays.component';


@Component({
  selector: 'app-organization-setup',
  templateUrl: './organization-setup.component.html',
  styleUrls: ['./organization-setup.component.scss']
})
export class OrganizationSetupComponent implements OnInit {
  @ViewChild(OrgProfileComponent) orgProfileChild: OrgProfileComponent;
  @ViewChild(OrgLocationsComponent) orgLocationChild: OrgLocationsComponent;
  @ViewChild(OrgDepartmentsComponent) orgDepartmentsComponentChild: OrgDepartmentsComponent;
  @ViewChild(OrgSubDepartmentsComponent) orgSubDepartmentsComponentChild: OrgSubDepartmentsComponent;
  @ViewChild(OrgDesignationsComponent) orgDesignationsComponentChild: OrgDesignationsComponent;
  @ViewChild(OrgBandsComponent) orgBandsComponentChild: OrgBandsComponent;
  @ViewChild(OrgSigDetailsComponent) orgSignatoryChild: OrgSigDetailsComponent;
  @ViewChild(OrgHolidaysComponent) orgHolidaysComponentChild: OrgHolidaysComponent;




  panelFirstWidth: any;
  panelFirstHeight: any;
  currentTab = 0;

  constructor() { }

  ngOnInit() {
  }



  onLinkClick(event: MatTabChangeEvent) {
    console.log('event => ', event);
    console.log('index => ', event.index);
    console.log('tab => ', event.tab);
    this.currentTab = event.index;

    console.log(event);
    // OrgProfileComponent
    // OrgLocationsComponent
    // OrgDepartmentsComponent
    // OrgSubDepartmentsComponent
    // OrgDesignationsComponent
    // OrgBandsComponent
    // OrgSigDetailsComponent
    // OrgHolidaysComponent
    if (event.index === 0) {
      this.orgProfileChild.getCompanyBasicInformation();
      this.orgProfileChild.getCompanyAddressInformation();
      this.orgProfileChild.cancelCompanyInformationSave();
      this.orgProfileChild.isLeftVisible = false;
    } else if (event.index === 1) {
      this.orgLocationChild.getAllLocation();
      this.orgLocationChild.getOrganizations();
      this.orgLocationChild.resetFormControlValueOnLoad();
      // this.currentTab = event.index;
    } else if (event.index === 2) {
      this.orgDepartmentsComponentChild.getAllDepartments();
      this.orgDepartmentsComponentChild.getAllSubDepartments();
    } else if (event.index === 3) {
      this.orgSubDepartmentsComponentChild.getAllSubDepartments();
    } else if (event.index === 4) {
      this.orgDesignationsComponentChild.getAllDesignation();
    }
    else if (event.index === 5) {
      this.orgBandsComponentChild.getAllBands();
    }
    else if (event.index === 6) {
      this.orgSignatoryChild.getAllSignatoryInformation();
    }
    else if (event.index === 7) {
      // this.orgHolidaysComponentChild.getAllBands();
      // this.orgHolidaysComponentChild.getAllDepartments();
      // this.orgHolidaysComponentChild.getAllDesignations();
      this.orgHolidaysComponentChild.getAllHoliday();
      // this.orgHolidaysComponentChild.getAllHolidayOfSelectedYear();
      // this.orgHolidaysComponentChild.getAllOrgLocations();
      this.orgHolidaysComponentChild.getCriteria();
    }
  }

  onTabChange(event) {
    console.log(event);
    if ($('.divtoggleDiv').length > 0) {
      this.panelFirstWidth = $('.divtoggleDiv')[0].offsetWidth;
      this.panelFirstHeight = $('.paneDiv')[0].offsetHeight;
      $('.divtoggleDiv')[1].style.display = 'none';
    }
  }

}
