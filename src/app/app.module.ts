import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonComponent } from './components/button/button.component';
import { CommonModule } from '@angular/common';
import { StatusComponent } from './components/status/status.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { ViewInvoiceStatusComponent } from './components/view-invoice-status/view-invoice-status.component';
import { ViewInvoiceDetailsComponent } from './components/view-invoice-details/view-invoice-details.component';
import { InputComponent } from './components/input/input.component';
import { EditInvoiceTable } from './components/edit-invoice-table/edit-invoice-table.component';
import { ViewInvoiceDetailsTableComponent } from './components/view-invoice-details-table/view-invoice-details-table.component';
import { IconComponent } from './components/icon/icon.component';

@NgModule({
  declarations: [
    AppComponent,
    ButtonComponent,
    EditInvoiceTable,
    IconComponent,
    InvoiceComponent,
    InputComponent,
    ViewInvoiceStatusComponent,
    ViewInvoiceDetailsComponent,
    ViewInvoiceDetailsTableComponent,
    StatusComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
