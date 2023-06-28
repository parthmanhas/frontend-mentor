import { Component, Input } from "@angular/core";

@Component({
    selector: 'app-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss']
})
export class InputComponent {

    @Input()
    theme: 'light' | 'dark' = 'light';    

    @Input()
    label: string = 'Label';

    @Input()
    placeholder: string = 'Placeholder';

    @Input()
    value: string = '';

    @Input()
    type: string = 'text';

    @Input()
    size: 'small' | 'medium' | 'large' = 'medium';

    @Input()
    weight: 'normal' | 'bold' = 'normal';

    @Input()
    labelColor: string = '';

    get classes(): string {
        return `input input--${this.theme} input--size--${this.size} input--weight--${this.weight}`;
    }
}