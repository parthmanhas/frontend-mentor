import { FormArray, FormControl, FormGroup } from "@angular/forms";

// InvoiceAddress and InvoiceAddressForm should be same
export type InvoiceAddress = {
    street: string,
    city: string,
    postCode: string,
    country: string,
}

export type InvoiceAddressForm = FormGroup<{
    street: FormControl<string>,
    city: FormControl<string>,
    postCode: FormControl<string>,
    country: FormControl<string>,
}>

// InvoiceClient and InvoiceClientForm should be same
export type InvoiceClient = {
    address: {
        city: string,
        country: string,
        postCode: string,
        street: string,
    },
    email: string,
    name: string,
}

export type InvoiceClientForm = FormGroup<{
    name: FormControl<string>,
    email: FormControl<string>,
    address: InvoiceAddressForm
}>

// InvoiceItem and InvoiceItemForm should be same
export type InvoiceItem = {
    name: string,
    price: number,
    quantity: number,
}

export type InvoiceItemForm = FormGroup<{
    name: FormControl<string>,
    price: FormControl<number>,
    quantity: FormControl<number>,
}>

// Invoice and InvoiceForm should be same
export type Invoice = {
    city: string,
    client: InvoiceClient,
    country: string,
    createdAt: Date,
    id: string,
    items: InvoiceItem[],
    paymentDueDate: string,
    postCode: string,
    projectName: string,
    purchaseDate: string,
    status: 'paid' | 'pending' | 'draft',
    street: string,
}

export type InvoiceForm = FormGroup<{
    city: FormControl<string>,
    client: InvoiceClientForm,
    country: FormControl<string>,
    createdAt: FormControl<Date>,
    id: FormControl<string>,
    items: FormArray<InvoiceItemForm>,
    paymentDueDate: FormControl<string>,
    postCode: FormControl<string>,
    projectName: FormControl<string>,
    purchaseDate: FormControl<string>,
    status: FormControl<string>,
    street: FormControl<string>,
}>