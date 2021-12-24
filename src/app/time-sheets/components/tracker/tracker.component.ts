import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActivityFeedTrackerComponent } from './tab/activity-feed-tracker/activity-feed-tracker.component';
import { TaskTrackerComponent } from './tab/task-tracker/task-tracker.component';
import { ProjectsComponent } from '../projects/projects.component';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.scss']
})
export class TrackerComponent implements OnInit {
  @ViewChild(ActivityFeedTrackerComponent) activitiFeedTrackerChild: ActivityFeedTrackerComponent;
  @ViewChild(TaskTrackerComponent) taskTrackerChild: TaskTrackerComponent;
  private selectedProject = 1;
  panelFirstWidth: any;
  panelFirstHeight: any;
  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(res =>
      this.selectedProject = res.projectId);
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
      this.taskTrackerChild.isLeftVisible = false;
      this.taskTrackerChild.getAllTask();
    }
  }
}
