import { Component, Input } from "@angular/core";

type Item = {
    name: string,
    quantity: number,
    price: number,
    total: number
}

@Component({
    selector: 'app-view-invoice-details',
    templateUrl: './view-invoice-details.component.html',
    styleUrls: ['./view-invoice-details.component.scss']
})
export class ViewInvoiceDetailsComponent {
    public id: string = 'XM9141';

    public invoiceDate: string = '19 Aug 2021';

    public email: string = 'jensen.huang@gmail.com';

    public paymentDueDate: string = '20 Sep 2021';

    public amountDue: string = '';

    public theme: 'light' | 'dark' = 'light';

    public name: string = 'Alex Grim';

    public orderCategory: string = 'Graphic Design';

    public shippingAddressItems: string[] = ['19 Union Terrace', 'London', 'E1 3EZ', 'United Kingdom'];

    public billingAddressItems: string[] = ['84 Church Way', 'Bradford', 'BD1 9PB', 'United Kingdom'];


    @Input()
    public headings: string[] = ['Item Name', 'QTY.', 'Price', 'Total'];

    @Input()
    public items: Item[] = [
        { name: 'Banner Design', price: 156, quantity: 1, total: 156 },
        { name: 'Email Design', price: 200, quantity: 2, total: 400 }
    ]

    constructor() {
        // calculate total of items in items array
        this.amountDue = this.items.reduce((acc, item) => {
            return acc + item.total;
        }, 0).toFixed(2);
    }

    get classes(): string[] {
        return ['view-invoice-details', `view-invoice-details--${this.theme}`];
    }

    get shippingAddress(): string {
        return this.shippingAddressItems.join('<br>');
    }

    get billingAddress(): string {
        return this.billingAddressItems.join('<br>');
    }

}