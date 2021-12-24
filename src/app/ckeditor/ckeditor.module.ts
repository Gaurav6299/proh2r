import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateeditorComponent } from './components/templateeditor/templateeditor.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [TemplateeditorComponent],
  declarations: [TemplateeditorComponent],
})
export class CkeditorModule { }
