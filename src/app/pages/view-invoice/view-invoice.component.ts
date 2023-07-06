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

    initItemForm(item: InvoiceItem): InvoiceItemForm {
        return this.fb.nonNullable.group({
            name: [item.name, Validators.required],
            quantity: [item.quantity, [Validators.required, Validators.min(1)]],
            price: [item.price, Validators.required],
        });
    }

    get getStatusClass() {
        const classes = [''];
        switch (this.editForm.value.status) {
            case 'paid':
                classes.push('bg-shamrock-50 dark:bg-shamrock-400 dark:bg-opacity-5');
                break;
            case 'pending':
                classes.push('bg-pizazz-50 dark:bg-pizazz-600 dark:bg-opacity-5');
                break;
            case 'draft':
                classes.push('bg-oxford-blue-50 dark:bg-selago-100 dark:bg-opacity-5');
                break;
        }

        return classes.join(' ');
    }

    // join the client address array with a <br> tag
    getAddress() {
        const address = this.editForm.value.client?.address;
        return `${address?.street}<br>${address?.city}<br>${address?.postCode}<br>`;
    }

    getObjectKeys(obj: any): string[] {
        return Object.keys(obj);
    }

    calculateTotal(quantity: number, price: number): number {
        return quantity * price;
    }

    deleteInvoice() {
        this.deleteFormVisible = false;
        this.appComponent.invoices$.next(this.appComponent.invoices$.value.filter(invoice => invoice.id !== this.editForm.value.id));
        this.router.navigate(['/view-invoices']);
    }

    toggleTheme(theme: 'light' | 'dark') {
        this.appComponent.theme$.next(theme);
    }

    goBackToViewInvoices() {
        this.router.navigate(['/view-invoices']);
    }

    markAsPaid() {
        const invoice = this.appComponent.invoices$.value.find(invoice => invoice.id === this.editForm.value.id) ?? null;
        if (invoice === null) {
            console.error('Invoice not found');
            return;
        }
        if (invoice.status === 'paid') {
            console.info('Invoice already paid');
            return;
        }
        invoice.status = 'paid';
        this.appComponent.invoices$.next(this.appComponent.invoices$.value.map(invoice => invoice.id === this.editForm.value.id ? { ...invoice, status: 'paid' } : invoice));
    }

    markAsPending() {
        const invoice = this.appComponent.invoices$.value.find(invoice => invoice.id === this.editForm.value.id) ?? null;
        if (invoice === null) {
            console.error('Invoice not found');
            return;
        }
        // return if already paid
        if (invoice.status === 'paid') {
            console.info('Invoice already paid');
            return;
        }
        if (invoice.status === 'pending') {
            console.info('Invoice already pending');
            return;
        }
        invoice.status = 'pending';
        this.appComponent.invoices$.next(this.appComponent.invoices$.value.map(invoice => invoice.id === this.editForm.value.id ? { ...invoice, status: 'pending' } : invoice));

    }

}