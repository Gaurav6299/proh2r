import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupReportListComponent } from './tabs/group-report-list/group-report-list.component';
import { Proh2rReportsComponent } from './tabs/proh2r-reports/proh2r-reports.component';
import { CategoryComponent } from './tabs/category/category.component';
declare var $: any;
@Component({
  selector: 'app-report-setting',
  templateUrl: './report-setting.component.html',
  styleUrls: ['./report-setting.component.scss']
})
export class ReportSettingComponent implements OnInit {
  @ViewChild(CategoryComponent) categoryChild: CategoryComponent;
  @ViewChild(Proh2rReportsComponent) proh2rReportsChild: Proh2rReportsComponent;
  @ViewChild(GroupReportListComponent) groupReportListChild: GroupReportListComponent;
  private selectedTab = 1;
  panelFirstWidth: any;
  panelFirstHeight: any;
  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(res =>
      this.selectedTab = res.id);
  }
  onTabChange() {
    if ($('.divtoggleDiv').length > 0) {
      this.panelFirstWidth = $('.divtoggleDiv')[0].offsetWidth;
      this.panelFirstHeight = $('.paneDiv')[0].offsetHeight;
      $('.divtoggleDiv')[1].style.display = 'none';
    }
  }
  ngOnInit() {
  }
  selectedTabChange(event) {
    console.log(event);
    if (event.index === 0) {
      this.categoryChild.isLeftVisible = false;
      this.categoryChild.getAllCategories();
    } else if (event.index === 1) {
      this.proh2rReportsChild.isLeftVisible = false;
      this.proh2rReportsChild.getReportType();
    } else if (event.index === 2) {
      this.groupReportListChild.isLeftVisible = false;
      this.groupReportListChild.getAllReports();
      this.groupReportListChild.getReports();
      this.groupReportListChild.getAllSelections();
    }
  }

}
