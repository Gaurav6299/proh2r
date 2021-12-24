import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExpenseCategoriesComponent } from './tab/expense-categories/expense-categories.component';
import { ExpenseTemplatesComponent } from './tab/expense-templates/expense-templates.component';
import { TemplateAssignmentsComponent } from './tab/template-assignments/template-assignments.component';
import { environment } from '../../../../environments/environment';
import { AdvanceCategoriesComponent } from './tab/advance-categories/advance-categories.component';
import { AdvanceTemplatesComponent } from './tab/advance-templates/advance-templates.component';
import { AdvanceTemplateAssignmentComponent } from './tab/advance-template-assignment/advance-template-assignment.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @ViewChild(ExpenseCategoriesComponent) categoryChild: ExpenseCategoriesComponent;
  @ViewChild(ExpenseTemplatesComponent) tempChild: ExpenseTemplatesComponent;
  @ViewChild(TemplateAssignmentsComponent) tempAssignChild: TemplateAssignmentsComponent;
  @ViewChild(AdvanceCategoriesComponent) advCategoriesChild: AdvanceCategoriesComponent;
  @ViewChild(AdvanceTemplatesComponent) advTemplatesChild: AdvanceTemplatesComponent;
  @ViewChild(AdvanceTemplateAssignmentComponent) advTemplateAssignChild: AdvanceTemplateAssignmentComponent;
  panelFirstWidth: any;
  panelFirstHeight: any;
  selectedTab: any;
  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(res =>
      this.selectedTab = res.id
    );
  }

  ngOnInit() {
  }
  onTabChange() {
    if ($('.divtoggleDiv').length > 0) {
      this.panelFirstWidth = $('.divtoggleDiv')[0].offsetWidth;
      this.panelFirstHeight = $('.paneDiv')[0].offsetHeight;
      $('.divtoggleDiv')[1].style.display = 'none';
    }

  }
  selectedTabChange(event) {
    console.log(event);
    if (event.index === 0) {
      this.categoryChild.isLeftVisible = false;
      this.categoryChild.getAllExpenceCategory();
    } else if (event.index === 1) {
      this.tempChild.isLeftVisible = false;
      this.tempChild.getCategoryData();
    } else if (event.index === 2) {
      this.tempAssignChild.clearFilter();
      this.tempAssignChild.getTemplateAssignmentList();
    } else if (event.index === 3) {
      this.advCategoriesChild.isLeftVisible = false;
      this.advCategoriesChild.getAdvanceCategoriesList();
    } else if (event.index === 4) {
      this.advTemplatesChild.isLeftVisible = false;
      this.advTemplatesChild.getAdvanceTemplateData();
    } else if (event.index === 5) {
      this.advTemplateAssignChild.getTemplateAssignmentList();
    }
  }
}
