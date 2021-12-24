import { Component, OnInit } from '@angular/core';
import { ActiveEmployeesComponent } from '../active-employees/active-employees.component';
import { ProcessedEmployeesComponent } from '../processed-employees/processed-employees.component';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ViewChild } from '@angular/core';
@Component({
  selector: 'app-attendance-process-tab',
  templateUrl: './attendance-process-tab.component.html',
  styleUrls: ['./attendance-process-tab.component.scss']
})
export class AttendanceProcessTabComponent implements OnInit {
  @ViewChild(ActiveEmployeesComponent) activeEmployeesComponent: ActiveEmployeesComponent;
  @ViewChild(ProcessedEmployeesComponent) processedEmployeesComponent: ProcessedEmployeesComponent;
  monthName: any;
  processId: any;
  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe(params => {
      this.monthName = params['monthYear'];
      this.processId = params['id'];
    });
  }

  ngOnInit() {
  }

  onTabChange(event: any) {
    if (event.index == 0) {
      this.activeEmployeesComponent.getAllActiveAttendanceRecord(this.monthName);
    } else if (event.index = 1) {
      this.processedEmployeesComponent.getAllProcessedAttendanceRecord(this.monthName);
    }
  }

}
