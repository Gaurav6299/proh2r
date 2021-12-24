import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { AssetCategoriesComponent } from './tabs/asset-categories/asset-categories.component';
import { IdentificationLabelsComponent } from './tabs/identification-labels/identification-labels.component';
import { OrganizationAssetsComponent } from './tabs/organization-assets/organization-assets.component';
import { MatTabChangeEvent } from '@angular/material';

@Component({
  selector: 'app-assets-management',
  templateUrl: './assets-management.component.html',
  styleUrls: ['./assets-management.component.scss']
})
export class AssetsManagementComponent implements OnInit {

  @ViewChild(AssetCategoriesComponent) assetCategoriesComponentChild: AssetCategoriesComponent;
  @ViewChild(IdentificationLabelsComponent) identificationLabelsComponentChild: IdentificationLabelsComponent;
  @ViewChild(OrganizationAssetsComponent) organizationAssetsComponentChild: OrganizationAssetsComponent;
  constructor() { }

  ngOnInit() {
  }
  onTabChange(event: MatTabChangeEvent) {
    if (event.index === 0) {
      console.log('Inside Category Tab...');
      this.assetCategoriesComponentChild.getAllCategories();

    }
    else if (event.index === 1) {
      console.log('Inside Label Tab...');
      this.identificationLabelsComponentChild.getAllIdentificationLabels();
    }

    else{
      this.organizationAssetsComponentChild.getAllAssetsList();
      this.organizationAssetsComponentChild.getAllCategories();
      this.organizationAssetsComponentChild.getAllIdentificationLabel();
    }
  }
}

