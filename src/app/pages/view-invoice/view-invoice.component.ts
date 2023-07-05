import { formatDate } from "@angular/common";
import { Component, Input } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, NonNullableFormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AppComponent } from "src/app/app.component";
import { Invoice, InvoiceItem } from "src/app/types/types";
import { InvoiceForm, InvoiceItemForm } from "src/app/types/types";

@Component({
    selector: 'app-view-invoice',
    templateUrl: './view-invoice.component.html'
})
export class ViewInvoiceComponent {

    editFormVisible: boolean = false;
    deleteFormVisible: boolean = false;
    editForm!: InvoiceForm;
    total: number = 0;
    submitted: boolean = false;

    constructor(public appComponent: AppComponent, private router: Router, private fb: FormBuilder) {
        this.appComponent.invoices$.subscribe(invoices => {
            const id = this.router.url.split('/').pop();
            const invoice = invoices.find(invoice => invoice.id === id);
            if (!invoice) {
                console.error('Invoice not found');
                return;
            }
            this.initInvoiceForm(invoice);
        });

    }

    initInvoiceForm(invoice: Invoice) {        
        this.editForm = this.fb.nonNullable.group({
            // probability of collision is 1 in 2^32
            id: [invoice.id, Validators.required],
            street: [invoice.street, Validators.required],
            city: [invoice.city, Validators.required],
            client: this.fb.nonNullable.group({
                email: [invoice.client.email, [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
                name: [invoice.client.name, Validators.required],
                address: this.fb.nonNullable.group({
                    street: [invoice.client.address.street, Validators.required],
                    city: [invoice.client.address.city, Validators.required],
                    postCode: [invoice.client.address.postCode, Validators.required],
                    country: [invoice.client.address.country, Validators.required],
                })
            }),
            country: [invoice.country, Validators.required],
            postCode: [invoice.postCode, Validators.required],
            // get items from invoice and initialize form array
            items: this.fb.array(invoice.items.map(item => this.initItemForm(item))),
            purchaseDate: [formatDate(invoice.purchaseDate, 'YYYY-MM-dd', 'en'), Validators.required],
            paymentDueDate: [formatDate(invoice.paymentDueDate, 'YYYY-MM-dd', 'en'), Validators.required],
            projectName: [invoice.projectName, Validators.required],
            status: [invoice.status as string, Validators.required],
            createdAt: [new Date(), Validators.required]
        });

        // calculate total of invoice items
        this.editForm.value.items?.forEach(item => this.total += (item.quantity ?? 0) * (item.price ?? 0));
    }


}