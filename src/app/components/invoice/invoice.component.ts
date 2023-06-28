import { Component, Input } from "@angular/core";

@Component({
    selector: 'app-invoice',
    templateUrl: './invoice.component.html',
    styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent {

    @Input()
    public id: string = 'RT3080';

    @Input()
    public date: string = 'Due  19 Aug 2021';

    @Input()
    public name: string = 'Jensen Huang';

    @Input()
    public amount: string = '£ 1,800.90';

    @Input()
    public state: 'paid' | 'pending' | 'draft' = 'pending';

    @Input()
    public theme: 'light' | 'dark' = 'light';

    get classes(): string[] {
        return ['invoice', `invoice--${this.theme === 'light' ? 'light' : 'dark'}`];
    }


    
}