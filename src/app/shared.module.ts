import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { ReplaceUnderscorePipe } from './services/ReplaceUnderscorePipe';
import { FileValueAccessor } from './attendance/components/attendance-records/file-control-value-accessor';
import { FileValidator } from './attendance/components/attendance-records/file-input.validator';
import { RoundUpValuePipe } from './services/RoundUpValuePipe';
import { RoundOffValuePipe } from './services/RoundOffValuePipe';
import { BulkEmployeeInviteResponeModelComponent } from '../app/employees/components/employees-main/employees-main.component';
import { MatTabsModule, MatStepperModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatTableModule, MatDialogModule, MatPaginatorModule, MatRadioModule, MatNativeDateModule, MatTooltipModule, MatCheckboxModule, MatSlideToggleModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { NgSelectModule } from '@ng-select/ng-select';
@NgModule({
  imports: [
    CommonModule,
    AmazingTimePickerModule,
    MatTabsModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatTableModule,
    MatDialogModule,
    MatPaginatorModule,
    MatRadioModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    TableModule,
    MultiSelectModule,
    NgSelectModule
  ],
  exports: [
    AmazingTimePickerModule,
    ReplaceUnderscorePipe,
    RoundUpValuePipe,
    RoundOffValuePipe,
    BulkEmployeeInviteResponeModelComponent
  ]
  ,
  declarations: [
    ReplaceUnderscorePipe,
    RoundUpValuePipe,
    RoundOffValuePipe,
    FileValueAccessor,
    FileValidator,
    BulkEmployeeInviteResponeModelComponent
  ]
})
export class SharedModule { }
