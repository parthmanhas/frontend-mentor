import { Component, Input, OnChanges } from "@angular/core";

type Item = {
    name: string,
    quantity: number,
    price: number,
    total: number,
    [key: string] : any
}

@Component({
    selector: 'app-view-invoice-details-table',
    templateUrl: './view-invoice-details-table.component.html',
    styleUrls: ['./view-invoice-details-table.component.scss']
})
export class ViewInvoiceDetailsTableComponent implements OnChanges {

    @Input()
    public theme: 'light' | 'dark' = 'light';

    @Input()
    public headings: string[] = [];

    @Input()
    public items: Item[] = [
        { name: 'Banner Design', price: 156, quantity: 1, total: 156 },
        { name: 'Email Design', price: 200, quantity: 2, total: 400 }
    ]

    get classes(): string[] {
        return ['view-invoice-details-table', `view-invoice-details-table--${this.theme}`];
    }

    ngOnChanges() {
        // if items are present and headings.length !== single item key's length, then throw error
        if (this.items.length && this.headings.length !== Object.keys(this.items[0]).length) {
            throw new Error(`Headings length must match item keys length: headings length = ${this.headings.length}, items keys length = ${Object.keys(this.items[0]).length}`);
        }
    }

    getObjectKeys(obj: any): string[] {
        return Object.keys(obj);
    }

}