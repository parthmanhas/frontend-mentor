import { Component, Input } from "@angular/core";

@Component({
    selector: 'app-view-invoice-status',
    templateUrl: './view-invoice-status.component.html',
    styleUrls: ['./view-invoice-status.component.scss']
})
export class ViewInvoiceStatusComponent {
        @Input()
        public state: 'paid' | 'pending' | 'draft' = 'pending';

        @Input()
        public theme: 'light' | 'dark' = 'light';
    
        get classes(): string[] {
            return ['view-invoice-status', `view-invoice-status--${this.theme}`];
        }
}