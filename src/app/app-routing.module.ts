import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewInvoicesComponent } from './pages/view-invoices/view-invoices.component';
import { ViewInvoiceComponent } from './pages/view-invoice/view-invoice.component';
import { canActivateViewInvoice } from './guards/access-guard';

const routes: Routes = [
  { path: '', redirectTo: 'view-invoices', pathMatch: 'full' },
  { path: 'view-invoices', component: ViewInvoicesComponent, pathMatch: 'full' },
  { path: 'view-invoice/:id', component: ViewInvoiceComponent, canActivate: [canActivateViewInvoice], pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
