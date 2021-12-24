import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

 import { FlatpickrModule } from 'angularx-flatpickr';
//  import { DateAdapter } from 'angular-calendar';
 import { CalendarModule as AngCalendar } from 'angular-calendar';
//  import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';


import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarComponent } from './components/calendar/calendar.component';
import { CalendarViewComponent } from './components/calendar/tab/calendar-view/calendar-view.component';
import { MilestonsViewComponent, DeleteMilestoneDialogComponent } from './components/calendar/tab/milestons-view/milestons-view.component';
import { MilestoneLeftRightComponent } from './components/calendar/tab/milestons-view/milestone-left-right/milestone-left-right.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClientModule } from '@angular/common/http';
import { ColorPickerModule } from 'primeng/colorpicker';
import {
  MatTabsModule,
  MatTableModule,
  MatInputModule,
  MatPaginatorModule,
  MatDialogModule,
  MatButtonModule,
  MatSelectModule,
  MatDatepickerModule,
  MatRadioModule,
  MatNativeDateModule,
  MatListModule,
  MatCheckboxModule,
  MatSlideToggleModule
} from '@angular/material';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
@NgModule({
  imports: [
    CommonModule,
    CalendarRoutingModule,
    MatTabsModule,
    MatTableModule,
    MatInputModule,
    MatPaginatorModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatRadioModule,
    MatNativeDateModule,
    MatListModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    TableModule,
    MultiSelectModule,
    HttpClientModule,
    // FlatpickrModule.forRoot(),
        //  AngCalendar.forRoot({
        //    provide: DateAdapter,
        //    useFactory: adapterFactory,
        //  }),
        AngCalendar.forRoot(),
         
    ColorPickerModule
  ],
  declarations: [
    CalendarComponent,
    CalendarViewComponent,
    MilestonsViewComponent,
    DeleteMilestoneDialogComponent,
    MilestoneLeftRightComponent
  ],
  entryComponents: [
    DeleteMilestoneDialogComponent
  ]
})
export class CalendarModule { }




