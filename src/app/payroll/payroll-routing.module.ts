import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PayrollComponent } from './components/payroll/payroll.component';

import { PayrollHistoryComponent } from './components/run-payroll/payroll-history/payroll-history.component';
import { PayrollMonthlyComponent } from './components/run-payroll/payroll-monthly/payroll-monthly.component';

import { ManualAdjustArrearsComponent } from './components/run-payroll/payroll-monthly/stepper/step4/manual-adjust-arrears/manual-adjust-arrears.component';
import { ProcessOffcyclePaymentsComponent } from './components/process-offcycle-payments/process-offcycle-payments.component';
import { MonthlyOffcyclePaymentComponent } from './components/process-offcycle-payments/monthly-offcycle-payment/monthly-offcycle-payment.component';
import { PayslipsComponent } from './components/payslips/payslips.component';
import { ViewPaySlipComponent } from './components/payslips/actions/view-pay-slip/view-pay-slip.component';
import { ViewComponent } from './components/payslips/actions/view-pay-slip/view/view.component';
import { TaxPayslipComponent } from './components/payslips/actions/view-pay-slip/tax-payslip/tax-payslip.component';
import { DetailedPayslipComponent } from './components/payslips/actions/view-pay-slip/detailed-payslip/detailed-payslip.component';
import { FnfPayslipComponent } from './components/payslips/actions/view-pay-slip/fnf-payslip/fnf-payslip.component';
import { PublishPaySlipComponent } from './components/payslips/actions/publish-pay-slip/publish-pay-slip.component';
import { UnPublishPaySlipComponent } from './components/payslips/actions/un-publish-pay-slip/un-publish-pay-slip.component';
import { PayrollSettingComponent } from './components/payroll-setting/payroll-setting.component';
import { CtcTemplatesComponent } from './components/ctc-templates/ctc-templates.component';
import { AddCtcTemplatesComponent } from './components/ctc-templates/add-ctc-templates/add-ctc-templates.component';
import { EditCtcTemplateComponent } from './components/ctc-templates/edit-ctc-template/edit-ctc-template.component';
import { EditCtcTemplatePercentageComponent } from './components/ctc-templates/ctc-template-percentage/ctc-template-percentage.component';

import { LopReversalComponent } from './components/lop-reversal/lop-reversal.component';
import { AccessComponentGuard } from '../services/access-permission.guard';

const routes: Routes = [
  {
    path: '',
    component: PayrollComponent,
    children: [
      { path: '', component: PayrollComponent },
      { path: 'run-payroll', component: PayrollHistoryComponent, canActivate: [AccessComponentGuard], data: { role: 'proH2R_run_payroll' } },
      {
        path: 'payroll-monthly/:month/:year/:id', component: PayrollMonthlyComponent,
        children: [
          {
            path: '', component: PayrollMonthlyComponent,
            // children: [
            //   {
            //     path: '', component: PayrollMonthlyComponent,
            //   }
            // ],

          },
        ],
      },
      { path: 'manual-adjustment-arrears', component: ManualAdjustArrearsComponent },
      { path: 'process-offcycle-payments', component: ProcessOffcyclePaymentsComponent },
      {
        path: 'monthly-Offcycle-payment', component: MonthlyOffcyclePaymentComponent,
        children: [
          {
            path: '', component: MonthlyOffcyclePaymentComponent,
          }
        ],
      },
      { path: 'payslips', component: PayslipsComponent, canActivate: [AccessComponentGuard], data: { role: 'proH2R_payslips' } },
      { path: 'view-Payslip', component: ViewPaySlipComponent, canActivate: [AccessComponentGuard], data: { role: 'proH2R_payslips' } },
      { path: 'view-Payslip/:month/:year', component: ViewPaySlipComponent, canActivate: [AccessComponentGuard], data: { role: 'proH2R_payslips' } },
      { path: 'view-Payslip/employee/:id', component: ViewComponent, canActivate: [AccessComponentGuard], data: { role: 'proH2R_payslips' } },
      { path: 'view-Payslip/employee/:id/:recordId', component: ViewComponent, canActivate: [AccessComponentGuard], data: { role: 'proH2R_payslips' } },
      { path: 'tax-Payslip/employee/:id', component: TaxPayslipComponent, canActivate: [AccessComponentGuard], data: { role: 'proH2R_payslips' } },
      { path: 'detailed-Payslip/employee/:month/:year/:id', component: DetailedPayslipComponent, canActivate: [AccessComponentGuard], data: { role: 'proH2R_payslips' } },
      { path: 'fnf-Payslip/employee/:id', component: FnfPayslipComponent, canActivate: [AccessComponentGuard], data: { role: 'proH2R_payslips' } },
      { path: 'publish-Payslip', component: PublishPaySlipComponent, canActivate: [AccessComponentGuard], data: { role: 'proH2R_payslips' } },
      { path: 'publish-Payslip/:month/:year', component: PublishPaySlipComponent, canActivate: [AccessComponentGuard], data: { role: 'proH2R_payslips' } },
      { path: 'unpublish-Payslips', component: UnPublishPaySlipComponent, canActivate: [AccessComponentGuard], data: { role: 'proH2R_payslips' } },
      { path: 'unpublish-Payslips/:month/:year', component: UnPublishPaySlipComponent, canActivate: [AccessComponentGuard], data: { role: 'proH2R_payslips' } },
      { path: 'payroll-setting', component: PayrollSettingComponent, canActivate: [AccessComponentGuard], data: { role: 'proH2R_payroll_settings' } },

      { path: 'ctc-templates', component: CtcTemplatesComponent, canActivate: [AccessComponentGuard], data: { role: 'proH2R_ctc_templates' } },
      { path: 'add-ctc-template/:id', component: AddCtcTemplatesComponent, canActivate: [AccessComponentGuard], data: { role: 'proH2R_ctc_templates' } },
      { path: 'add-ctc-template', component: AddCtcTemplatesComponent, canActivate: [AccessComponentGuard], data: { role: 'proH2R_ctc_templates' } },
      { path: 'ctc-template-percentage/:id', component: EditCtcTemplatePercentageComponent, canActivate: [AccessComponentGuard], data: { role: 'proH2R_ctc_templates' } },
      { path: 'edit-ctc-template', component: EditCtcTemplateComponent, canActivate: [AccessComponentGuard], data: { role: 'proH2R_ctc_templates' } },
      { path: 'edit-ctc-template/:id', component: EditCtcTemplateComponent, canActivate: [AccessComponentGuard], data: { role: 'proH2R_ctc_templates' } },
     
      { path: 'lop-reversal', component: LopReversalComponent, canActivate: [AccessComponentGuard], data: { role: 'proH2R_lop_reversal' } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayrollRoutingModule { }
