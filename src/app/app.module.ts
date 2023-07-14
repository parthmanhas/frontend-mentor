import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule, DatePipe } from '@angular/common';
import { ViewInvoicesComponent } from './pages/view-invoices/view-invoices.component';
import { ViewInvoiceComponent } from './pages/view-invoice/view-invoice.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AccessGuard } from './guards/access-guard';

@NgModule({
  declarations: [
    AppComponent,
    ViewInvoicesComponent,
    ViewInvoiceComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [AccessGuard, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
