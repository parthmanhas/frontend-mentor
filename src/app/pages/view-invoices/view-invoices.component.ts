import { DatePipe, formatDate } from "@angular/common";
import { Component, ElementRef, HostListener, Input, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { BehaviorSubject, Subscription } from "rxjs";
import { AppComponent } from "src/app/app.component";
import { Invoice } from "src/app/types/types";
import { InvoiceForm, InvoiceItemForm } from "src/app/types/types";
import { v4 as uuidv4 } from 'uuid';


@Component({
    selector: 'app-view-invoices',
    templateUrl: './view-invoices.component.html',
})
export class ViewInvoicesComponent {

    dropdownVisible: boolean = false;
    createNewInvoiceVisible: boolean = false;
    paidChecked = false;
    pendingChecked = false;
    draftChecked = false;
    submitted = false;

    newInvoiceForm: InvoiceForm

    newItems: { name: FormControl, quantity: FormControl, price: FormControl }[] = [];

    filters$ = new BehaviorSubject<('paid' | 'pending' | 'draft')[]>([]);

    subscriptions: Subscription[] = [];

    @ViewChild('dropdown')
    dropdown: ElementRef | undefined;

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        const clickedInsideContainer = this.dropdown?.nativeElement.contains(event.target as Node);
        if (!clickedInsideContainer) {
            this.dropdownVisible = false;
        }
    }

    @Input()
    invoices: Invoice[] = []

    internalInvoices: Invoice[] = this.invoices;

    constructor(public appComponent: AppComponent, private router: Router, private fb: FormBuilder, private datePipe: DatePipe) {
        this.appComponent.invoices$.subscribe(invoices => {
            this.invoices = invoices;
            this.internalInvoices = invoices;
        });
        this.newInvoiceForm = this.fb.nonNullable.group({
            // probability of collision is 1 in 2^32
            city: ['', Validators.required],
            client: this.fb.nonNullable.group({
                email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
                name: ['', Validators.required],
                address: this.fb.nonNullable.group({
                    street: ['', Validators.required],
                    city: ['', Validators.required],
                    postCode: ['', Validators.required],
                    country: ['', Validators.required],
                })
            }),
            country: ['', Validators.required],
            createdAt: [new Date(), Validators.required],
            id: [uuidv4().slice(0, 8).toUpperCase(), Validators.required],
            items: this.fb.array<InvoiceItemForm>([]),
            paymentDueDate: [formatDate(new Date(), 'YYYY-MM-dd', 'en'), Validators.required],
            postCode: ['', Validators.required],
            projectName: ['', Validators.required],
            purchaseDate: [formatDate(new Date(), 'YYYY-MM-dd', 'en'), Validators.required],
            status: ['pending', Validators.required],
            street: ['', Validators.required],
        });

        this.subscriptions.push(this.newInvoiceForm.valueChanges.subscribe(() => {
            this.submitted = false;
        }))
    }

}