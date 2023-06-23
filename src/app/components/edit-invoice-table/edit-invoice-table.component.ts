import { Component, Input } from "@angular/core";

type Item = {
    name: string;
    qty: number;
    price: number;
    total: number;
}

@Component({
    selector: 'app-edit-invoice-table',
    templateUrl: './edit-invoice-table.component.html',
    styleUrls: ['./edit-invoice-table.component.scss']
})
export class EditInvoiceTable {
    @Input()
    public headings: string[] = ['Item Name', 'Qty', 'Price', 'Total'];

    @Input()
    public items: Item[] = []

    @Input()
    public theme: 'light' | 'dark' = 'light';

    constructor() {
        // add an empty element for delete in heading
        this.headings.push('');
    }

    get classes(): string {
        return `edit-invoice-table edit-invoice-table--${this.theme}`;
    }
}