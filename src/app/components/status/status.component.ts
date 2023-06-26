import { Component, Input } from "@angular/core";

@Component({
    selector: 'app-status',
    templateUrl: './status.component.html',
    styleUrls: ['./status.component.scss']
})
export class StatusComponent {

    @Input()
    public state: 'paid' | 'pending' | 'draft' = 'pending';

    @Input()
    public size: 'small' | 'medium' | 'large' = 'medium';

    public get classes(): string[] {
        return ['status', `status--${this.state}`, `status--${this.size}`];
    }
}