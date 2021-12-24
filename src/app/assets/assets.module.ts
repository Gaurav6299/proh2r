import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetsRoutingModule } from './assets-routing.module';
import { AssetCategoriesComponent, AddUpdateAssetCategoriesComponent, DeleteAssetCategoriesComponent } from '../assets/assets-management/tabs/asset-categories/asset-categories.component';
import { AssetsManagementComponent } from '../assets/assets-management/assets-management.component';
import { IdentificationLabelsComponent, AddUpdateLabelComponent, DeleteLabelComponent } from '../assets/assets-management/tabs/identification-labels/identification-labels.component';
import { OrganizationAssetsComponent, AddUpdateAssetComponent, DeleteAssetComponent } from '../assets/assets-management/tabs/organization-assets/organization-assets.component';
import { MatTabsModule, MatTableModule, MatInputModule, MatPaginatorModule, MatDialogModule, MatButtonModule, MatSelectModule, MatDatepickerModule, MatRadioModule, MatNativeDateModule, MatListModule, MatCheckboxModule, MatSlideToggleModule, MatTooltipModule } from '@angular/material';
import { AssetsComponent } from './assets.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { NgSelectModule } from '@ng-select/ng-select';
import { AccessComponentGuard } from '../services/access-permission.guard';



@NgModule({
  imports: [
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
    MatTooltipModule,
    CommonModule,
    AssetsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PaginatorModule,
    NgSelectModule,
    TableModule
  ],
  declarations: [
    AssetCategoriesComponent,
    AssetsManagementComponent,
    IdentificationLabelsComponent,
    OrganizationAssetsComponent,
    AddUpdateAssetCategoriesComponent,
    DeleteAssetCategoriesComponent,
    AddUpdateAssetComponent,
    DeleteAssetComponent,
    AddUpdateLabelComponent,
    DeleteLabelComponent,
    AssetsComponent
  ],
  entryComponents: [
    AddUpdateAssetCategoriesComponent,
    DeleteAssetCategoriesComponent,
    AddUpdateAssetComponent,
    DeleteAssetComponent,
    AddUpdateLabelComponent,
    DeleteLabelComponent
  ],
  providers: [
    AccessComponentGuard
  ]
})
export class AssetsModule { }
