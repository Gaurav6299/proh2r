import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTable } from 'primeng/primeng';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { environment } from '../../../../../../environments/environment';
declare var $: any;
@Component({
  selector: 'app-tax',
  templateUrl: './tax.component.html',
  styleUrls: ['./tax.component.scss']
})
export class TaxComponent implements OnInit {
  @ViewChild('dt1') dt: DataTable;
  columns = [
    { field: 'taxationYear', header: 'Financial year' },
    { field: 'total80CDeclarations', header: '80 C Deductions' },
    { field: 'totalSection10Exemptions', header: 'Section 10 Exemptions' },
    { field: 'totalChapter6Declarations', header: 'Chapter VI Deductions' },
    { field: 'totalPerquisites', header: 'Total Perquisites' },
    { field: 'totalIncomeLossOnHousingProperty', header: 'Interest On Home Loan' },
    { field: 'totalPreviousEmploymentInformation', header: ' Previous Employment Information' },
    { field: 'actions', header: 'Actions' }
  ];
  taxDeclarationsList = [];
  empCode: any;
  constructor(private serviceApi: ApiCommonService, private router: Router, private route: ActivatedRoute,) {
    this.route.params.subscribe(res =>
      this.empCode = res.id);
  }
  successNotification(successMessage: any) {
    $.notifyClose();
    $.notify({
      icon: 'check_circle',
      message: successMessage,
    },
      {
        type: 'success',
        timer: 4000,
        placement: {
          from: 'top',
          align: 'center'
        }
      });
  }
  warningNotification(warningMessage: any) {
    $.notifyClose();
    $.notify({
      icon: 'error',
      message: warningMessage,
    },
      {
        type: 'warning',
        timer: 4000,
        placement: {
          from: 'top',
          align: 'center'
        }
      });
  }
  getTaxDeclaration() {
    this.taxDeclarationsList = [];
    this.serviceApi.get('/v1/employee/taxDeclaration/getIndividual?empCode=' + this.empCode).
      subscribe(
        res => {
          this.taxDeclarationsList = res;
        }, (err) => {

        }, () => {

        });
  }
  ngOnInit() {
    this.getTaxDeclaration();
  }
  goToComponents(event: any) {
    this.router.navigate(['/employees/taxDeclarations/' + event.employeeTaxDeclarationId + '/' + event.taxationYear], { queryParams: { empCode: this.empCode } });
  }
  goToTaxCalculator(event: any) {
    this.router.navigate(['/employees/tax_calculator' + '/' + event.employeeTaxDeclarationId], { queryParams: { empCode: this.empCode } });
  }
  downloadInvestments(event: any) {
    this.serviceApi.get('/v1/employee/taxDeclaration/generate/form/12bb/' + event.employeeTaxDeclarationId).subscribe(
      res => {
        window.open(environment.storageServiceBaseUrl + res.url);
      }, (err) => {

      }, () => {

      });
  }
}
