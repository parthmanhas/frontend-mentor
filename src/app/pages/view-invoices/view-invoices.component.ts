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

    get itemsFormArrayControls() {
        return this.newInvoiceForm.controls.items
    }

    // filter invoices by status
    filterInvoices(status: 'paid' | 'pending' | 'draft', event: Event) {
        if ((event.target as HTMLInputElement).checked) {
            this.filters$.next([...this.filters$.value, status]);
        } else {
            this.filters$.next(this.filters$.value.filter(filter => filter !== status));
        }

        if (this.filters$.value.length === 0) {
            this.internalInvoices = this.invoices;
        } else {
            this.internalInvoices = this.invoices.filter(invoice => this.filters$.value.includes(invoice.status));
        }
    }

    // calculate total amount of all items in an invoice
    calculateTotalItemsAmount(invoice: Invoice) {
        return invoice.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    }

    showDropdown(event: MouseEvent) {
        this.dropdownVisible = !this.dropdownVisible;
        event.stopPropagation();
    }

    stopPropagation(event: MouseEvent) {
        event.stopPropagation();
    }

    getStatusClass(status: 'paid' | 'pending' | 'draft') {
        const classes = [''];
        switch (status) {
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

    getStatusCircle(status: 'paid' | 'pending' | 'draft') {
        switch (status) {
            case 'paid':
                return '#33D69F';
            case 'pending':
                return '#FBBF24';
            case 'draft':
                return '#F87171';
        }
    }

    toggleCheckbox(type: string, event: Event): void {
        event.stopPropagation();

        switch (type) {
            case 'paid':
                this.paidChecked = !this.paidChecked;
                break;
            case 'pending':
                this.pendingChecked = !this.pendingChecked;
                break;
            case 'draft':
                this.draftChecked = !this.draftChecked;
                break;
            default:
                break;
        }
    }

    toggleTheme(theme: 'light' | 'dark') {
        this.appComponent.theme$.next(theme);
    }

    selectInvoice(invoice: Invoice) {
        // this.appComponent.selectedInvoice$.next(invoice);
        const navigationExtras = { state: { fromViewInvoices: true } };
        this.router.navigate(['/view-invoice', invoice.id], navigationExtras);
    }

    initItem(): FormGroup {
        return this.fb.group({
            name: ['', Validators.required],
            quantity: ['', [Validators.required, Validators.min(1)]],
            price: ['', Validators.required],
        });
    }

    get items() {
        return this.newInvoiceForm.controls.items as FormArray<InvoiceItemForm>;
    }

    addNewItem() {
        this.newInvoiceForm.controls.items.push(this.initItem());
    }

    deleteItem(index: number) {
        this.newInvoiceForm.controls.items.removeAt(index);
    }

    getTotal(item: FormGroup) {
        return item.get('quantity')?.value * item.get('price')?.value;
    }

    submit(status: 'pending' | 'draft') {
        this.newInvoiceForm.markAsDirty();
        this.submitted = true;
        this.newInvoiceForm.controls.status.setValue(status);
        if(this.newInvoiceForm.valid) {
            const newInvoice: Invoice = this.newInvoiceForm.value as Invoice;
            this.appComponent.invoices$.next([...this.appComponent.invoices$.value, newInvoice]);
            this.createNewInvoiceVisible = false;
            this.newInvoiceForm.reset();
        } else {
            console.info('Form is invalid');
        }
    }

    inputInvalidClass(control: FormControl) {
        if (control.invalid && this.submitted)
            return "border-red-500 dark:border-red-500";
        return '';
    }

    labelInvalidClass(control: FormControl) {
        if (control.invalid && this.submitted)
            return "text-red-500 dark:text-red-500";
        return '';
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

}